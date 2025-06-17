export const InteractionTag = {
  UNKNOWN: "UNKNOWN",
  SCRIPT: "SCRIPT",
  TRANSACTION: "TRANSACTION",
  GET_TRANSACTION_STATUS: "GET_TRANSACTION_STATUS",
  GET_ACCOUNT: "GET_ACCOUNT",
  GET_EVENTS: "GET_EVENTS",
  PING: "PING",
  GET_TRANSACTION: "GET_TRANSACTION",
  GET_BLOCK: "GET_BLOCK",
  GET_BLOCK_HEADER: "GET_BLOCK_HEADER",
  GET_COLLECTION: "GET_COLLECTION",
  GET_NETWORK_PARAMETERS: "GET_NETWORK_PARAMETERS",
  SUBSCRIBE_EVENTS: "SUBSCRIBE_EVENTS",
  GET_NODE_VERSION_INFO: "GET_NODE_VERSION_INFO",
} as const

export type InteractionTag =
  (typeof InteractionTag)[keyof typeof InteractionTag]

export const InteractionStatus = {
  BAD: "BAD",
  OK: "OK",
} as const

export type InteractionStatus =
  (typeof InteractionStatus)[keyof typeof InteractionStatus]

export const TransactionRole = {
  AUTHORIZER: "authorizer",
  PAYER: "payer",
  PROPOSER: "proposer",
} as const

export type TransactionRole =
  (typeof TransactionRole)[keyof typeof TransactionRole]

export const InteractionResolverKind = {
  ARGUMENT: "ARGUMENT",
  ACCOUNT: "ACCOUNT",
} as const

export type InteractionResolverKind =
  (typeof InteractionResolverKind)[keyof typeof InteractionResolverKind]

export interface InteractionAccount {
  kind: typeof InteractionResolverKind.ACCOUNT
  tempId: string
  addr: string | null
  keyId: number | string | null
  sequenceNum: number | null
  signature: string | null
  signingFunction: any | null
  resolve: any | null
  role: {
    proposer: boolean
    authorizer: boolean
    payer: boolean
    param?: boolean
  }
  authorization: any
}

export interface Interaction {
  tag: InteractionTag
  assigns: Record<string, any>
  status: InteractionStatus
  reason: string | null
  accounts: Record<string, InteractionAccount>
  params: Record<string, any>
  arguments: Record<string, any>
  message: {
    cadence: string
    refBlock: string
    computeLimit: number
    proposer: string
    payer: string
    authorizations: string[]
    params: Record<string, any>[]
    arguments: string[]
  }
  proposer: string | null
  authorizations: string[]
  payer: string[]
  events: {
    eventType: string | null
    start: string | number | null
    end: string | number | null
    blockIds: string[]
  }
  transaction: {
    id: string | null
  }
  block: {
    id: string | null
    height: string | number | null
    isSealed: boolean | null
  }
  account: {
    addr: string | null
  }
  collection: {
    id: string | null
  }
  subscribeEvents: {
    eventTypes: string[] | null
    addresses: string[] | null
    contracts: string[] | null
    startBlockId: string | null
    startHeight: number | null
    heartbeatInterval: number | null
  }
}
