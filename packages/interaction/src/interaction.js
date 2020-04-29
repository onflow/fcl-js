export const UNKNOWN /*                 */ = 0b00000001
export const SCRIPT /*                  */ = 0b00000010
export const TRANSACTION /*             */ = 0b00000100
export const GET_TRANSACTION_STATUS /*  */ = 0b00001000
export const GET_ACCOUNT /*             */ = 0b00010000
export const GET_EVENTS /*              */ = 0b00100000
export const GET_LATEST_BLOCK /*        */ = 0b01000000
export const PING /*                    */ = 0b10000000

export const BAD /* */ = 0b01
export const OK /*  */ = 0b10

export const ACCOUNT /* */ = 0b01
export const PARAM /*   */ = 0b10

const ACCT = `{
  "kind":${ACCOUNT},
  "tempId":null,
  "addr":null,
  "keyId":null,
  "sequenceNum":null,
  "signature":null,
  "signingFunction":null,
  "resolve":null,
  "role": {
    "proposer":false,
    "authorizer":false,
    "payer":false,
    "param":false
  }
}`

const PRM = `{
  "kind":${PARAM},
  "tempId":null,
  "value":null
}`

const IX = `{
  "tag":${UNKNOWN},
  "assigns":{},
  "status":${OK},
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

const KEYS = new Set(Object.keys(JSON.parse(IX)))

export const interaction = () => JSON.parse(IX)

const isArray = (d) => Array.isArray(d)
const isObj = (d) => typeof d === "object"
const isNull = (d) => d == null
const isNumber = (d) => d === "number"
const isFn = (d) => typeof d === "function"

export const isInteraction = (ix) => {
  if (!isObj(ix) || isNull(ix) || isNumber(ix)) return false
  for (let key of KEYS) if (!ix.hasOwnProperty(key)) return false
  return true
}

export const Ok = (ix) => {
  ix.status = OK
  return ix
}

export const Bad = (ix, reason) => {
  ix.status = BAD
  ix.reason = reason
  return ix
}

const makeIx = (wat) => (ix) => {
  ix.tag = wat
  return Ok(ix)
}

export const makeAccount = (ix, uuid) => {
  ix.accounts[uuid] = JSON.parse(ACCT)
  return Ok(ix)
}

export const makeParam = (ix, uuid) => {
  ix.params[uuid] = JSON.parse(PRM)
  return Ok(ix)
}

export const makeUnknown /*               */ = makeIx(UNKNOWN)
export const makeScript /*                */ = makeIx(SCRIPT)
export const makeTransaction /*           */ = makeIx(TRANSACTION)
export const makeGetTransactionStatus /*  */ = makeIx(GET_TRANSACTION_STATUS)
export const makeGetAccount /*            */ = makeIx(GET_ACCOUNT)
export const makeGetEvents /*             */ = makeIx(GET_EVENTS)
export const makeGetLatestBlock /*        */ = makeIx(GET_LATEST_BLOCK)
export const makePing /*                  */ = makeIx(PING)

const is = (wat) => (ix) => Boolean(ix.tag & wat)

export const isUnknown /*               */ = is(UNKNOWN)
export const isScript /*                */ = is(SCRIPT)
export const isTransaction /*           */ = is(TRANSACTION)
export const isGetTransactionStatus /*  */ = is(GET_TRANSACTION_STATUS)
export const isGetAccount /*            */ = is(GET_ACCOUNT)
export const isGetEvents /*             */ = is(GET_EVENTS)
export const isGetLatestBlock /*        */ = is(GET_LATEST_BLOCK)
export const isPing /*                  */ = is(PING)

export const isOk /*  */ = (ix) => Boolean(ix.status & OK)
export const isBad /* */ = (ix) => Boolean(ix.status & BAD)
export const why /*   */ = (ix) => ix.reason

export const isAccount /*  */ = (account) => Boolean(account.kind & ACCOUNT)
export const isParam /*    */ = (param) => Boolean(param.kind & PARAM)

const hardMode = (ix) => {
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
  if (isArray(arg1) && arg2 == null) return (d) => pipe(d, arg1)
  return recPipe(arg1, arg2)
}

const identity = (v) => v

export const get = (ix, key, fallback) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

export const put = (key, value) => (ix) => {
  ix.assigns[key] = value
  return Ok(ix)
}

export const update = (key, fn = identity) => (ix) => {
  ix.assigns[key] = fn(ix.assigns[key], ix)
  return Ok(ix)
}

export const destroy = (key) => (ix) => {
  delete ix.assigns[key]
  return Ok(ix)
}
