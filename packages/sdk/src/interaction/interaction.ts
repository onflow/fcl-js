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
import {TypeDescriptorInput, TypeDescriptor} from "@onflow/types"

export type AuthorizationFn = (acct: InteractionAccount) => InteractionAccount
export type AccountAuthorization =
  | (AuthorizationFn & Partial<InteractionAccount>)
  | Partial<InteractionAccount>

type CadenceArgument<T extends TypeDescriptor<any, any>> = {
  value: TypeDescriptorInput<T>
  xform: T
}

export {CadenceArgument}

export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>

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

/**
 * Creates a new interaction object with default values.
 *
 * @returns A new interaction object initialized with default values
 */
export const initInteraction = (): Interaction => JSON.parse(IX)

/**
 * Creates a new interaction object with default values.
 *
 * @deprecated Use initInteraction() instead. This function will be removed in a future version.
 *
 * @returns A new interaction object initialized with default values
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

/**
 * Checks if a value is a number.
 *
 * @param d The value to check
 * @returns True if the value is a number, false otherwise
 *
 * @example
 * import { isNumber } from "@onflow/sdk"
 *
 * console.log(isNumber(42)); // true
 * console.log(isNumber("42")); // false
 * console.log(isNumber(3.14)); // true
 * console.log(isNumber(null)); // false
 */
export const isNumber = (d: any): d is number => typeof d === "number"

/**
 * Checks if a value is an array.
 *
 * @param d The value to check
 * @returns True if the value is an array, false otherwise
 *
 * @example
 * import { isArray } from "@onflow/sdk"
 *
 * console.log(isArray([1, 2, 3])); // true
 * console.log(isArray("hello")); // false
 * console.log(isArray({})); // false
 * console.log(isArray(null)); // false
 */
export const isArray = (d: any): d is any[] => Array.isArray(d)

/**
 * Checks if a value is an object (but not null).
 *
 * @param d The value to check
 * @returns True if the value is an object and not null, false otherwise
 *
 * @example
 * import { isObj } from "@onflow/sdk"
 *
 * console.log(isObj({})); // true
 * console.log(isObj({name: "Alice"})); // true
 * console.log(isObj(null)); // false
 * console.log(isObj("string")); // false
 * console.log(isObj([])); // true (arrays are objects)
 */
export const isObj = (d: any): d is Record<string, any> =>
  d !== null && typeof d === "object"

/**
 * Checks if a value is null or undefined.
 *
 * @param d The value to check
 * @returns True if the value is null or undefined, false otherwise
 *
 * @example
 * import { isNull } from "@onflow/sdk"
 *
 * console.log(isNull(null)); // true
 * console.log(isNull(undefined)); // true
 * console.log(isNull("")); // false
 * console.log(isNull(0)); // false
 * console.log(isNull(false)); // false
 */
export const isNull = (d: any): d is null => d == null

/**
 * Checks if a value is a function.
 *
 * @param d The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * import { isFn } from "@onflow/sdk"
 *
 * console.log(isFn(() => {})); // true
 * console.log(isFn(function() {})); // true
 * console.log(isFn("function")); // false
 * console.log(isFn({})); // false
 */
export const isFn = (d: any): d is Function => typeof d === "function"

/**
 * Checks if an object is a valid interaction.
 *
 * @param ix The object to check
 * @returns True if the object is a valid interaction, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { isInteraction, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 * console.log(isInteraction(interaction)); // true
 * console.log(isInteraction({})); // false
 * console.log(isInteraction(null)); // false
 *
 * // Check if a builder result is a valid interaction
 * const built = await fcl.build([fcl.script`access(all) fun main(): Int { return 42 }`]);
 * console.log(isInteraction(built)); // true
 */
export const isInteraction = (ix: unknown) => {
  if (!isObj(ix) || isNull(ix) || isNumber(ix)) return false
  for (let key of KEYS) if (!ix.hasOwnProperty(key)) return false
  return true
}

/**
 * Marks an interaction as successful and returns the interaction object.
 *
 * @param ix The interaction to mark as successful
 * @returns The interaction object with status set to OK
 *
 * @example
 * import { Ok, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 * const successfulInteraction = Ok(interaction);
 * console.log(successfulInteraction.status); // "OK"
 */
