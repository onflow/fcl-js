export type Account = {
  /**
   * - The address of the account
   */
  address: string
  /**
   * - The FLOW balance of the account in 10^8
   */
  balance: number
  /**
   * - The code of any Cadence contracts stored in the account
   */
  code: number
  /**
   * - An object with keys as the contract name deployed and the value as the the cadence string
   */
  contracts: object
  /**
   * - Any contracts deployed to this account
   */
  keys: object
}
export type Block = {
  /**
   * - The id of the block
   */
  id: string
  /**
   * - The id of the parent block
   */
  parentId: string
  /**
   * - The height of the block
   */
  height: number
  /**
   * - Time related fields
   */
  timestamp: object
  /**
   * - Contains the ids of collections included in the block
   */
  collectionGuarantees: CollectionGuarantee
  /**
   * - The details of which nodes executed and sealed the blocks
   */
  blockSeals: object
  /**
   * - The cryptographic signature of the block
   */
  signatures: Array<number>
}
export type CollectionGuarantee = {
  /**
   * - The id of the block
   */
  collectionId: string
  /**
   * - All signatures
   */
  signatures: Array<object>
}
export type CompositeSignature = {
  /**
   * - A type identifier used internally by FCL
   */
  f_type: string
  /**
   * - FCL protocol version
   */
  f_vsn: string
  /**
   * - Flow Address (sans prefix)
   */
  addr: string
  /**
   * - Key ID
   */
  keyId: number
  /**
   * - Signature as a hex string
   */
  signature: string
}
export type CurrentUser = {
  /**
   * - The public address of the current user
   */
  addr?: string
  /**
   * - A wallet specified content identifier for user metadata
   */
  cid?: string
  /**
   * - A wallet specified time-frame for a valid session
   */
  expiresAt?: number
  /**
   * - A type identifier used internally by FCL
   */
  f_type: string
  /**
   * - FCL protocol version
   */
  f_vsn: string
  /**
   * - Whether or not the current user is logged in
   */
  loggedIn?: boolean
  /**
   * - A list of trusted services that express ways of interacting with the current user's identity
   */
  services: Array<object>
}
export type Event = {
  /**
   * - ID of the block that contains the event.
   */
  blockId: string
  /**
   * - Height of the block that contains the event.
   */
  blockHeight: number
  /**
   * - The timestamp of when the block was sealed in a DateString format. eg. '2021-06-25T13:42:04.227Z'
   */
  blockTimestamp: string
  /**
   * - A string containing the event name.
   */
  type: string
  /**
   * - Can be used to query transaction information, eg. via a Flow block explorer.
   */
  transactionId: string
  /**
   * - Used to prevent replay attacks.
   */
  transactionIndex: number
  /**
   * - Used to prevent replay attacks.
   */
  eventIndex: number
  /**
   * - The data emitted from the event.
   */
  data: any
}
export type Key = {
  /**
   * - Sequence number of key used by the proposer of this transaction
   */
  sequenceNumber: number
  /**
   * - The ID of the key in the account used by the proposer of this transaction
   */
  keyId: number
  /**
   * - The address of the proposer of this transaction
   */
  address: string
}
export type Service = {
  /**
   * - A type identifier used internally by FCL
   */
  f_type: string
  /**
   * - FCL protocol version
   */
  f_vsn: string
  /**
   * - Service type
   */
  type: string
  /**
   * - Service method
   */
  method: string
  /**
   * - Service uid
   */
  uid?: string
  /**
   * - Service endpoint
   */
  endpoint: string
  /**
   * - Service provider object
   */
  provider: Provider

  params: Record<string, string>
}
export type Signature = {
  /**
   * - Sequence number of the key used to perform this signature.
   */
  sequenceNumber: string
  /**
   * - ID of the key in the account used to perform this signature.
   */
  keyId: number
  /**
   * - The signature represented as a hex string.
   */
  signature: string
}
export type Transaction = {
  /**
   * - The Cadence code used to execute this transaction.
   */
  script: string
  /**
   * - The JSON-CDC encoded arguments passed in to the transaction.
   */
  args: Array<string>
  /**
   * - The reference block id for this transaction.
   */
  referenceBlockId: string
  /**
   * - The gas limit for the transaction.
   */
  gasLimit: number
  /**
   * - The key used by the proposer of this transaction.
   */
  proposalKey: Key
  /**
   * - Sequence number of the key used by the proposer of this transaction.
   */
  sequenceNumber: string
  /**
   * - The ID of the key in the account used by the proposer of this transaction.
   */
  keyId: number
  /**
   * - The address of the proposer of this transaction.
   */
  address: string
  /**
   * - Address of the payer of the transaction.
   */
  payer: string
  /**
   * - Address of the proposer of this transaction.
   */
  proposer: string
  /**
   * - Array of addresses of authorizers of this transaction.
   */
  authorizers: Array<string>
  /**
   * - The payload signatures for the transaction.
   */
  payloadSignatures: Array<Signature>
  /**
   * - The envelope signatures for the transaction.
   */
  envelopeSignatures: Array<Signature>
}
export type TransactionStatus = {
  /**
   * - The ID of the Block the transaction is included in.
   */
  blockId: string
  /**
   * - The status code of the transaction.
   */
  status: number
  /**
   * - The status as as descriptive text (e.g. "FINALIZED").
   */
  statusString: string
  /**
   * - The error message of the transaction.
   */
  errorMessage: string
  /**
   * - The events for this result.
   */
  events: Array<Event>
}
export type Provider = {
  /**
   * - Provider name.
   */
  name: string
}
export interface StreamConnection<ChannelMap extends {[name: string]: any}> {
  on<C extends keyof ChannelMap>(
    channel: C,
    listener: (data: ChannelMap[C]) => void
  ): this
  on(event: "close", listener: () => void): this
  on(event: "error", listener: (err: any) => void): this
  off<C extends keyof ChannelMap>(
    event: C,
    listener: (data: ChannelMap[C]) => void
  ): this
  off(event: "close", listener: () => void): this
  off(event: "error", listener: (err: any) => void): this
  close(): void
}

export interface EventFilter {
  eventTypes?: string[]
  addresses?: string[]
  contracts?: string[]
}

export interface BlockHeartbeat {
  blockId: string
  blockHeight: number
  timestamp: string
}

export type EventStream = StreamConnection<{
  events: Event[]
  heartbeat: BlockHeartbeat
}>

export * from "./interaction"
