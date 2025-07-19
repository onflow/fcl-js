import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQuery} from "./useFlowQuery"
import {CADENCE_UFIX64_PRECISION, CONTRACT_ADDRESSES} from "../constants"
import {useFlowChainId} from "./useFlowChainId"
import {parseUnits, formatUnits} from "viem/utils"
import {useFlowClient} from "./useFlowClient"

interface UseCrossVmTokenBalanceArgs {
  owner?: string
  erc20Address?: string
  vaultIdentifier?: string
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: ReturnType<typeof useFlowClient>
}

interface TokenBalance {
  value: bigint
  formatted: string
  precision: number
}

export interface UseCrossVmTokenBalanceData {
  cadence: TokenBalance
  evm: TokenBalance
  combined: TokenBalance
}

const getCrossVmTokenBalance = (network: "testnet" | "mainnet") => `
import EVM from ${CONTRACT_ADDRESSES[network].EVM}
import FlowToken from ${CONTRACT_ADDRESSES[network].FlowToken}
import FungibleToken from ${CONTRACT_ADDRESSES[network].FungibleToken}
import FlowEVMBridgeUtils from ${CONTRACT_ADDRESSES[network].FlowEVMBridgeUtils}
import FlowEVMBridgeConfig from ${CONTRACT_ADDRESSES[network].FlowEVMBridgeConfig}
import FungibleTokenMetadataViews from ${CONTRACT_ADDRESSES[network].FungibleTokenMetadataViews}

/// Returns the balance of the owner of a given Fungible Token
/// from their Cadence account and their COA
/// Accepts multiple optional arguments, so the caller can query
/// the token by its EVM ERC20 address or by its Cadence contract address and name
///
/// @param owner: The Flow address of the owner
/// @param contractAddressArg: The optional address of the FT contract in Cadence
/// @param contractNameArg: The optional name of the FT contract in Cadence
/// @param erc20AddressHex: The optional ERC20 address of the FT to query
///
/// @return An array that contains the balance information for the user's accounts
///         in this order:
///         decimals (UInt256), cadence Balance (UFix64), EVM Balance (UInt256), Total Balance (UInt256)
///

access(all) fun main(
        owner: Address,
        vaultIdentifier: String?,
        erc20AddressHexArg: String?
): [AnyStruct] {
    pre {
        vaultIdentifier == nil ? erc20AddressHexArg != nil : true:
            "If the Cadence contract information is not provided, the ERC20 contract address must be provided."
    }

    var typeIdentifier: String = ""
    var compType: Type? = nil
    var contractAddress: Address? = nil
    var contractName: String? = nil
    var tokenEVMAddress: String? = nil
    var cadenceBalance: UFix64 = 0.0
    var coaBalance: UInt256 = 0
    var decimals: UInt8 = 0
    
    // If the caller provided the Cadence information,
    // Construct the composite type
    if vaultIdentifier != nil {
        typeIdentifier = vaultIdentifier!
        compType = CompositeType(typeIdentifier)
            ?? panic("Could not construct Cadence type with \(typeIdentifier)")
        
        // Get the EVM address of the bridged version of the Cadence FT contract
        if let evmAddress = FlowEVMBridgeConfig.getEVMAddressAssociated(with: compType!) {
            tokenEVMAddress = evmAddress.toString()
        }
    } else {
        // If the caller provided the EVM information,
        // get the Cadence type from the bridge
        // If getting the Cadence type doesn't work, then we'll just return the EVM balance
        tokenEVMAddress = erc20AddressHexArg!
        let address = EVM.addressFromString(tokenEVMAddress!)
        compType = FlowEVMBridgeConfig.getTypeAssociated(with: address)
    }

    // Parse the FT identifier into its components if necessary
    if compType != nil {
        contractAddress = FlowEVMBridgeUtils.getContractAddress(fromType: compType!)
        contractName = FlowEVMBridgeUtils.getContractName(fromType: compType!)
    }

    if let address = contractAddress {
        // Borrow a reference to the FT contract
        let resolverRef = getAccount(address)
            .contracts.borrow<&{FungibleToken}>(name: contractName!)
                ?? panic("Could not borrow FungibleToken reference to the contract. Make sure the provided contract name ("
                            .concat(contractName!).concat(") and address (").concat(address.toString()).concat(") are correct!"))

        // Use that reference to retrieve the FTView 
        let vaultData = resolverRef.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
            ?? panic("Could not resolve FTVaultData view. The ".concat(contractName!)
                .concat(" contract needs to implement the FTVaultData Metadata view in order to execute this transaction."))

        // Get the Cadence balance of the token
        cadenceBalance = getAccount(owner).capabilities.borrow<&{FungibleToken.Balance}>(
                vaultData.metadataPath
            )?.balance
            ?? 0.0
    }

    // Get the COA from the owner's account
    if let coa = getAuthAccount<auth(BorrowValue) &Account>(owner)
        .storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) 
    {
        if let erc20Address = tokenEVMAddress {
            // Get the COA address
            let coaAddress = coa.address().toString()

            // Get the ERC20 balance of the COA
            coaBalance = FlowEVMBridgeUtils.balanceOf(
                owner: EVM.addressFromString(coaAddress),
                evmContractAddress: EVM.addressFromString(erc20Address)
            )
            
            // Get the token decimals of the ERC20 contract
            decimals = FlowEVMBridgeUtils.getTokenDecimals(
                evmContractAddress: EVM.addressFromString(erc20Address)
            )
        }
        
        if compType == Type<@FlowToken.Vault>() {
            coaBalance = coaBalance! + UInt256(coa.address().balance().inAttoFLOW())
        }
    }

    let balances = [decimals, cadenceBalance, coaBalance]
    
    return balances
}
`

