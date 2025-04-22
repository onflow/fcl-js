import {config} from "@onflow/config"
import {Buffer} from "@onflow/rlp"
import {send as defaultSend} from "@onflow/transport-http"
import {invariant} from "../build/build-invariant.js"
import * as ixModule from "../interaction/interaction"
import {initInteraction, pipe} from "../interaction/interaction"
import {resolve as defaultResolve} from "../resolve/resolve.js"
import {response} from "../response/response"
import {Interaction} from "@onflow/typedefs"

interface SendOptions {
  send?: typeof defaultSend
  resolve?: typeof defaultResolve
  node?: string
}

/**
 * @description - Sends arbitrary scripts, transactions, and requests to Flow
 * @param args - An array of functions that take interaction and return interaction
 * @param opts - Optional parameters
 * @returns - A promise that resolves to a response
 */
export const send = async (
  args:
    | (((x: Interaction) => Interaction) | false)[]
    | ((x: Interaction) => Interaction)
    | false,
  opts: SendOptions = {}
): Promise<any> => {
  const sendFn = await config.first(
    ["sdk.transport", "sdk.send"],
    opts.send || defaultSend
  )

  invariant(
    sendFn,
    `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
  )

  const resolveFn: any = await config.first(
    ["sdk.resolve"],
    opts.resolve || defaultResolve
  )

  opts.node = opts.node || (await config().get("accessNode.api"))

  if (Array.isArray(args)) args = pipe(initInteraction(), args as any) as any
  return sendFn(
    await resolveFn(args),
    {config, response, ix: ixModule, Buffer} as any,
    opts
  )
}
