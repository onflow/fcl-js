export interface Message {
  cadence?: string
  refBlock?: string
  computeLimit: number
  proposer: string
  payer: string
  authorizations: Array<string>
  params: Array<string>
}

export interface Events {
  eventType?: string
  start?: number
  end?: number
}

export interface LatestBlock {
  isSealed?: boolean
}

export interface Interaction {
  tag: string
  assigns: object
  status: string
  reason?: string
  accounts: object
  params: object
  message: Message
  proposer?: string
  authorizations: Array<string>
  events: Events
  latestBlock: LatestBlock
  accountAddr?: string
  transactionId?: string
}

export function interaction(): Interaction
