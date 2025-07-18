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
import {useClient} from "./useClient"

export interface UseCrossVmSpendTokenArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, UseCrossVmSpendTokenMutateArgs>,
    "mutationFn"
  >
  client?: ReturnType<typeof useClient>
}

export interface UseCrossVmSpendTokenMutateArgs {
  vaultIdentifier: string
  amount: string
  calls: EvmBatchCall[]
}

export interface UseCrossVmSpendTokenResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  spendToken: UseMutateFunction<string, Error, UseCrossVmSpendTokenMutateArgs>
  spendTokenAsync: UseMutateAsyncFunction<
    string,
    Error,
    UseCrossVmSpendTokenMutateArgs
  >
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCrossVmSpendTokenTransaction = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FungibleToken from ${contractAddresses.FungibleToken}
import ViewResolver from ${contractAddresses.ViewResolver}
import FungibleTokenMetadataViews from ${contractAddresses.FungibleTokenMetadataViews}
import FlowToken from ${contractAddresses.FlowToken}

import ScopedFTProviders from ${contractAddresses.ScopedFTProviders}

import EVM from ${contractAddresses.EVM}

import FlowEVMBridge from ${contractAddresses.FlowEVMBridge}
import FlowEVMBridgeConfig from ${contractAddresses.FlowEVMBridgeConfig}
import FlowEVMBridgeUtils from ${contractAddresses.FlowEVMBridgeUtils}

/// Bridges a Vault from the signer's storage to the signer's COA in EVM.Account
/// and then executes an arbitrary number of EVM transactions.
///
/// NOTE: This transaction also onboards the Vault to the bridge if necessary which may incur additional fees
///     than bridging an asset that has already been onboarded.
///
/// @param vaultIdentifier: The Cadence type identifier of the FungibleToken Vault to bridge
///     - e.g. vault.getType().identifier
/// @param amount: The amount of tokens to bridge from EVM
/// @params evmContractAddressHexes, calldatas, gasLimits, values: Arrays of calldata
///         to be included in transaction calls to Flow EVM from the signer's COA.
///         The arrays are all expected to be of the same length
///
///
transaction(
    vaultIdentifier: String,
    amount: UFix64,
    evmContractAddressHexes: [String],
    calldatas: [String],
    gasLimits: [UInt64],
    values: [UInt]
) {

    let sentVault: @{FungibleToken.Vault}
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

        /* --- Construct the Vault type --- */
        //
        // Construct the Vault type from the provided identifier
        let vaultType = CompositeType(vaultIdentifier)
            ?? panic("Could not construct Vault type from identifier: ".concat(vaultIdentifier))
        // Parse the Vault identifier into its components
        let tokenContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: vaultType)
            ?? panic("Could not get contract address from identifier: ".concat(vaultIdentifier))
        let tokenContractName = FlowEVMBridgeUtils.getContractName(fromType: vaultType)
            ?? panic("Could not get contract name from identifier: ".concat(vaultIdentifier))

        /* --- Retrieve the funds --- */
        //
        // Borrow a reference to the FungibleToken Vault
        let viewResolver = getAccount(tokenContractAddress).contracts.borrow<&{ViewResolver}>(name: tokenContractName)
            ?? panic("Could not borrow ViewResolver from FungibleToken contract with name"
                .concat(tokenContractName).concat(" and address ")
                .concat(tokenContractAddress.toString()))
        let vaultData = viewResolver.resolveContractView(
                resourceType: vaultType,
                viewType: Type<FungibleTokenMetadataViews.FTVaultData>()
            ) as! FungibleTokenMetadataViews.FTVaultData?
            ?? panic("Could not resolve FTVaultData view for Vault type ".concat(vaultType.identifier))
        let vault = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(
                from: vaultData.storagePath
            ) ?? panic("Could not borrow FungibleToken Vault from storage path ".concat(vaultData.storagePath.toString()))

        // Withdraw the requested balance & set a cap on the withdrawable bridge fee
        self.sentVault <- vault.withdraw(amount: amount)
        var approxFee = FlowEVMBridgeUtils.calculateBridgeFee(
                bytes: 400_000 // 400 kB as upper bound on movable storage used in a single transaction
            )
        // Determine if the Vault requires onboarding - this impacts the fee required
        self.requiresOnboarding = FlowEVMBridge.typeRequiresOnboarding(self.sentVault.getType())
            ?? panic("Bridge does not support the requested asset type ".concat(vaultIdentifier))
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

    pre {
        self.sentVault.getType().identifier == vaultIdentifier:
            "Attempting to send invalid vault type - requested: ".concat(vaultIdentifier)
            .concat(", sending: ").concat(self.sentVault.getType().identifier)
    }

    execute {
        if self.requiresOnboarding {
            // Onboard the Vault to the bridge
            FlowEVMBridge.onboardByType(
                self.sentVault.getType(),
                feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
            )
        }
        // Execute the bridge
        self.coa.depositTokens(
            vault: <-self.sentVault,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
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
 * Hook to send a cross-VM FT spend transaction. This function will
 * bundle multiple EVM calls into one atomic Cadence transaction and return the transaction ID.
 *
 * @returns The mutation object used to send the transaction.
 */
export function useCrossVmSpendToken({
  mutation: mutationOptions = {},
  client,
}: UseCrossVmSpendTokenArgs = {}): UseCrossVmSpendTokenResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCrossVmSpendTokenTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
  const fcl = useClient({client})
  const mutation = useMutation(
    {
      mutationFn: async ({
        vaultIdentifier,
        amount,
        calls,
      }: UseCrossVmSpendTokenMutateArgs) => {
        if (!cadenceTx) {
          throw new Error("No current chain found")
        }
        const encodedCalls = encodeCalls(calls)

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg, t) => [
            arg(vaultIdentifier, t.String),
            arg(amount, t.UFix64),
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

  const {mutate: spendToken, mutateAsync: spendTokenAsync, ...rest} = mutation

  return {
    spendToken,
    spendTokenAsync,
    ...rest,
  }
}
