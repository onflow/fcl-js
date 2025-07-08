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
/**
 * Represents different types of interactions with the Flow blockchain
 */
export type InteractionTag =
  (typeof InteractionTag)[keyof typeof InteractionTag]

export const InteractionStatus = {
  BAD: "BAD",
  OK: "OK",
} as const
/**
 * Status of an interaction with the Flow blockchain
 */
export type InteractionStatus =
  (typeof InteractionStatus)[keyof typeof InteractionStatus]

export const TransactionRole = {
  AUTHORIZER: "authorizer",
  PAYER: "payer",
  PROPOSER: "proposer",
} as const
/**
 * Represents different roles in a transaction
 */
export type TransactionRole =
  (typeof TransactionRole)[keyof typeof TransactionRole]

export const InteractionResolverKind = {
  ARGUMENT: "ARGUMENT",
  ACCOUNT: "ACCOUNT",
} as const
/**
 * Represents different kinds of interaction resolvers
 */
export type InteractionResolverKind =
  (typeof InteractionResolverKind)[keyof typeof InteractionResolverKind]

/**
 * Represents an account involved in an interaction
 */
export interface InteractionAccount {
  kind: typeof InteractionResolverKind.ACCOUNT
  tempId: string
  /**
   * The address of the account
   */
  addr: string | null
  /**
   * The key ID used for signing
   */
  keyId: number | string | null
  /**
   * The sequence number for the account key
   */
  sequenceNum: number | null
  /**
   * The signature for the account
   */
  signature: string | null
  /**
   * Function used for signing
   */
  signingFunction: any | null
  /**
   * Resolver function for the account
   */
  resolve: any | null
  /**
   * Role of the account in the transaction
   */
  role: {
    /**
     * Whether this account is a proposer
     */
    proposer: boolean
    /**
     * Whether this account is an authorizer
     */
    authorizer: boolean
    /**
     * Whether this account is a payer
     */
    payer: boolean
    /**
     * Whether this account is a parameter
     */
    param?: boolean
  }
  /**
   * Authorization details for the account
   */
  authorization: any
}

/**
 * Represents an interaction with the Flow blockchain
 */
export interface Interaction {
  /**
   * The type of interaction
   */
  tag: InteractionTag
  /**
   * Assigned values for the interaction
   */
  assigns: Record<string, any>
  /**
   * The status of the interaction
   */
  status: InteractionStatus
  /**
   * Reason for the current status
   */
  reason: string | null
  /**
   * Accounts involved in the interaction
   */
  accounts: Record<string, InteractionAccount>
  /**
   * Parameters for the interaction
   */
  params: Record<string, any>
  /**
   * Arguments for the interaction
   */
  arguments: Record<string, any>
  /**
   * Message details for the interaction
   */
  message: {
    /**
     * The Cadence code to execute
     */
    cadence: string
    /**
     * Reference block for the transaction
     */
    refBlock: string
    /**
     * Compute limit for the transaction
     */
    computeLimit: number
    /**
     * The proposer of the transaction
     */
    proposer: string
    /**
     * The payer of the transaction
     */
    payer: string
    /**
     * The authorizations for the transaction
     */
    authorizations: string[]
    /**
     * Parameters for the message
     */
    params: Record<string, any>[]
    /**
     * Arguments for the message
     */
    arguments: string[]
  }
  /**
   * The proposer of the transaction
   */
  proposer: string | null
  /**
   * The authorizations for the transaction
   */
  authorizations: string[]
  /**
   * The payer(s) of the transaction
   */
  payer: string[]
  /**
   * Event-related information
   */
  events: {
    /**
     * The type of event to listen for
     */
    eventType: string | null
    /**
     * Start block for event listening
     */
    start: string | number | null
    /**
     * End block for event listening
     */
    end: string | number | null
    /**
     * Specific block IDs to listen for events
     */
    blockIds: string[]
  }
  /**
   * Transaction-related information
   */
  transaction: {
    /**
     * The ID of the transaction
     */
    id: string | null
  }
  /**
   * Block-related information
   */
  block: {
    /**
     * The ID of the block
     */
    id: string | null
    /**
     * The height of the block
     */
    height: string | number | null
    /**
     * Whether the block is sealed
     */
    isSealed: boolean | null
  }
  /**
   * Account-related information
   */
  account: {
    /**
     * The address of the account
     */
    addr: string | null
  }
  /**
   * Collection-related information
   */
  collection: {
    /**
     * The ID of the collection
     */
    id: string | null
  }
  /**
   * Event subscription information
   */
  subscribeEvents: {
    /**
     * The event types to subscribe to
     */
    eventTypes: string[] | null
    /**
     * The addresses to listen for events
     */
    addresses: string[] | null
    /**
     * The contracts to listen for events
     */
    contracts: string[] | null
    /**
     * The starting block ID for event subscription
     */
    startBlockId: string | null
    /**
     * The starting block height for event subscription
     */
    startHeight: number | null
    /**
     * The heartbeat interval for event subscription
     */
    heartbeatInterval: number | null
  }
}
