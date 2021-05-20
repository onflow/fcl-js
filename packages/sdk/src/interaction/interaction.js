import {invariant} from "@onflow/util-invariant"

export const UNKNOWN /*                       */ = "UNKNOWN"
export const SCRIPT /*                        */ = "SCRIPT"
export const TRANSACTION /*                   */ = "TRANSACTION"
export const GET_TRANSACTION_STATUS /*        */ = "GET_TRANSACTION_STATUS"
export const GET_ACCOUNT /*                   */ = "GET_ACCOUNT"
export const GET_EVENTS /*                    */ = "GET_EVENTS"
export const GET_LATEST_BLOCK /*              */ = "GET_LATEST_BLOCK"
export const PING /*                          */ = "PING"
export const GET_TRANSACTION /*               */ = "GET_TRANSACTION"
export const GET_BLOCK_BY_ID /*               */ = "GET_BLOCK_BY_ID"
export const GET_BLOCK_BY_HEIGHT /*           */ = "GET_BLOCK_BY_HEIGHT"
export const GET_BLOCK /*                     */ = "GET_BLOCK"
export const GET_BLOCK_HEADER /*              */ = "GET_BLOCK_HEADER"
export const GET_COLLECTION /*                */ = "GET_COLLECTION"

export const BAD /* */ = "BAD"
export const OK /*  */ = "OK"

export const ACCOUNT /*  */ = "ACCOUNT"
export const PARAM /*    */ = "PARAM"
export const ARGUMENT /* */ = "ARGUMENT"

export const AUTHORIZER /* */ = "authorizer"
export const PAYER /*      */ = "payer"
export const PROPOSER /*   */ = "proposer"

const ACCT = `{
  "kind":"${ACCOUNT}",
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
  "kind":"${PARAM}",
  "tempId":null,
  "key":null,
  "value":null,
  "asParam":null,
  "xform":null,
  "resolve": null
}`

const ARG = `{
  "kind":"${ARGUMENT}",
  "tempId":null,
  "value":null,
  "asArgument":null,
  "xform":null,
  "resolve": null
}`

const IX = `{
  "tag":"${UNKNOWN}",
  "assigns":{},
  "status":"${OK}",
  "reason":null,
  "accounts":{},
  "params":{},
  "arguments":{},
  "message": {
    "cadence":null,
    "refBlock":null,
    "computeLimit":null,
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
    "end":null,
    "blockIds":[]
  },
  "transaction": {
    "id":null
  },
  "block": {
    "id":null,
    "height":null,
    "isSealed":null
  },
  "account": {
    "addr":null
  },
  "collection": {
    "id":null
  }
}`

const KEYS = new Set(Object.keys(JSON.parse(IX)))

export const interaction = () => JSON.parse(IX)

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".split("")
const randChar = () => CHARS[~~(Math.random() * CHARS.length)]
export const uuid = () => Array.from({length: 10}, randChar).join("")
export const isNumber = d => typeof d === "number"
export const isArray = d => Array.isArray(d)
export const isObj = d => d !== null && typeof d === "object"
export const isNull = d => d == null
export const isFn = d => typeof d === "function"

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

const makeIx = wat => ix => {
  ix.tag = wat
  return Ok(ix)
}

export const prepAccount = (acct, opts = {}) => ix => {
  invariant(
    typeof acct === "function" || typeof acct === "object",
    "prepAccount must be passed an authorization function or an account object"
  )
  invariant(opts.role != null, "Account must have a role")

  const ACCOUNT = JSON.parse(ACCT)
  const role = opts.role
  const tempId = uuid()

  acct = typeof acct === "function" ? {resolve: acct} : acct

  ix.accounts[tempId] = {
    ...ACCOUNT,
    tempId,
    ...acct,
    role: {
      ...ACCOUNT.role,
      ...(typeof acct.role === "object" ? acct.role : {}),
      [role]: true,
    },
  }

  if (role === AUTHORIZER) {
    ix.authorizations.push(tempId)
  } else {
    ix[role] = tempId
  }

  return ix
}

export const makeArgument = arg => ix => {
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

export const makeUnknown /*                 */ = makeIx(UNKNOWN)
export const makeScript /*                  */ = makeIx(SCRIPT)
export const makeTransaction /*             */ = makeIx(TRANSACTION)
export const makeGetTransactionStatus /*    */ = makeIx(GET_TRANSACTION_STATUS)
export const makeGetTransaction /*          */ = makeIx(GET_TRANSACTION)
export const makeGetAccount /*              */ = makeIx(GET_ACCOUNT)
export const makeGetEvents /*               */ = makeIx(GET_EVENTS)
export const makeGetLatestBlock /*          */ = makeIx(GET_LATEST_BLOCK)
export const makeGetBlockById /*            */ = makeIx(GET_BLOCK_BY_ID)
export const makeGetBlockByHeight /*        */ = makeIx(GET_BLOCK_BY_HEIGHT)
export const makePing /*                    */ = makeIx(PING)
export const makeGetBlock /*                */ = makeIx(GET_BLOCK)
export const makeGetBlockHeader /*          */ = makeIx(GET_BLOCK_HEADER)
export const makeGetCollection /*           */ = makeIx(GET_COLLECTION)

const is = wat => ix => ix.tag === wat

export const isUnknown /*                 */ = is(UNKNOWN)
export const isScript /*                  */ = is(SCRIPT)
export const isTransaction /*             */ = is(TRANSACTION)
export const isGetTransactionStatus /*    */ = is(GET_TRANSACTION_STATUS)
export const isGetTransaction /*          */ = is(GET_TRANSACTION)
export const isGetAccount /*              */ = is(GET_ACCOUNT)
export const isGetEvents /*               */ = is(GET_EVENTS)
export const isGetLatestBlock /*          */ = is(GET_LATEST_BLOCK)
export const isGetBlockById /*            */ = is(GET_BLOCK_BY_ID)
export const isGetBlockByHeight /*        */ = is(GET_BLOCK_BY_HEIGHT)
export const isPing /*                    */ = is(PING)
export const isGetBlock /*                */ = is(GET_BLOCK)
export const isGetBlockHeader /*          */ = is(GET_BLOCK_HEADER)
export const isGetCollection /*           */ = is(GET_COLLECTION)

export const isOk /*  */ = ix => ix.status === OK
export const isBad /* */ = ix => ix.status === BAD
export const why /*   */ = ix => ix.reason

export const isAccount /*  */ = account => account.kind === ACCOUNT
export const isParam /*    */ = param => param.kind === PARAM
export const isArgument /* */ = argument => argument.kind === ARGUMENT

const hardMode = ix => {
  for (let key of Object.keys(ix)) {
    if (!KEYS.has(key))
      throw new Error(`"${key}" is an invalid root level Interaction property.`)
  }
  return ix
}

const recPipe = async (ix, fns = []) => {
  try {
    ix = hardMode(await ix)
    if (isBad(ix)) throw new Error(`Interaction Error: ${ix.reason}`)
    if (!fns.length) return ix
    const [hd, ...rest] = fns
    const cur = await hd
    if (isFn(cur)) return recPipe(cur(ix), rest)
    if (isNull(cur) || !cur) return recPipe(ix, rest)
    if (isInteraction(cur)) return recPipe(cur, rest)
    throw new Error("Invalid Interaction Composition")
  } catch (e) {
    throw e
  }
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