export const Ok = (ix: Interaction) => {
  ix.status = InteractionStatus.OK
  return ix
}

/**
 * Marks an interaction as failed with a specific reason and returns the interaction object.
 *
 * @param ix The interaction to mark as failed
 * @param reason The reason for the failure
 * @returns The interaction object with status set to BAD and reason set
 *
 * @example
 * import { Bad, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 * const failedInteraction = Bad(interaction, "Invalid transaction signature");
 * console.log(failedInteraction.status); // "BAD"
 * console.log(failedInteraction.reason); // "Invalid transaction signature"
 */
export const Bad = (ix: Interaction, reason: string) => {
  ix.status = InteractionStatus.BAD
  ix.reason = reason
  return ix
}

const makeIx = (wat: InteractionTag) => (ix: Interaction) => {
  ix.tag = wat
  return Ok(ix)
}

const prepAccountKeyId = (acct: AccountAuthorization): AccountAuthorization => {
  if (acct.keyId == null) return acct

  invariant(
    !isNaN(parseInt(acct.keyId.toString())),
    "account.keyId must be an integer"
  )

  return {
    ...acct,
    keyId: parseInt(acct.keyId.toString()),
  } as AccountAuthorization
}

interface IPrepAccountOpts {
  role?: TransactionRole | null
}

/**
 * Creates a new account object with default values.
 *
 * @returns A new account object initialized with default values
 *
 * @example
 * import { initAccount } from "@onflow/sdk"
 *
 * const account = initAccount();
 * console.log(account.addr); // null
 * console.log(account.keyId); // null
 * console.log(account.role.proposer); // false
 *
 * // Typically used internally by other functions
 * // You'll more commonly use authorization() or prepAccount()
 */
export const initAccount = (): InteractionAccount => JSON.parse(ACCT)

/**
 * Prepares and configures an account for use in an interaction with a specific role.
 *
 * @param acct The account authorization function or account object
 * @param opts Configuration options including the role for the account
 * @returns A function that adds the prepared account to an interaction
 */
export const prepAccount =
  (acct: AccountAuthorization, opts: IPrepAccountOpts = {}) =>
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

/**
 * Creates an argument resolver and adds it to an interaction.
 *
 * This function is typically used internally by the SDK to handle arguments in scripts and transactions.
 * For most use cases, you should use `fcl.arg()` instead of this function directly.
 *
 * @param arg The argument configuration object
 * @returns A function that adds the argument to an interaction
 *
 * @example
 * import { makeArgument, initInteraction } from "@onflow/sdk"
 * import * as fcl from "@onflow/fcl";
 *
 * const interaction = initInteraction();
 *
 * // Create an argument resolver (usually you'd use fcl.arg instead)
 * const argResolver = {
 *   value: 42,
 *   xform: fcl.t.Int,
 *   resolve: (value, xform) => ({ value, xform })
 * };
 *
 * // Add the argument to the interaction
 * makeArgument(argResolver)(interaction);
 *
 * console.log(interaction.message.arguments.length); // 1
 *
 * // Preferred way - use fcl.arg instead:
 * // fcl.args([fcl.arg(42, fcl.t.Int)])
 */
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

/**
 * Checks if an interaction has a successful status.
 *
 * @param ix The interaction to check
 * @returns True if the interaction status is OK, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { isOk } from "@onflow/sdk"
 *
 * // Check if a transaction was successful
 * const response = await fcl.send([
 *   fcl.transaction`transaction { prepare(account: AuthAccount) {} }`
 * ]);
 *
 * if (isOk(response)) {
 *   console.log("Transaction was successful");
 * } else {
 *   console.log("Transaction failed");
 * }
 */
export const isOk /*  */ = (ix: Interaction) =>
  ix.status === InteractionStatus.OK

/**
 * Checks if an interaction has a failed status.
 *
 * @param ix The interaction to check
 * @returns True if the interaction status is BAD, false otherwise
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { isBad, why } from "@onflow/sdk"
 *
 * const response = await fcl.send([
 *   fcl.transaction`transaction { prepare(account: AuthAccount) {} }`
 * ]);
 *
 * if (isBad(response)) {
 *   console.log("Transaction failed:", why(response));
 * }
 */
