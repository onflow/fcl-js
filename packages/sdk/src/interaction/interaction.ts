import {invariant} from "@onflow/util-invariant"
import {v4 as uuidv4} from "uuid"

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

export interface IAcct {
  "kind": typeof ACCOUNT,
  "tempId": string | null,
  "addr": string | null,
  "keyId": number | string | null,
  "sequenceNum": number | null,
  "signature": any | null,
  "signingFunction": any | null,
  "resolve": any | null,
  "role": {
    "proposer": boolean,
    "authorizer": boolean,
    "payer": boolean,
    "param": boolean,
  },
  authorization: any,
}
type AcctFn = (IAcct) => IAcct;
type IAcctFn = AcctFn & Partial<IAcct>;

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
  "resolve": null,
  "resolveArgument": null
}`

interface IIx {
  "tag": string,
  "assigns": Record<string, any>,
  "status": string,
  "reason": string | null,
  "accounts": Record<string, any>,
  "params": Record<string, any>,
  "arguments": Record<string, any>,
  "message": {
    "cadence": string | null,
    "refBlock": string | null,
    "computeLimit": string | null,
    "proposer": string | null,
    "payer": string | null,
    "authorizations": string[],
    "params": Record<string, any>[],
    "arguments": Record<string, any>[]
  },
  "proposer": string | null,
  "authorizations": string[],
  "payer": string[],
  "events": {
    "eventType": string | null,
    "start": string | null,
    "end": string | null,
    "blockIds": string[]
  },
  "transaction": {
    "id": string | null
  },
  "block": {
    "id": string | null,
    "height": string | null,
    "isSealed": boolean | null
  },
  "account": {
    "addr": string | null
  },
  "collection": {
    "id": string | null
  }
}

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
  "payer":[],
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

const KEYS = new Set(Object.keys(JSON.parse(IX) as IIx))

export const initInteraction = (): IIx => JSON.parse(IX)

export const isNumber = d => typeof d === "number"
export const isArray = d => Array.isArray(d)
export const isObj = d => d !== null && typeof d === "object"
export const isNull = d => d == null
export const isFn = d => typeof d === "function"

export const isInteraction = (ix: IIx) => {
  if (!isObj(ix) || isNull(ix) || isNumber(ix)) return false
  for (let key of KEYS) if (!ix.hasOwnProperty(key)) return false
  return true
}

export const Ok = (ix: IIx) => {
  ix.status = OK
  return ix
}

export const Bad = (ix: IIx, reason) => {
  ix.status = BAD
  ix.reason = reason
  return ix
}

const makeIx = (wat: string) => (ix: IIx) => {
  ix.tag = wat
  return Ok(ix)
}

const prepAccountKeyId = (acct: IAcct | IAcctFn): IAcct | IAcctFn => {
  if (acct.keyId == null) return acct

  invariant(!isNaN(parseInt(acct.keyId.toString())), "account.keyId must be an integer")

  return {
    ...acct,
    keyId: parseInt(acct.keyId.toString()),
  } as IAcct | IAcctFn
}

interface IPrepAccountOpts {
  role: string | null
}

export const initAccount = (): IAcct => JSON.parse(ACCT)

export const prepAccount = (acct: IAcct | IAcctFn, opts: IPrepAccountOpts = {role: null}) => (ix: IIx) => {
  invariant(
    typeof acct === "function" || typeof acct === "object",
    "prepAccount must be passed an authorization function or an account object"
  )
  invariant(opts.role != null, "Account must have a role")

  const ACCOUNT = initAccount()
  const role = opts.role
  const tempId = uuidv4()

  if (acct.authorization && isFn(acct.authorization))
    acct = {...ACCOUNT, resolve: acct.authorization}
  if (!acct.authorization && isFn(acct)) acct = {...ACCOUNT, resolve: acct}

  const resolve = acct.resolve
  if (resolve)
    acct.resolve = (acct, ...rest) =>
      [resolve, prepAccountKeyId].reduce(
        async (d, fn) => fn(await d, ...rest),
        acct
      )
  acct = prepAccountKeyId(acct)

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
  } else if (role === PAYER) {
    ix.payer.push(tempId)
  } else {
    ix[role] = tempId
  }

  return ix
}

export const makeArgument = arg => ix => {
  let tempId = uuidv4()
  ix.message.arguments.push(tempId)

  ix.arguments[tempId] = JSON.parse(ARG)
  ix.arguments[tempId].tempId = tempId
  ix.arguments[tempId].value = arg.value
  ix.arguments[tempId].asArgument = arg.asArgument
  ix.arguments[tempId].xform = arg.xform
  ix.arguments[tempId].resolve = arg.resolve
  ix.arguments[tempId].resolveArgument = isFn(arg.resolveArgument)
    ? arg.resolveArgument.bind(arg)
    : arg.resolveArgument

  return Ok(ix)
}

export const makeUnknown /*                 */ = makeIx(UNKNOWN)
export const makeScript /*                  */ = makeIx(SCRIPT)
export const makeTransaction /*             */ = makeIx(TRANSACTION)
export const makeGetTransactionStatus /*    */ = makeIx(GET_TRANSACTION_STATUS)
export const makeGetTransaction /*          */ = makeIx(GET_TRANSACTION)
export const makeGetAccount /*              */ = makeIx(GET_ACCOUNT)
export const makeGetEvents /*               */ = makeIx(GET_EVENTS)
export const makePing /*                    */ = makeIx(PING)
export const makeGetBlock /*                */ = makeIx(GET_BLOCK)
export const makeGetBlockHeader /*          */ = makeIx(GET_BLOCK_HEADER)
export const makeGetCollection /*           */ = makeIx(GET_COLLECTION)
export const makeGetNetworkParameters /*    */ = makeIx(GET_NETWORK_PARAMETERS)

const is = wat => (ix: IIx) => ix.tag === wat

export const isUnknown /*                 */ = is(UNKNOWN)
export const isScript /*                  */ = is(SCRIPT)
export const isTransaction /*             */ = is(TRANSACTION)
export const isGetTransactionStatus /*    */ = is(GET_TRANSACTION_STATUS)
export const isGetTransaction /*          */ = is(GET_TRANSACTION)
export const isGetAccount /*              */ = is(GET_ACCOUNT)
export const isGetEvents /*               */ = is(GET_EVENTS)
export const isPing /*                    */ = is(PING)
export const isGetBlock /*                */ = is(GET_BLOCK)
export const isGetBlockHeader /*          */ = is(GET_BLOCK_HEADER)
export const isGetCollection /*           */ = is(GET_COLLECTION)
export const isGetNetworkParameters /*    */ = is(GET_NETWORK_PARAMETERS)

export const isOk /*  */ = (ix: IIx) => ix.status === OK
export const isBad /* */ = (ix: IIx) => ix.status === BAD
export const why /*   */ = (ix: IIx) => ix.reason

export const isAccount /*  */ = account => account.kind === ACCOUNT
export const isParam /*    */ = param => param.kind === PARAM
export const isArgument /* */ = argument => argument.kind === ARGUMENT

const hardMode = (ix: IIx) => {
  for (let key of Object.keys(ix)) {
    if (!KEYS.has(key))
      throw new Error(`"${key}" is an invalid root level Interaction property.`)
  }
  return ix
}

const recPipe = async (ix: IIx, fns = []) => {
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

const identity = (v, ..._) => v

export const get = (ix: IIx, key: string, fallback) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

export const put = (key: string, value) => (ix: IIx) => {
  ix.assigns[key] = value
  return Ok(ix)
}

export const update = (key: string, fn = identity) => (ix: IIx) => {
  ix.assigns[key] = fn(ix.assigns[key], ix)
  return Ok(ix)
}

export const destroy = (key: string) => (ix: IIx) => {
  delete ix.assigns[key]
  return Ok(ix)
}
