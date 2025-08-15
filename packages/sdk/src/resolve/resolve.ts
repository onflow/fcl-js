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

import {createResolveCadence} from "./resolve-cadence"
import {resolveArguments} from "./resolve-arguments"
import {resolveAccounts} from "./resolve-accounts"
import {resolveSignatures} from "./resolve-signatures"
import {resolveValidators} from "./resolve-validators"
import {resolveFinalNormalization} from "./resolve-final-normalization"
import {resolveVoucherIntercept} from "./resolve-voucher-intercept"
import {createResolveComputeLimit} from "./resolve-compute-limit"
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

export function createResolve(context: SdkContext) {
  const resolve = async (ix: Interaction) =>
    pipe([
      createResolveCadence(context),
      debug("cadence", (ix: Interaction, log: any) => log(ix.message.cadence)),
      createResolveComputeLimit(context),
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
      /* special */ createExecFetchRef(context),
      /* special */ createExecFetchSequenceNumber(context),
      resolveSignatures,
      debug("signatures", (ix: Interaction, log: any, accts: any) =>
        log(...accts(ix))
      ),
      resolveFinalNormalization,
      resolveValidators,
      resolveVoucherIntercept,
      debug("resolved", (ix: Interaction, log: any) => log(ix)),
    ])(ix)

  return resolve
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
export const resolve = /* @__PURE__ */ withGlobalContext(createResolve)

function createExecFetchRef(context: SdkContext) {
  return async function execFetchRef(ix: Interaction): Promise<Interaction> {
    if (isTransaction(ix) && ix.message.refBlock == null) {
      const sendFn = context.transport.send

      ix.message.refBlock = (
        await sendFn(
          build([getBlock()]),
          {response, Buffer, ix: ixModule} as any,
          {
            get node() {
              return context.accessNodeUrl
            },
          }
        ).then(decode)
      ).id
    }
    return ix
  }
}

function createExecFetchSequenceNumber(context: SdkContext) {
  return async function execFetchSequenceNumber(
    ix: Interaction
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
              return context.accessNodeUrl
            },
          }
        )
          .then(decode)
          .then((acctResponse: any) => acctResponse.keys)
          .then((keys: any) =>
            keys.find((key: any) => key.index === acct!.keyId)
          )
          .then((key: any) => key.sequenceNumber)
      }
    }
    return ix
  }
}
