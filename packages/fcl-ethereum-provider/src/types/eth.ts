export type EthSignatureResponse = string

export type PersonalSignParams = [string, string]

export interface SignTypedDataParams {
  address: string
  data: TypedData // This represents the EIP-712 structured data
}

export interface TypedData {
  types: Record<string, Array<{ name: string; type: string }>>
  domain: {
    name?: string
    version?: string
    chainId?: number
    verifyingContract?: string
  }
  primaryType: string
  message: Record<string, any>
}
