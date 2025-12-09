import type {FlowClientCore} from "@onflow/fcl-core"
import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {encodeCalls, EvmBatchCall} from "./useCrossVmBatchTransaction"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowClient} from "./useFlowClient"

export interface UseCrossVmBridgeNftToEvmTxArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, UseCrossVmBridgeNftToEvmTxMutateArgs>,
    "mutationFn"
  >
  flowClient?: FlowClientCore
}

export interface UseCrossVmBridgeNftToEvmTxMutateArgs {
  nftIdentifier: string
  nftIds: string[]
  calls: EvmBatchCall[]
}

export interface UseCrossVmBridgeNftToEvmTxResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  crossVmBridgeNftToEvm: UseMutateFunction<
    string,
    Error,
    UseCrossVmBridgeNftToEvmTxMutateArgs
  >
  crossVmBridgeNftToEvmAsync: UseMutateAsyncFunction<
    string,
    Error,
    UseCrossVmBridgeNftToEvmTxMutateArgs
  >
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCrossVmBridgeNftToEvmTransaction = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FungibleToken from ${contractAddresses.FungibleToken}
import NonFungibleToken from ${contractAddresses.NonFungibleToken}
import ViewResolver from ${contractAddresses.ViewResolver}
import MetadataViews from ${contractAddresses.MetadataViews}
import FlowToken from ${contractAddresses.FlowToken}

import ScopedFTProviders from ${contractAddresses.ScopedFTProviders}

import EVM from ${contractAddresses.EVM}

import FlowEVMBridge from ${contractAddresses.FlowEVMBridge}
import FlowEVMBridgeConfig from ${contractAddresses.FlowEVMBridgeConfig}
import FlowEVMBridgeUtils from ${contractAddresses.FlowEVMBridgeUtils}

