export type EthSignatureResponse = string

export type PersonalSignParams = [string, string]

export interface SignTypedDataParams {
  address: string
  data: TypedData // This represents the EIP-712 structured data
}

export interface TypedDataField {
  name: string
  type: string
}

export interface TypedDataDomain {
  name?: string
  version?: string
  chainId?: number
  verifyingContract?: string
  salt?: string
}

export interface TypedData {
  types: Record<string, TypedDataField[]>
  domain: TypedDataDomain
  primaryType: string
  message: Record<string, any>
}
