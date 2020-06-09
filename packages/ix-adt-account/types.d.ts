export interface Roles {
  proposer: boolean
  authorizer: boolean
  payer: boolean
  param?: boolean
}

export interface Account {
  kind: string
  tempId?: string
  addr?: string
  keyId?: number
  sequenceNum?: number
  signature?: string
  signingFunction?: (data: object) => object
  roles: Roles
}

export function account(): Account
