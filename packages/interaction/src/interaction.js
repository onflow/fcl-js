export const UNKNOWN /*                 */ = 0b0000000001
export const SCRIPT /*                  */ = 0b0000000010
export const TRANSACTION /*             */ = 0b0000000100
export const GET_TRANSACTION_STATUS /*  */ = 0b0000001000
export const GET_ACCOUNT /*             */ = 0b0000010000
export const GET_EVENTS /*              */ = 0b0000100000
export const GET_LATEST_BLOCK /*        */ = 0b0001000000
export const PING /*                    */ = 0b0010000000
export const GET_BLOCK_BY_ID /*         */ = 0b0100000000
export const GET_BLOCK_BY_HEIGHT /*     */ = 0b1000000000

export const BAD /* */ = 0b01
export const OK /*  */ = 0b10

export const ACCOUNT /* */ = 0b001
export const PARAM /*   */ = 0b010
export const ARGUMENT /**/ = 0b100

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
  "key":null,
  "value":null,
  "asParam":null,
  "xform":null,
  "resolve": null
}`

const ARG = `{
  "kind":${ARGUMENT},
  "tempId":null,
  "value":null,
  "asArgument":null,
  "xform":null,
  "resolve": null
}`

const IX = `{
  "tag":${UNKNOWN},
  "assigns":{},
  "status":${OK},
  "reason":null,
  "accounts":{},
  "params":{},
  "arguments":{},
  "message": {
    "cadence":null,
    "refBlock":null,
    "computLimit":null,
    "proposer":null,
    "payer":null,
    "authorizations":[],
    "params":[],
    "arguments":[]
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
  "block": {
    "isSealed":null,
    "id":null,
    "height":null
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

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".split("")
const randChar = () => CHARS[~~(Math.random() * CHARS.length)]
export const uuid = () => Array.from({length: 10}, randChar).join("")

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

const makeAccount = (acct, tempId) => (ix) => {
  ix.accounts[tempId] = JSON.parse(ACCT)
  ix.accounts[tempId].tempId = tempId
  ix.accounts[tempId].addr = acct.addr
  ix.accounts[tempId].keyId = acct.keyId
  ix.accounts[tempId].sequenceNum = acct.sequenceNum
  ix.accounts[tempId].signature = acct.signature
  ix.accounts[tempId].signingFunction = acct.signingFunction
  ix.accounts[tempId].resolve = acct.resolve
  ix.accounts[tempId].role = {
    ...ix.accounts[tempId].role,
    ...acct.role,
  }
  return Ok(ix)
}

export const makeAuthorizer = (acct) => (ix) => {
  let tempId = uuid()
  ix.authorizations.push(tempId)
  return Ok(pipe(ix, [makeAccount(acct, tempId)]))
}

export const makeProposer = (acct) => (ix) => {
  let tempId = uuid()
  ix.proposer = tempId
  return Ok(pipe(ix, [makeAccount(acct, tempId)]))
}

export const makePayer = (acct) => (ix) => {
  let tempId = uuid()
  ix.payer = tempId
  return Ok(pipe(ix, [makeAccount(acct, tempId)]))
} 

export const makeParam = (param) => (ix) => {
  let tempId = uuid()
  ix.message.params.push(tempId)

  ix.params[tempId] = JSON.parse(PRM)
  ix.params[tempId].tempId = tempId
  ix.params[tempId].key = param.key
  ix.params[tempId].value = param.value
  ix.params[tempId].asParam = param.asParam
  ix.params[tempId].xform = param.xform
  ix.params[tempId].resolve = param.resolve
  return Ok(ix)
}

export const makeArgument = (arg) => (ix) => {
  let tempId = uuid()
  ix.message.arguments.push(tempId)

  ix.arguments[tempId] = JSON.parse(ARG)
  ix.arguments[tempId].tempId = tempId
  ix.arguments[tempId].value = arg.value
  ix.arguments[tempId].asArgument = arg.asArgument
  ix.arguments[tempId].xform = arg.xform
  ix.arguments[tempId].resolve = arg.resolve
  return Ok(ix)
}

export const makeUnknown /*               */ = makeIx(UNKNOWN)
export const makeScript /*                */ = makeIx(SCRIPT)
export const makeTransaction /*           */ = makeIx(TRANSACTION)
export const makeGetTransactionStatus /*  */ = makeIx(GET_TRANSACTION_STATUS)
export const makeGetAccount /*            */ = makeIx(GET_ACCOUNT)
export const makeGetEvents /*             */ = makeIx(GET_EVENTS)
export const makeGetLatestBlock /*        */ = makeIx(GET_LATEST_BLOCK)
export const makeGetBlockById /*          */ = makeIx(GET_BLOCK_BY_ID)
export const makeGetBlockByHeight /*      */ = makeIx(GET_BLOCK_BY_HEIGHT)
export const makePing /*                  */ = makeIx(PING)

const is = (wat) => (ix) => Boolean(ix.tag & wat)

export const isUnknown /*               */ = is(UNKNOWN)
export const isScript /*                */ = is(SCRIPT)
export const isTransaction /*           */ = is(TRANSACTION)
export const isGetTransactionStatus /*  */ = is(GET_TRANSACTION_STATUS)
export const isGetAccount /*            */ = is(GET_ACCOUNT)
export const isGetEvents /*             */ = is(GET_EVENTS)
export const isGetLatestBlock /*        */ = is(GET_LATEST_BLOCK)
export const isGetBlockById /*          */ = is(GET_BLOCK_BY_ID)
export const isGetBlockByHeight /*      */ = is(GET_BLOCK_BY_HEIGHT)
export const isPing /*                  */ = is(PING)

export const isOk /*  */ = (ix) => Boolean(ix.status & OK)
export const isBad /* */ = (ix) => Boolean(ix.status & BAD)
export const why /*   */ = (ix) => ix.reason

export const isAccount /*  */ = (account) => Boolean(account.kind & ACCOUNT)
export const isParam /*    */ = (param) => Boolean(param.kind & PARAM)
export const isArgument /* */ = (argument) => Boolean(argument.kind & ARGUMENT)

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
