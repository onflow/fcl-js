import {Buffer} from "@onflow/rlp"
import {initInteraction, pipe} from "../interaction/interaction"
import * as ixModule from "../interaction/interaction"
import {invariant} from "../build/build-invariant"
import {response} from "../response/response"
import {config} from "@onflow/config"
import {resolve as defaultResolve} from "../resolve/resolve"
import {getTransport} from "./transport"

/**
 * @description - Sends arbitrary scripts, transactions, and requests to Flow
 * @param args - An array of functions that take interaction and return interaction
 * @param opts - Optional parameters
 * @returns - A promise that resolves to a response
 */
export const send = async (
  args: Function | Function[] = [],
  opts: any = {}
): Promise<any> => {
  const {send: sendFn} = await getTransport(opts)

  invariant(
    sendFn,
    `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
  )

  const resolveFn = await config.first(
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
