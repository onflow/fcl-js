
export const UNKNOWN /*                       */ = "UNKNOWN"
export const SCRIPT /*                        */ = "SCRIPT"
export const TRANSACTION /*                   */ = "TRANSACTION"
export const GET_TRANSACTION_STATUS /*        */ = "GET_TRANSACTION_STATUS"
export const GET_ACCOUNT /*                   */ = "GET_ACCOUNT"
export const GET_EVENTS /*                    */ = "GET_EVENTS"
export const PING /*                          */ = "PING"
export const GET_TRANSACTION /*               */ = "GET_TRANSACTION"
export const GET_BLOCK /*                     */ = "GET_BLOCK"
export const GET_BLOCK_HEADER /*              */ = "GET_BLOCK_HEADER"
export const GET_COLLECTION /*                */ = "GET_COLLECTION"
export const GET_NETWORK_PARAMETERS /*        */ = "GET_NETWORK_PARAMETERS"

export const BAD /* */ = "BAD"
export const OK /*  */ = "OK"

export const ACCOUNT /*  */ = "ACCOUNT"
export const PARAM /*    */ = "PARAM"
export const ARGUMENT /* */ = "ARGUMENT"

export const AUTHORIZER /* */ = "authorizer"
export const PAYER /*      */ = "payer"
export const PROPOSER /*   */ = "proposer"

export interface InteractionAccount {
  kind: typeof ACCOUNT,
  tempId: string,
  addr: string | null,
  keyId: number | string | null,
  sequenceNum: number | null,
  signature: string | null,
  signingFunction: any | null,
  resolve: any | null,
  role: {
    proposer: boolean,
    authorizer: boolean,
    payer: boolean,
    param?: boolean,
  },
  authorization: any,
}

export interface Interaction {
  tag: string,
  assigns: Record<string, any>,
  status: string,
  reason: string | null,
  accounts: Record<string, InteractionAccount>,
  params: Record<string, any>,
  arguments: Record<string, any>,
  message: {
    cadence: string | null,
    refBlock: string | null,
    computeLimit: string | null,
    proposer: string | null,
    payer: string | null,
    authorizations: string[],
    params: Record<string, any>[],
    arguments: string[]
  },
  proposer: string | null,
  authorizations: string[],
  payer: string[],
  events: {
    eventType: string | null,
    start: string | null,
    end: string | null,
    blockIds: string[]
  },
  transaction: {
    id: string | null
  },
  block: {
    id: string | null,
    height: string | null,
    isSealed: boolean | null
  },
  account: {
    addr: string | null
  },
  collection: {
    id: string | null
  }
}