export const isBad /* */ = (ix: Interaction) =>
  ix.status === InteractionStatus.BAD

/**
 * Returns the reason for an interaction failure.
 *
 * @param ix The interaction to get the failure reason from
 * @returns The reason string or undefined if no reason is set
 *
 * @example
 * import { Bad, why, initInteraction } from "@onflow/sdk"
 *
 * const interaction = Bad(initInteraction(), "Network timeout");
 * console.log(why(interaction)); // "Network timeout"
 *
 * // Used with error handling
 * if (isBad(response)) {
 *   console.error("Error occurred:", why(response));
 * }
 */
export const why /*   */ = (ix: Interaction) => ix.reason

/**
 * Checks if an object is an account resolver.
 *
 * @param account The object to check
 * @returns True if the object is an account resolver, false otherwise
 *
 * @example
 * import { isAccount, authorization } from "@onflow/sdk"
 *
 * const authz = authorization("0x123", signingFunction);
 * const accountResolver = { kind: "ACCOUNT", addr: "0x123" };
 * const regularObject = { name: "test" };
 *
 * console.log(isAccount(accountResolver)); // true
 * console.log(isAccount(regularObject)); // false
 */
export const isAccount /*  */ = (account: Record<string, any>) =>
  account.kind === InteractionResolverKind.ACCOUNT

/**
 * Checks if an object is an argument resolver.
 *
 * @param argument The object to check
 * @returns True if the object is an argument resolver, false otherwise
 *
 * @example
 * import { isArgument, arg } from "@onflow/sdk"
 *
 * const argumentResolver = { kind: "ARGUMENT", value: 42 };
 * const regularObject = { value: 42 };
 *
 * console.log(isArgument(argumentResolver)); // true
 * console.log(isArgument(regularObject)); // false
 *
 * // Check arguments in a script
 * const scriptArgs = [arg(10, t.Int), arg("hello", t.String)];
 * scriptArgs.forEach(arg => {
 *   if (isArgument(arg)) {
 *     console.log("Valid argument:", arg.value);
 *   }
 * });
 */
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
  fns: (InteractionBuilderFn | false | MaybePromise<Interaction>)[] = []
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
 * Async pipe function to compose interactions.
 *
 * The pipe function is the foundation for composing multiple interaction builder functions together.
 * It sequentially applies builder functions to an interaction, allowing for complex interaction construction.
 * Each function in the pipe receives the result of the previous function and can modify or validate the interaction.
 *
 * Pipe has two main forms:
 * 1. `pipe(builderFunctions)`: Returns a builder function
 * 2. `pipe(interaction, builderFunctions)`: Directly executes the pipe on an interaction
 *
 * @param fns Array of builder functions to apply
 * @returns An interaction builder function when called with just functions, or a Promise<Interaction> when called with an interaction and functions
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Using pipe to create a reusable builder
 * const myTransactionBuilder = fcl.pipe([
 *   fcl.transaction`
 *     transaction(amount: UFix64) {
 *       prepare(account: AuthAccount) {
 *         log(amount)
 *       }
 *     }
 *   `,
 *   fcl.args([fcl.arg("10.0", fcl.t.UFix64)]),
 *   fcl.proposer(fcl.authz),
 *   fcl.payer(fcl.authz),
 *   fcl.authorizations([fcl.authz]),
 *   fcl.limit(100)
 * ]);
 *
 * // Use the builder
 * const interaction = await fcl.build([myTransactionBuilder]);
 *
 * // Pipe is used internally by build() and send()
 * await fcl.send([
 *   fcl.script`access(all) fun main(): Int { return 42 }`
 * ]); // This uses pipe internally
 */
