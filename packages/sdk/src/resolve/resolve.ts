import {pipe, isTransaction} from "../interaction/interaction"
import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {Buffer} from "@onflow/rlp"
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
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"

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
 * Binds a given context to a two-argument handler,
 * returning a unary function that only needs an Interaction.
 */
export function applyContext(
  handler: (ix: Interaction, context: SdkContext) => Promise<Interaction>,
  context: SdkContext
): (ix: Interaction) => Promise<Interaction> {
  return ix => handler(ix, context)
}

/**
 * Resolves an interaction by applying a series of context-bound handlers
 */
export function createResolve(context: SdkContext) {
  const resolve = pipe(
    [
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
    ].map(handler => applyContext(handler, context))
  )

  return resolve
}

export const resolve = withGlobalContext(createResolve)

async function execFetchRef(
  ix: Interaction,
  context: SdkContext
): Promise<Interaction> {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    const sendFn = context.transport.send

    ix.message.refBlock = (
      await sendFn(
        build([getBlock()]),
        // TODO(jribbink): FIX any type here
        {response, Buffer, ix: ixModule} as any,
        {
          get node() {
            return context.accessNode
          },
        }
      ).then(decode)
    ).id
  }
  return ix
}

async function execFetchSequenceNumber(
  ix: Interaction,
  context: SdkContext
): Promise<Interaction> {
  if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find((a: any) => a.role.proposer)
    invariant(acct !== undefined, `Transactions require a proposer`)
    if (acct && acct.sequenceNum == null) {
      const sendFn = context.transport.send

      ix.accounts[acct.tempId].sequenceNum = await sendFn(
        await build([getAccount(acct.addr!)]),
        {response, Buffer, ix: ixModule} as any,
        {
          get node() {
            return context.accessNode
          },
        }
      )
        .then(decode)
        .then((acctResponse: any) => acctResponse.keys)
        .then((keys: any) => keys.find((key: any) => key.index === acct!.keyId))
        .then((key: any) => key.sequenceNumber)
    }
  }
  return ix
}
