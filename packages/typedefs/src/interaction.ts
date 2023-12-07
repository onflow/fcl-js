export enum InteractionTag {
  UNKNOWN = "UNKNOWN",
  SCRIPT = "SCRIPT",
  TRANSACTION = "TRANSACTION",
  GET_TRANSACTION_STATUS = "GET_TRANSACTION_STATUS",
  GET_ACCOUNT = "GET_ACCOUNT",
  GET_EVENTS = "GET_EVENTS",
  PING = "PING",
  GET_TRANSACTION = "GET_TRANSACTION",
  GET_BLOCK = "GET_BLOCK",
  GET_BLOCK_HEADER = "GET_BLOCK_HEADER",
  GET_COLLECTION = "GET_COLLECTION",
  GET_NETWORK_PARAMETERS = "GET_NETWORK_PARAMETERS",
  SUBSCRIBE_EVENTS = "SUBSCRIBE_EVENTS",
}

export enum InteractionStatus {
  BAD = "BAD",
  OK = "OK",
}

export enum TransactionRole {
  AUTHORIZER = "authorizer",
  PAYER = "payer",
  PROPOSER = "proposer",
}

export enum InteractionResolverKind {
  ARGUMENT = "ARGUMENT",
  ACCOUNT = "ACCOUNT",
}

export interface InteractionAccount {
  kind: InteractionResolverKind.ACCOUNT
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
    cadence: string | null
    refBlock: string | null
    computeLimit: string | null
    proposer: string | null
    payer: string | null
    authorizations: string[]
    params: Record<string, any>[]
    arguments: string[]
  }
  proposer: string | null
  authorizations: string[]
  payer: string[]
  events: {
    eventType: string | null
    start: string | null
    end: string | null
    blockIds: string[]
  }
  transaction: {
    id: string | null
  }
  block: {
    id: string | null
    height: string | null
    isSealed: boolean | null
  }
  account: {
    addr: string | null
  }
  collection: {
    id: string | null
  },
  subscribeEvents: {
    eventTypes: string[] | null
    addresses: string[] | null
    contracts: string[] | null
    startBlockId: string | null
    startHeight: number | null
    heartbeatInterval: number | null
  }
}
