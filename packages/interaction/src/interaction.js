export const UNKNOWN /*          */ = 0b00000001
export const SCRIPT /*           */ = 0b00000010
export const TRANSACTION /*      */ = 0b00000100
export const GET_TRANSACTION /*  */ = 0b00001000
export const GET_ACCOUNT /*      */ = 0b00010000
export const GET_EVENTS /*       */ = 0b00100000
export const GET_LATEST_BLOCK /* */ = 0b01000000
export const PING /*             */ = 0b10000000

const IX = `{
  "tag":${UNKNOWN},
  "payload":null,
  "signatures":[],
  "payer":null,
  "assigns":{}
}`

export const interaction = () => JSON.parse(IX)

const make = wat => ix => {
  ix.tag = wat
  return ix
}
export const makeUnknown /*        */ = make(UNKNOWN)
export const makeScript /*         */ = make(SCRIPT)
export const makeTransaction /*    */ = make(TRANSACTION)
export const makeGetTransaction /* */ = make(GET_TRANSACTION)
export const makeGetAccount /*     */ = make(GET_ACCOUNT)
export const makeGetEvents /*      */ = make(GET_EVENTS)
export const makeGetLatestBlock /* */ = make(GET_LATEST_BLOCK)
export const makePing /*           */ = make(PING)

const is = wat => ix => Boolean(ix.tag & wat)
export const isUnknown /*        */ = is(UNKNOWN)
export const isScript /*         */ = is(SCRIPT)
export const isTransaction /*    */ = is(TRANSACTION)
export const isGetTransaction /* */ = is(GET_TRANSACTION)
export const isGetAccount /*     */ = is(GET_ACCOUNT)
export const isGetEvents /*      */ = is(GET_EVENTS)
export const isGetLatestBlock /* */ = is(GET_LATEST_BLOCK)
export const isPing /*           */ = is(PING)