function pipe(fns: (InteractionBuilderFn | false)[]): InteractionBuilderFn
function pipe(
  ix: MaybePromise<Interaction>,
  fns: (InteractionBuilderFn | false)[]
): Promise<Interaction>
function pipe(
  ...args:
    | [(InteractionBuilderFn | false)[]]
    | [MaybePromise<Interaction>, (InteractionBuilderFn | false)[]]
): Promise<Interaction> | InteractionBuilderFn {
  const [arg1, arg2] = args
  if (isArray(arg1)) return (d: Interaction) => pipe(d, arg1)

  const ix = arg1 as MaybePromise<Interaction>
  const fns = arg2 as ((x: Interaction) => Interaction)[]
  return recPipe(ix, fns)
}
export {pipe}

const identity = <T>(v: T, ..._: any[]) => v

/**
 * Gets a value from an interaction object using a dot-notation key path.
 *
 * @param ix The interaction object
 * @param key The dot-notation key path (e.g., "message.arguments")
 * @param fallback The fallback value if the key is not found
 * @returns The value at the key path or the fallback value
 *
 * @example
 * import { get, put, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 *
 * // Set a value first
 * put("user.name", "Alice")(interaction);
 *
 * // Get the value
 * const userName = get(interaction, "user.name"); // "Alice"
 * const userAge = get(interaction, "user.age", 25); // 25 (fallback)
 *
 * // Get nested values
 * put("config.network.url", "https://access.mainnet.onflow.org")(interaction);
 * const networkUrl = get(interaction, "config.network.url");
 */
export const get = (
  ix: Interaction,
  key: string,
  fallback: any = undefined
) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

/**
 * Sets a value in an interaction object using a dot-notation key path.
 *
 * @param key The dot-notation key path (e.g., "message.arguments")
 * @param value The value to set
 * @returns A function that takes an interaction and sets the value
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { put } from "@onflow/sdk"
 *
 * // Using put in a custom builder function
 * const setCustomData = (data) => put("custom.data", data);
 *
 * await fcl.send([
 *   fcl.script`access(all) fun main(): String { return "Hello" }`,
 *   setCustomData({ userId: 123, timestamp: Date.now() })
 * ]);
 *
 * // Direct usage
 * const interaction = initInteraction();
 * put("network.endpoint", "https://access.mainnet.onflow.org")(interaction);
 */
export const put = (key: string, value: any) => (ix: Interaction) => {
  ix.assigns[key] = value
  return Ok(ix)
}

/**
 * Updates a value in an interaction object using a transformation function.
 *
 * @param key The dot-notation key path to update
 * @param fn The transformation function to apply to the existing value
 * @returns A function that takes an interaction and updates the value
 *
 * @example
 * import { update, put, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 *
 * // Set initial value
 * put("counter", 0)(interaction);
 *
 * // Increment counter
 * const increment = update("counter", (current) => (current || 0) + 1);
 * increment(interaction); // counter becomes 1
 * increment(interaction); // counter becomes 2
 *
 * // Update array
 * put("tags", ["flow", "blockchain"])(interaction);
 * const addTag = update("tags", (tags) => [...(tags || []), "web3"]);
 * addTag(interaction); // tags becomes ["flow", "blockchain", "web3"]
 */
export const update =
  <T>(key: string, fn: (v: T | T[], ...args: any[]) => T | T[] = identity) =>
  (ix: Interaction) => {
    ix.assigns[key] = fn(ix.assigns[key], ix)
    return Ok(ix)
  }

/**
 * Removes a property from an interaction object using a dot-notation key path.
 *
 * @param key The dot-notation key path to remove
 * @returns A function that takes an interaction and removes the property
 *
 * @example
 * import { destroy, put, get, initInteraction } from "@onflow/sdk"
 *
 * const interaction = initInteraction();
 *
 * // Set some values
 * put("user.name", "Alice")(interaction);
 * put("user.email", "alice@example.com")(interaction);
 * put("user.temp", "temporary data")(interaction);
 *
 * console.log(get(interaction, "user.temp")); // "temporary data"
 *
 * // Remove temporary data
 * destroy("user.temp")(interaction);
 *
 * console.log(get(interaction, "user.temp")); // undefined
 * console.log(get(interaction, "user.name")); // "Alice" (still exists)
 */
export const destroy = (key: string) => (ix: Interaction) => {
  delete ix.assigns[key]
  return Ok(ix)
}
