import {Buffer} from "@onflow/rlp"
import {initInteraction, pipe} from "../../interaction/interaction"
import * as ixModule from "../../interaction/interaction"
import {invariant} from "../../build/build-invariant"
import {response} from "../../response/response"
import {config} from "@onflow/config"
import {resolve as defaultResolve} from "../../resolve/resolve"
import {getTransport} from "../get-transport"

/**
 * Sends arbitrary scripts, transactions, and requests to Flow.
 *
 * This method consumes an array of functions that are to be resolved and sent. The functions required to be included in the array depend on the interaction that is being built.
 *
 * Must be used in conjunction with 'fcl.decode(response)' to get back correct keys and all values in JSON.
 *
 * @param args An array of functions that take an interaction object and return a new interaction object
 * @param opts Additional optional options for the request
 * @returns A promise that resolves to a response
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // a script only needs to resolve the arguments to the script
 * const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
 * // note: response values are encoded, call await fcl.decode(response) to get JSON
 *
 * // a transaction requires multiple 'builders' that need to be resolved prior to being sent to the chain - such as setting the authorizations.
 * const response = await fcl.send([
 *   fcl.transaction`
 *     ${transaction}
 *   `,
 *   fcl.args(args),
 *   fcl.proposer(proposer),
 *   fcl.authorizations(authorizations),
 *   fcl.payer(payer),
 *   fcl.limit(9999)
 * ]);
 * // note: response contains several values
 */
export const send = async (
  args: (Function | false) | (Function | false)[] = [],
  opts: any = {}
): Promise<any> => {
  const transport = await getTransport(opts)
  const sendFn = transport.send.bind(transport)
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
