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
  role: Roles
}

const ACCOUNT = `{
  "kind":"ACCOUNT",
  "tempId":null,
  "addr":null,
  "keyId":null,
  "sequenceNum":null,
  "signature":null,
  "signingFunction":null,
  "resolve":null,
  "roles": {
    "proposer":false,
    "authorizer":false,
    "payer":false,
    "param":false
  }
}`

export function account(): Account {
  return JSON.parse(ACCOUNT)
}
