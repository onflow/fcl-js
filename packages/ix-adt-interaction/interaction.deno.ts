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

const INTERACTION = `{
  "tag":"UNKNOWN",
  "assigns":{},
  "status":"OK",
  "reason":null,
  "accounts":{},
  "params":{},
  "message": {
    "cadence":null,
    "refBlock":null,
    "computLimit":null,
    "proposer":null,
    "payer":null,
    "authorizations":[],
    "params":[]
  },
  "proposer":null,
  "authorizations":[],
  "payer":null,
  "events": {
    "eventType":null,
    "start":null,
    "end":null
  },
  "latestBlock": {
    "isSealed":null
  },
  "accountAddr":null,
  "transactionId":null
}`

export function interaction(): Interaction {
  return JSON.parse(INTERACTION)
}
