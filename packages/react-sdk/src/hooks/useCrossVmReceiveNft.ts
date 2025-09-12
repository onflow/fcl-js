import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowClient} from "./useFlowClient"

export interface UseCrossVmReceiveNftTxArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, UseCrossVmReceiveNftTxMutateArgs>,
    "mutationFn"
  >
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseCrossVmReceiveNftTxMutateArgs {
  nftIdentifier: string
  nftId: string
}

export interface UseCrossVmReceiveNftTxResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  receiveNft: UseMutateFunction<string, Error, UseCrossVmReceiveNftTxMutateArgs>
  receiveNftAsync: UseMutateAsyncFunction<
    string,
    Error,
    UseCrossVmReceiveNftTxMutateArgs
  >
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCrossVmReceiveNftTransaction = (chainId: string) => {
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

/// Bridges an NFT from the signer's COA in FlowEVM to their collection in Cadence
///
/// @param nftIdentifier: The Cadence type identifier of the NFT to bridge - e.g. nft.getType().identifier
/// @param id: The EVM NFT ID to bridge to Cadence
///
transaction(nftIdentifier: String, id: UInt256) {
    let nftType: Type
    let collection: &{NonFungibleToken.Collection}
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount
    
    prepare(signer: auth(BorrowValue, CopyValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {
        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
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

        /* --- Configure the NFT Collection --- */
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
        
        // Configure collection if it doesn't exist
        if signer.storage.borrow<&{NonFungibleToken.Collection}>(from: collectionData.storagePath) == nil {
            signer.storage.save(<-collectionData.createEmptyCollection(), to: collectionData.storagePath)

            signer.capabilities.unpublish(collectionData.publicPath)

            let collectionCap = signer.capabilities.storage.issue<&{NonFungibleToken.Collection}>(collectionData.storagePath)
            signer.capabilities.publish(collectionCap, at: collectionData.publicPath)
        }
        
        self.collection = signer.storage.borrow<&{NonFungibleToken.Collection}>(from: collectionData.storagePath)
            ?? panic("Could not borrow a NonFungibleToken Collection from the signer's storage path "
                .concat(collectionData.storagePath.toString()))

        /* --- Configure a ScopedFTProvider --- */
        //
        // Set a cap on the withdrawable bridge fee
        var approxFee = FlowEVMBridgeUtils.calculateBridgeFee(
                bytes: 400_000 // 400 kB as upper bound on movable storage used in a single transaction
            )

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
        // Execute the bridge request
        let nft: @{NonFungibleToken.NFT} <- self.coa.withdrawNFT(
            type: self.nftType,
            id: id,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Ensure the bridged NFT is the correct type
        assert(
            nft.getType() == self.nftType,
            message: "Bridged NFT type mismatch - requested: ".concat(self.nftType.identifier)
                .concat(", received: ").concat(nft.getType().identifier)
        )
        // Deposit the bridged NFT into the signer's collection
        self.collection.deposit(token: <-nft)
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
`
}

/**
 * Hook to receive a cross-VM NFT transaction from EVM to Cadence. This function will
 * withdraw an NFT from the signer's COA in EVM and deposit it into their Cadence collection.
 *
 * @returns The mutation object used to send the transaction.
 */
export function useCrossVmReceiveNft({
  mutation: mutationOptions = {},
  flowClient,
}: UseCrossVmReceiveNftTxArgs = {}): UseCrossVmReceiveNftTxResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCrossVmReceiveNftTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const mutation = useMutation(
    {
      mutationFn: async ({
        nftIdentifier,
        nftId,
      }: UseCrossVmReceiveNftTxMutateArgs) => {
        if (!cadenceTx) {
          throw new Error("No current chain found")
        }

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg, t) => [
            arg(nftIdentifier, t.String),
            arg(nftId, t.UInt256),
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

  const {mutate: receiveNft, mutateAsync: receiveNftAsync, ...rest} = mutation

  return {
    receiveNft,
    receiveNftAsync,
    ...rest,
  }
}