/**
 * Returns the balance of the owner of a given Fungible Token across both Cadence and EVM accounts.
 * @param param0
 * @returns
 */
export function useCrossVmTokenBalance(params: UseCrossVmTokenBalanceArgs) {
  const chainIdResult = useFlowChainId()
  const queryResult = useFlowQuery({
    cadence: chainIdResult.data
      ? getCrossVmTokenBalance(chainIdResult.data as "testnet" | "mainnet")
      : "",
    args: (arg, t) => [
      params.owner
        ? arg(params.owner, t.Address)
        : arg(null, t.Optional(t.Address)),
      arg(
        "vaultIdentifier" in params && params.vaultIdentifier
          ? params.vaultIdentifier
          : null,
        t.Optional(t.String)
      ),
      arg(
        "erc20Address" in params && params.erc20Address
          ? params.erc20Address
          : null,
        t.Optional(t.String)
      ),
    ],
    flowClient: params.flowClient,
    query: {
      ...params.query,
      enabled:
        (params.query?.enabled ?? true) &&
        !!chainIdResult.data &&
        !!params.owner &&
        (!!params.vaultIdentifier || !!params.erc20Address),
    },
  })

  if (chainIdResult.isError) {
    return chainIdResult
  }

  const data = queryResult.data as [string, string, string, string] | undefined
  if (!data) {
    return {
      ...queryResult,
      data: null,
    } as UseQueryResult<UseCrossVmTokenBalanceData | null, Error>
  }

  const [evmDecimals, cadenceBalance, evmBalance] = data

  // Convert the values to the max precision between Cadence and EVM
  // to avoid precision loss when summing the two balances
  const totalPrecision = Math.max(CADENCE_UFIX64_PRECISION, Number(evmDecimals))
  const totalPrecisionCadenceBalance = parseUnits(
    cadenceBalance,
    totalPrecision
  )
  const totalPrecisionEvmBalance = parseUnits(
    formatUnits(BigInt(evmBalance), Number(evmDecimals)),
    totalPrecision
  )

  return {
    ...queryResult,
    data: data
      ? {
          cadence: {
            formatted: formatUnits(
              parseUnits(cadenceBalance, CADENCE_UFIX64_PRECISION),
              CADENCE_UFIX64_PRECISION
            ),
            value: parseUnits(cadenceBalance, CADENCE_UFIX64_PRECISION),
            precision: CADENCE_UFIX64_PRECISION,
          },
          evm: {
            formatted: formatUnits(BigInt(evmBalance), Number(evmDecimals)),
            precision: Number(evmDecimals),
            value: BigInt(evmBalance),
          },
          total: {
            formatted: formatUnits(
              totalPrecisionCadenceBalance + totalPrecisionEvmBalance,
              totalPrecision
            ),
            value: totalPrecisionCadenceBalance + totalPrecisionEvmBalance,
            precision: totalPrecision,
          },
        }
      : null,
  } as UseQueryResult<UseCrossVmTokenBalanceData | null, Error>
}
