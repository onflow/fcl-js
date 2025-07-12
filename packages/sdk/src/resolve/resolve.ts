import {pipe, isTransaction} from "../interaction/interaction"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
import {send as defaultSend} from "@onflow/transport-http"
import * as ixModule from "../interaction/interaction"
import {response} from "../response/response"
import {build} from "../build/build"
import {getBlock} from "../build/build-get-block"
import {getAccount} from "../build/build-get-account"
import {decodeResponse as decode} from "../decode/decode"
import {Interaction} from "@onflow/typedefs"

import {resolveCadence} from "./resolve-cadence"
import {resolveArguments} from "./resolve-arguments"
import {resolveAccounts} from "./resolve-accounts"
import {resolveSignatures} from "./resolve-signatures"
import {resolveValidators} from "./resolve-validators"
import {resolveFinalNormalization} from "./resolve-final-normalization"
import {resolveVoucherIntercept} from "./resolve-voucher-intercept"
import {resolveComputeLimit} from "./resolve-compute-limit"

type DebugCallback = (ix: Interaction, log: any, accts?: any) => any

const noop = (v: any) => v
const debug =
  (key: string, fn: DebugCallback = noop) =>
  async (ix: Interaction): Promise<Interaction> => {
    const take = (obj: any, keys: string | string[] = []) => {
      if (typeof keys === "string") keys = keys.split(" ")
      keys.reduce((acc, key) => ({...acc, [key]: obj[key]}), {})
    }

    const accts = (ix: Interaction) =>
      [
        "\nAccounts:",
        {
          proposer: ix.proposer,
          authorizations: ix.authorizations,
          payer: ix.payer,
        },
        "\n\nDetails:",
        ix.accounts,
      ].filter(Boolean)

    const log = (...msg: any[]) => {
      console.log(`debug[${key}] ---\n`, ...msg, "\n\n\n---")
    }

    if (await config.get(`debug.${key}`)) await fn(ix, log, accts)
    return ix
  }

/**
 * Resolves an interaction by applying a series of resolvers in sequence.
 *
 * This is the main resolver function that takes a built interaction and prepares it
 * for submission to the Flow blockchain by applying all necessary resolvers.
 *
 * The resolve function uses a pipeline approach, applying each resolver in sequence
 * to transform the interaction from its initial built state to a fully resolved state
 * ready for transmission to the Flow Access API.
 *
 * @param interaction The interaction object to resolve
 * @returns A promise that resolves to the fully resolved interaction
 * @example
 * import { resolve, build, script } from "@onflow/sdk"
 *
 * const interaction = await build([
 *   script`
 *     access(all) fun main(): String {
 *       return "Hello, World!"
 *     }
 *   `
 * ])
 *
 * const resolved = await resolve(interaction)
 */
export const resolve = pipe([
  resolveCadence,
  debug("cadence", (ix: Interaction, log: any) => log(ix.message.cadence)),
  resolveComputeLimit,
  debug("compute limit", (ix: Interaction, log: any) =>
    log(ix.message.computeLimit)
  ),
  resolveArguments,
  debug("arguments", (ix: Interaction, log: any) =>
    log(ix.message.arguments, ix.message)
  ),
  resolveAccounts,
  debug("accounts", (ix: Interaction, log: any, accts: any) =>
    log(...accts(ix))
  ),
  /* special */ execFetchRef,
  /* special */ execFetchSequenceNumber,
  resolveSignatures,
  debug("signatures", (ix: Interaction, log: any, accts: any) =>
    log(...accts(ix))
  ),
  resolveFinalNormalization,
  resolveValidators,
  resolveVoucherIntercept,
  debug("resolved", (ix: Interaction, log: any) => log(ix)),
])

async function execFetchRef(ix: Interaction): Promise<Interaction> {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    const node = await config().get("accessNode.api")
    const sendFn: any = await config.first(
      ["sdk.transport", "sdk.send"],
      defaultSend
    )

    invariant(
      sendFn,
      `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
    )

    ix.message.refBlock = (
      await sendFn(
        build([getBlock()]),
        {config, response, Buffer, ix: ixModule},
        {node}
      ).then(decode)
    ).id
  }
  return ix
}

async function execFetchSequenceNumber(ix: Interaction): Promise<Interaction> {
  if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find((a: any) => a.role.proposer)
    invariant(acct !== undefined, `Transactions require a proposer`)
    if (acct && acct.sequenceNum == null) {
      const node = await config().get("accessNode.api")
      const sendFn: any = await config.first(
        ["sdk.transport", "sdk.send"],
        defaultSend
      )

      invariant(
        sendFn,
        `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
      )

      ix.accounts[acct.tempId].sequenceNum = await sendFn(
        await build([getAccount(acct.addr!)]),
        {config, response, Buffer, ix: ixModule},
        {node}
      )
        .then(decode)
        .then((acctResponse: any) => acctResponse.keys)
        .then((keys: any) => keys.find((key: any) => key.index === acct!.keyId))
        .then((key: any) => key.sequenceNumber)
    }
  }
  return ix
}