/// Bridges NFTs (from the same collection) from the signer's collection in Cadence to the signer's COA in FlowEVM
/// and then performs an arbitrary number of calls afterwards to potentially do things
/// with the bridged NFTs
///
/// NOTE: This transaction also onboards the NFT to the bridge if necessary which may incur additional fees
///     than bridging an asset that has already been onboarded.
///
/// @param nftIdentifier: The Cadence type identifier of the NFT to bridge - e.g. nft.getType().identifier
/// @param ids: The Cadence NFT.id of the NFTs to bridge to EVM
/// @params evmContractAddressHexes, calldatas, gasLimits, values: Arrays of calldata
///         to be included in transaction calls to Flow EVM from the signer's COA.
///         The arrays are all expected to be of the same length
///
transaction(
    nftIdentifier: String,
    ids: [UInt64],
    evmContractAddressHexes: [String],
    calldatas: [String],
    gasLimits: [UInt64],
    values: [UInt]
) {
    let nftType: Type
    let collection: auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}
    let coa: auth(EVM.Bridge, EVM.Call) &EVM.CadenceOwnedAccount
    let requiresOnboarding: Bool
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    
    prepare(signer: auth(CopyValue, BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        pre {
            (evmContractAddressHexes.length == calldatas.length)
            && (calldatas.length == gasLimits.length)
            && (gasLimits.length == values.length):
                "Calldata array lengths must all be the same!"
        }

        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge, EVM.Call) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA signer's account at path /storage/evm")
        
        /* --- Construct the NFT type --- */
        //
        // Construct the NFT type from the provided identifier
        self.nftType = CompositeType(nftIdentifier)
            ?? panic("Could not construct NFT type from identifier: ".concat(nftIdentifier))
        // Parse the NFT identifier into its components
        let nftContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: self.nftType)
            ?? panic("Could not get contract address from identifier: ".concat(nftIdentifier))
        let nftContractName = FlowEVMBridgeUtils.getContractName(fromType: self.nftType)
            ?? panic("Could not get contract name from identifier: ".concat(nftIdentifier))

        /* --- Retrieve the NFT --- */
        //
        // Borrow a reference to the NFT collection, configuring if necessary
        let viewResolver = getAccount(nftContractAddress).contracts.borrow<&{ViewResolver}>(name: nftContractName)
            ?? panic("Could not borrow ViewResolver from NFT contract with name "
                .concat(nftContractName).concat(" and address ")
                .concat(nftContractAddress.toString()))
        let collectionData = viewResolver.resolveContractView(
                resourceType: self.nftType,
                viewType: Type<MetadataViews.NFTCollectionData>()
            ) as! MetadataViews.NFTCollectionData?
            ?? panic("Could not resolve NFTCollectionData view for NFT type ".concat(self.nftType.identifier))
        self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(
                from: collectionData.storagePath
            ) ?? panic("Could not borrow a NonFungibleToken Collection from the signer's storage path "
                .concat(collectionData.storagePath.toString()))

        // Withdraw the requested NFT & set a cap on the withdrawable bridge fee
        var approxFee = FlowEVMBridgeUtils.calculateBridgeFee(
                bytes: 400_000 // 400 kB as upper bound on movable storage used in a single transaction
            ) + (FlowEVMBridgeConfig.baseFee * UFix64(ids.length))
        // Determine if the NFT requires onboarding - this impacts the fee required
        self.requiresOnboarding = FlowEVMBridge.typeRequiresOnboarding(self.nftType)
            ?? panic("Bridge does not support the requested asset type ".concat(nftIdentifier))
        // Add the onboarding fee if onboarding is necessary
        if self.requiresOnboarding {
            approxFee = approxFee + FlowEVMBridgeConfig.onboardFee
        }

        /* --- Configure a ScopedFTProvider --- */
        //
        // Issue and store bridge-dedicated Provider Capability in storage if necessary
        if signer.storage.type(at: FlowEVMBridgeConfig.providerCapabilityStoragePath) == nil {
            let providerCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(
                /storage/flowTokenVault
            )
            signer.storage.save(providerCap, to: FlowEVMBridgeConfig.providerCapabilityStoragePath)
        }
        // Copy the stored Provider capability and create a ScopedFTProvider
        let providerCapCopy = signer.storage.copy<Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>>(
                from: FlowEVMBridgeConfig.providerCapabilityStoragePath
            ) ?? panic("Invalid FungibleToken Provider Capability found in storage at path "
                .concat(FlowEVMBridgeConfig.providerCapabilityStoragePath.toString()))
        let providerFilter = ScopedFTProviders.AllowanceFilter(approxFee)
        self.scopedProvider <- ScopedFTProviders.createScopedFTProvider(
                provider: providerCapCopy,
                filters: [ providerFilter ],
                expiration: getCurrentBlock().timestamp + 1.0
            )
    }

    execute {
        if self.requiresOnboarding {
            // Onboard the NFT to the bridge
            FlowEVMBridge.onboardByType(
                self.nftType,
                feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
            )
        }

        // Iterate over requested IDs and bridge each NFT to the signer's COA in EVM
        for id in ids {
            // Withdraw the NFT & ensure it's the correct type
            let nft <-self.collection.withdraw(withdrawID: id)
            assert(
                nft.getType() == self.nftType,
                message: "Bridged nft type mismatch - requested: ".concat(self.nftType.identifier)
                    .concat(", received: ").concat(nft.getType().identifier)
            )
            // Execute the bridge to EVM for the current ID
            self.coa.depositNFT(
                nft: <-nft,
                feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
            )
        }

        // Destroy the ScopedFTProvider
        destroy self.scopedProvider

        // Perform all the calls
        for index, evmAddressHex in evmContractAddressHexes { 
            let evmAddress = EVM.addressFromString(evmAddressHex)

            let valueBalance = EVM.Balance(attoflow: values[index])
            let callResult = self.coa.call(
                to: evmAddress,
                data: calldatas[index].decodeHex(),
                gasLimit: gasLimits[index],
                value: valueBalance
            )
            assert(
                callResult.status == EVM.Status.successful,
                message: "Call failed with address \(evmAddressHex) and calldata \(calldatas[index]) with error \(callResult.errorMessage)"
            )
        }
    }
}
`
}

/**
 * Hook to send a cross-VM NFT bridge transaction from Cadence to EVM. This function will
 * bundle multiple EVM calls into one atomic Cadence transaction and return the transaction ID.
 *
 * Use `useCrossVmTransactionStatus` to watch the status of the transaction and get the transaction id + result of each EVM call.
 *
 * @returns The mutation object used to send the transaction.
 */
export function useCrossVmBridgeNftToEvm({
  mutation: mutationOptions = {},
  flowClient,
}: UseCrossVmBridgeNftToEvmTxArgs = {}): UseCrossVmBridgeNftToEvmTxResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCrossVmBridgeNftToEvmTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const mutation = useMutation(
    {
      mutationFn: async ({
        nftIdentifier,
        nftIds,
        calls,
      }: UseCrossVmBridgeNftToEvmTxMutateArgs) => {
        if (!cadenceTx) {
          throw new Error("No current chain found")
        }
        const encodedCalls = encodeCalls(calls)

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg: any, t: any) => [
            arg(nftIdentifier, t.String),
            arg(nftIds, t.Array(t.UInt64)),
            arg(
              encodedCalls.map(call => call.to),
              t.Array(t.String)
            ),
            arg(
              encodedCalls.map(call => call.data),
              t.Array(t.String)
            ),
            arg(
              encodedCalls.map(call => call.gasLimit),
              t.Array(t.UInt64)
            ),
            arg(
              encodedCalls.map(call => call.value),
              t.Array(t.UInt)
            ),
          ],
          limit: 9999,
        })

        return txId
      },
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )

  const {
    mutate: crossVmBridgeNftToEvm,
    mutateAsync: crossVmBridgeNftToEvmAsync,
    ...rest
  } = mutation

  return {
    crossVmBridgeNftToEvm,
    crossVmBridgeNftToEvmAsync,
    ...rest,
  }
}
