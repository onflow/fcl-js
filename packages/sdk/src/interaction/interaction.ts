import {invariant} from "@onflow/util-invariant"
import {v4 as uuidv4} from "uuid"
import {log, LEVELS} from "@onflow/util-logger"

import {
  TransactionRole,
  Interaction,
  InteractionAccount,
  InteractionResolverKind,
  InteractionStatus,
  InteractionTag,
} from "@onflow/typedefs"
import {TypeDescriptor, TypeDescriptorInput} from "@onflow/types"

type AcctFn = (acct: InteractionAccount) => InteractionAccount
type AccountFn = AcctFn & Partial<InteractionAccount>

type CadenceArgument<T extends TypeDescriptor<any, any>> = {
  value: TypeDescriptorInput<T>
  xform: T
}

export {CadenceArgument}

const ACCT = `{
  "kind":"${InteractionResolverKind.ACCOUNT}",
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

const ARG = `{
  "kind":"${InteractionResolverKind.ARGUMENT}",
  "tempId":null,
  "value":null,
  "asArgument":null,
  "xform":null,
  "resolve": null,
  "resolveArgument": null
}`

const IX = `{
  "tag":"${InteractionTag.UNKNOWN}",
  "assigns":{},
  "status":"${InteractionStatus.OK}",
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
  "subscribeEvents": {
    "startBlockId":null,
    "startHeight":null,
    "eventTypes":null,
    "addresses":null,
    "contracts":null,
    "heartbeatInterval":null
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

const KEYS = new Set(Object.keys(JSON.parse(IX) as Interaction))

export const initInteraction = (): Interaction => JSON.parse(IX)
/**
 * @deprecated
 */
export const interaction = () => {
  log.deprecate({
    pkg: "FCL/SDK",
    message: `The interaction been deprecated from the Flow JS-SDK/FCL. use initInteraction instead`,
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0010-deprecate-interaction",
    level: LEVELS.warn,
  })
  return initInteraction()
}

export const isNumber = (d: any): d is number => typeof d === "number"
export const isArray = (d: any): d is any[] => Array.isArray(d)
export const isObj = (d: any): d is Record<string, any> =>
  d !== null && typeof d === "object"
export const isNull = (d: any): d is null => d == null
export const isFn = (d: any): d is Function => typeof d === "function"

export const isInteraction = (ix: unknown) => {
  if (!isObj(ix) || isNull(ix) || isNumber(ix)) return false
  for (let key of KEYS) if (!ix.hasOwnProperty(key)) return false
  return true
}

export const Ok = (ix: Interaction) => {
  ix.status = InteractionStatus.OK
  return ix
}

export const Bad = (ix: Interaction, reason: string) => {
  ix.status = InteractionStatus.BAD
  ix.reason = reason
  return ix
}

const makeIx = (wat: InteractionTag) => (ix: Interaction) => {
  ix.tag = wat
  return Ok(ix)
}

const prepAccountKeyId = (
  acct: Partial<InteractionAccount> | AccountFn
): Partial<InteractionAccount> | AccountFn => {
  if (acct.keyId == null) return acct

  invariant(
    !isNaN(parseInt(acct.keyId.toString())),
    "account.keyId must be an integer"
  )

  return {
    ...acct,
    keyId: parseInt(acct.keyId.toString()),
  } as InteractionAccount | AccountFn
}

interface IPrepAccountOpts {
  role?: TransactionRole | null
}

export const initAccount = (): InteractionAccount => JSON.parse(ACCT)

export const prepAccount =
  (acct: InteractionAccount | AccountFn, opts: IPrepAccountOpts = {}) =>
  (ix: Interaction) => {
    invariant(
      typeof acct === "function" || typeof acct === "object",
      "prepAccount must be passed an authorization function or an account object"
    )
    invariant(opts.role != null, "Account must have a role")

    const ACCOUNT = initAccount()
    const role = opts.role
    const tempId = uuidv4()
    let account: Partial<InteractionAccount> = {...acct}

    if (acct.authorization && isFn(acct.authorization))
      account = {resolve: acct.authorization}
    if (!acct.authorization && isFn(acct)) account = {resolve: acct}

    const resolve = account.resolve
    if (resolve) {
      account.resolve = (acct: InteractionAccount, ...rest: any[]) =>
        [resolve, prepAccountKeyId].reduce(
          async (d, fn) => fn(await d, ...rest),
          acct
        )
    }
    account = prepAccountKeyId(account)

    ix.accounts[tempId] = {
      ...ACCOUNT,
      tempId,
      ...account,
      role: {
        ...ACCOUNT.role,
        ...(typeof acct.role === "object" ? acct.role : {}),
        ...(role ? {[role]: true} : {}),
      },
    }

    if (role === TransactionRole.AUTHORIZER) {
      ix.authorizations.push(tempId)
    } else if (role === TransactionRole.PAYER) {
      ix.payer.push(tempId)
    } else if (role) {
      ix[role] = tempId
    }

    return ix
  }

export const makeArgument = (arg: Record<string, any>) => (ix: Interaction) => {
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

export const makeUnknown /*                 */ = makeIx(InteractionTag.UNKNOWN)
export const makeScript /*                  */ = makeIx(InteractionTag.SCRIPT)
export const makeTransaction /*             */ = makeIx(
  InteractionTag.TRANSACTION
)
export const makeGetTransactionStatus /*    */ = makeIx(
  InteractionTag.GET_TRANSACTION_STATUS
)
export const makeGetTransaction /*          */ = makeIx(
  InteractionTag.GET_TRANSACTION
)
export const makeGetAccount /*              */ = makeIx(
  InteractionTag.GET_ACCOUNT
)
export const makeGetEvents /*               */ = makeIx(
  InteractionTag.GET_EVENTS
)
export const makePing /*                    */ = makeIx(InteractionTag.PING)
export const makeGetBlock /*                */ = makeIx(
  InteractionTag.GET_BLOCK
)
export const makeGetBlockHeader /*          */ = makeIx(
  InteractionTag.GET_BLOCK_HEADER
)
export const makeGetCollection /*           */ = makeIx(
  InteractionTag.GET_COLLECTION
)
export const makeGetNetworkParameters /*    */ = makeIx(
  InteractionTag.GET_NETWORK_PARAMETERS
)
export const makeSubscribeEvents /*         */ = makeIx(
  InteractionTag.SUBSCRIBE_EVENTS
)
export const makeGetNodeVerionInfo /*       */ = makeIx(
  InteractionTag.GET_NODE_VERSION_INFO
)

const is = (wat: InteractionTag) => (ix: Interaction) => ix.tag === wat

export const isUnknown /*                 */ = is(InteractionTag.UNKNOWN)
export const isScript /*                  */ = is(InteractionTag.SCRIPT)
export const isTransaction /*             */ = is(InteractionTag.TRANSACTION)
export const isGetTransactionStatus /*    */ = is(
  InteractionTag.GET_TRANSACTION_STATUS
)
export const isGetTransaction /*          */ = is(
  InteractionTag.GET_TRANSACTION
)
export const isGetAccount /*              */ = is(InteractionTag.GET_ACCOUNT)
export const isGetEvents /*               */ = is(InteractionTag.GET_EVENTS)
export const isPing /*                    */ = is(InteractionTag.PING)
export const isGetBlock /*                */ = is(InteractionTag.GET_BLOCK)
export const isGetBlockHeader /*          */ = is(
  InteractionTag.GET_BLOCK_HEADER
)
export const isGetCollection /*           */ = is(InteractionTag.GET_COLLECTION)
export const isGetNetworkParameters /*    */ = is(
  InteractionTag.GET_NETWORK_PARAMETERS
)
export const isGetNodeVersionInfo /*      */ = is(
  InteractionTag.GET_NODE_VERSION_INFO
)
export const isSubscribeEvents /*         */ = is(
  InteractionTag.SUBSCRIBE_EVENTS
)

export const isOk /*  */ = (ix: Interaction) =>
  ix.status === InteractionStatus.OK
export const isBad /* */ = (ix: Interaction) =>
  ix.status === InteractionStatus.BAD
export const why /*   */ = (ix: Interaction) => ix.reason

export const isAccount /*  */ = (account: Record<string, any>) =>
  account.kind === InteractionResolverKind.ACCOUNT
export const isArgument /* */ = (argument: Record<string, any>) =>
  argument.kind === InteractionResolverKind.ARGUMENT

const hardMode = (ix: Interaction) => {
  for (let key of Object.keys(ix)) {
    if (!KEYS.has(key))
      throw new Error(`"${key}" is an invalid root level Interaction property.`)
  }
  return ix
}

type MaybePromise<T> = T | Promise<T>

const recPipe = async (
  ix: MaybePromise<Interaction>,
  fns: (
    | ((x: Interaction) => MaybePromise<Interaction>)
    | MaybePromise<Interaction>
  )[] = []
): Promise<Interaction> => {
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

/**
 * @description Async pipe function to compose interactions
 * @returns An interaction object
 */
function pipe(
  fns: ((x: Interaction) => Interaction)[]
): (x: Interaction) => Promise<Interaction>
/**
 * @description Async pipe function to compose interactions
 * @returns An interaction object
 */
function pipe(
  ix: MaybePromise<Interaction>,
  fns: ((x: Interaction) => Interaction)[]
): Promise<Interaction>
function pipe(
  ...args:
    | [((x: Interaction) => Interaction)[]]
    | [MaybePromise<Interaction>, ((x: Interaction) => Interaction)[]]
): Promise<Interaction> | ((x: Interaction) => Promise<Interaction>) {
  const [arg1, arg2] = args
  if (isArray(arg1)) return (d: Interaction) => pipe(d, arg1)

  const ix = arg1 as MaybePromise<Interaction>
  const fns = arg2 as ((x: Interaction) => Interaction)[]
  return recPipe(ix, fns)
}
export {pipe}

const identity = <T>(v: T, ..._: any[]) => v

export const get = (ix: Interaction, key: string, fallback: any) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

export const put = (key: string, value: any) => (ix: Interaction) => {
  ix.assigns[key] = value
  return Ok(ix)
}

export const update =
  (key: string, fn = identity) =>
  (ix: Interaction) => {
    ix.assigns[key] = fn(ix.assigns[key], ix)
    return Ok(ix)
  }

export const destroy = (key: string) => (ix: Interaction) => {
  delete ix.assigns[key]
  return Ok(ix)
}
