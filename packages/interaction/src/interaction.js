export const UNKNOWN /*          */ = 0b00000001
export const SCRIPT /*           */ = 0b00000010
export const TRANSACTION /*      */ = 0b00000100
export const GET_TRANSACTION /*  */ = 0b00001000
export const GET_ACCOUNT /*      */ = 0b00010000
export const GET_EVENTS /*       */ = 0b00100000
export const GET_LATEST_BLOCK /* */ = 0b01000000
export const PING /*             */ = 0b10000000

export const BAD /* */ = 0b01
export const OK /*  */ = 0b10

const IX = `{
  "tag":${UNKNOWN},
  "assigns":{},
  "status":${OK},
  "reason":null,
  "payload":{
    "code":null,
    "ref":null,
    "nonce":null,
    "limit":null
  },
  "bounds":{
    "start":null,
    "end":null
  },
  "acct":null,
  "authz":[],
  "payer":null,
  "eventType":null,
  "txId":null,
  "isSealed":null
}`

const KEYS = new Set(Object.keys(JSON.parse(IX)))

export const interaction = () => JSON.parse(IX)

const isArray = d => Array.isArray(d)
const isObj = d => typeof d === "object"
const isNull = d => d == null
const isNumber = d => d === "number"
const isFn = d => typeof d === "function"

export const isInteraction = ix => {
  if (!isObj(ix) || isNull(ix) || isNumber(ix)) return false
  for (let key of KEYS) if (!ix.hasOwnProperty(key)) return false
  return true
}

export const Ok = ix => {
  ix.status = OK
  return ix
}

export const Bad = (ix, reason) => {
  ix.status = BAD
  ix.reason = reason
  return ix
}

const make = wat => ix => {
  ix.tag = wat
  return Ok(ix)
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

export const isOk /*  */ = ix => Boolean(ix.status & OK)
export const isBad /* */ = ix => Boolean(ix.status & BAD)
export const why /*   */ = ix => ix.reason

const hardMode = ix => {
  for (let key of Object.keys(ix)) {
    if (!KEYS.has(key))
      throw new Error(`"${key}" is an invalid root level Interaction property.`)
  }
  return ix
}

const recPipe = async (ix, fns = []) => {
  ix = hardMode(await ix)
  if (isBad(ix) || !fns.length) return ix
  const [hd, ...rest] = fns
  const cur = await hd
  if (isFn(cur)) return recPipe(cur(ix), rest)
  if (isNull(cur) || !cur) return recPipe(ix, rest)
  if (isInteraction(cur)) return recPipe(cur, rest)
  throw new Error("Invalid Interaction Composition")
}

export const pipe = (...args) => {
  const [arg1, arg2] = args
  if (isArray(arg1) && arg2 == null) return d => pipe(d, arg1)
  return recPipe(arg1, arg2)
}

const identity = v => v

export const get = (ix, key, fallback) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

export const put = (key, value) => ix => {
  ix.assigns[key] = value
  return Ok(ix)
}

export const update = (key, fn = identity) => ix => {
  ix.assigns[key] = fn(ix.assigns[key], ix)
  return Ok(ix)
}

export const destroy = key => ix => {
  delete ix.assigns[key]
  return Ok(ix)
}
