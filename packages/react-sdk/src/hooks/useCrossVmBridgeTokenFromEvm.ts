import {
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowClient} from "./useFlowClient"

export interface UseCrossVmBridgeTokenFromEvmArgs {
  mutation?: Omit<
    UseMutationOptions<string, Error, UseCrossVmBridgeTokenFromEvmMutateArgs>,
    "mutationFn"
  >
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseCrossVmBridgeTokenFromEvmMutateArgs {
  vaultIdentifier: string
  amount: string
}

export interface UseCrossVmBridgeTokenFromEvmResult
  extends Omit<UseMutationResult<string, Error>, "mutate" | "mutateAsync"> {
  crossVmBridgeTokenFromEvm: UseMutateFunction<
    string,
    Error,
    UseCrossVmBridgeTokenFromEvmMutateArgs
  >
  crossVmBridgeTokenFromEvmAsync: UseMutateAsyncFunction<
    string,
    Error,
    UseCrossVmBridgeTokenFromEvmMutateArgs
  >
}

// Takes a chain id and returns the cadence tx with addresses set
export const getCrossVmBridgeTokenFromEvmTransaction = (chainId: string) => {
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

/// This transaction bridges fungible tokens from EVM to Cadence assuming it has already been onboarded to the
/// FlowEVMBridge.
///
/// NOTE: The ERC20 must have first been onboarded to the bridge. This can be checked via the method
///     FlowEVMBridge.evmAddressRequiresOnboarding(address: self.evmContractAddress)
///
/// @param vaultIdentifier: The Cadence type identifier of the FungibleToken Vault to bridge
///     - e.g. vault.getType().identifier
/// @param amount: The amount of tokens to bridge from EVM
///
transaction(vaultIdentifier: String, amount: UInt256) {

    let vaultType: Type
    let receiver: &{FungibleToken.Vault}
    let scopedProvider: @ScopedFTProviders.ScopedFTProvider
    let coa: auth(EVM.Bridge) &EVM.CadenceOwnedAccount

    prepare(signer: auth(BorrowValue, CopyValue, IssueStorageCapabilityController, PublishCapability, SaveValue, UnpublishCapability) &Account) {

        /* --- Reference the signer's CadenceOwnedAccount --- */
        //
        // Borrow a reference to the signer's COA
        self.coa = signer.storage.borrow<auth(EVM.Bridge) &EVM.CadenceOwnedAccount>(from: /storage/evm)
            ?? panic("Could not borrow COA signer's account at path /storage/evm")

        /* --- Construct the Vault type --- */
        //
        // Construct the Vault type from the provided identifier
        self.vaultType = CompositeType(vaultIdentifier)
            ?? panic("Could not construct Vault type from identifier: ".concat(vaultIdentifier))
        // Parse the Vault identifier into its components
        let tokenContractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: self.vaultType)
            ?? panic("Could not get contract address from identifier: ".concat(vaultIdentifier))
        let tokenContractName = FlowEVMBridgeUtils.getContractName(fromType: self.vaultType)
            ?? panic("Could not get contract name from identifier: ".concat(vaultIdentifier))

        /* --- Reference the signer's Vault --- */
        //
        // Borrow a reference to the FungibleToken Vault, configuring if necessary
        let viewResolver = getAccount(tokenContractAddress).contracts.borrow<&{ViewResolver}>(name: tokenContractName)
            ?? panic("Could not borrow ViewResolver from FungibleToken contract with name"
                .concat(tokenContractName).concat(" and address ")
                .concat(tokenContractAddress.toString()))
        let vaultData = viewResolver.resolveContractView(
                resourceType: self.vaultType,
                viewType: Type<FungibleTokenMetadataViews.FTVaultData>()
            ) as! FungibleTokenMetadataViews.FTVaultData?
            ?? panic("Could not resolve FTVaultData view for Vault type ".concat(self.vaultType.identifier))
        // If the vault does not exist, create it and publish according to the contract's defined configuration
        if signer.storage.borrow<&{FungibleToken.Vault}>(from: vaultData.storagePath) == nil {
            signer.storage.save(<-vaultData.createEmptyVault(), to: vaultData.storagePath)

            signer.capabilities.unpublish(vaultData.receiverPath)
            signer.capabilities.unpublish(vaultData.metadataPath)

            let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Vault}>(vaultData.storagePath)
            let metadataCap = signer.capabilities.storage.issue<&{FungibleToken.Vault}>(vaultData.storagePath)

            signer.capabilities.publish(receiverCap, at: vaultData.receiverPath)
            signer.capabilities.publish(metadataCap, at: vaultData.metadataPath)
        }
        self.receiver = signer.storage.borrow<&{FungibleToken.Vault}>(from: vaultData.storagePath)
            ?? panic("Could not borrow FungibleToken Vault from storage path ".concat(vaultData.storagePath.toString()))

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
        let vault: @{FungibleToken.Vault} <- self.coa.withdrawTokens(
            type: self.vaultType,
            amount: amount,
            feeProvider: &self.scopedProvider as auth(FungibleToken.Withdraw) &{FungibleToken.Provider}
        )
        // Ensure the bridged vault is the correct type
        assert(
            vault.getType() == self.vaultType,
            message: "Bridged vault type mismatch - requested: ".concat(self.vaultType.identifier)
                .concat(", received: ").concat(vault.getType().identifier)
        )
        // Deposit the bridged token into the signer's vault
        self.receiver.deposit(from: <-vault)
        // Destroy the ScopedFTProvider
        destroy self.scopedProvider
    }
}
`
}

/**
 * Hook to bridge fungible tokens from Flow EVM to Cadence. This function will
 * withdraw tokens from the signer's COA in EVM and deposit them into their Cadence vault.
 *
 * @returns The mutation object used to send the transaction.
 */
export function useCrossVmBridgeTokenFromEvm({
  mutation: mutationOptions = {},
  flowClient,
}: UseCrossVmBridgeTokenFromEvmArgs = {}): UseCrossVmBridgeTokenFromEvmResult {
  const chainId = useFlowChainId()
  const cadenceTx = chainId.data
    ? getCrossVmBridgeTokenFromEvmTransaction(chainId.data)
    : null

  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})
  const mutation = useMutation(
    {
      mutationFn: async ({
        vaultIdentifier,
        amount,
      }: UseCrossVmBridgeTokenFromEvmMutateArgs) => {
        if (!cadenceTx) {
          throw new Error("No current chain found")
        }

        const txId = await fcl.mutate({
          cadence: cadenceTx,
          args: (arg, t) => [
            arg(vaultIdentifier, t.String),
            arg(amount, t.UInt256),
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
    mutate: crossVmBridgeTokenFromEvm,
    mutateAsync: crossVmBridgeTokenFromEvmAsync,
    ...rest
  } = mutation

  return {
    crossVmBridgeTokenFromEvm,
    crossVmBridgeTokenFromEvmAsync,
    ...rest,
  }
}
