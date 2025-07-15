import {Buffer} from "@onflow/rlp"
import {initInteraction, pipe} from "../../interaction/interaction"
import * as ixModule from "../../interaction/interaction"
import {InteractionBuilderFn} from "../../interaction/interaction"
import {response} from "../../response/response"
import {resolve as defaultResolve} from "../../resolve/resolve"
import {SdkContext} from "../../context/context"
import {invariant} from "@onflow/util-invariant"
import {withGlobalContext} from "../../context/global"

export function createSend(context: SdkContext) {
  /**
   * Sends arbitrary scripts, transactions, and requests to Flow.
   *
   * This method consumes an array of builders that are to be resolved and sent. The builders required to be included in the array depend on the interaction that is being built.
   *
   * WARNING: Must be used in conjunction with 'fcl.decode(response)' to get back correct keys and all values in JSON.
   *
   * @param args An array of builders (functions that take an interaction object and return a new interaction object)
   * @param opts Additional optional options for the request
   * @param opts.node Custom node endpoint to use for this request
   * @param opts.resolve Custom resolve function to use for processing the interaction
   * @returns A promise that resolves to a ResponseObject containing the data returned from the chain. Should always be decoded with fcl.decode() to get back appropriate JSON keys and values.
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
  async function send(
    args:
      | (InteractionBuilderFn | false)
      | (InteractionBuilderFn | false)[] = [],
    opts: any = {}
  ): Promise<any> {
    const transport = opts.transport || context.transport
    const sendFn = transport.send?.bind?.(transport)
    invariant(
      !!sendFn,
      `Required value for sdk.transport is not defined in config. See: ${"https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21"}`
    )

    const resolveFn = context.customResolver || opts.resolve || defaultResolve

    opts.node = opts.node || context.accessNode

    if (Array.isArray(args)) args = pipe(initInteraction(), args) as any
    return sendFn(await resolveFn(args), {response, ix: ixModule, Buffer}, opts)
  }

  return send
}

export const send = /* @__PURE__ */ withGlobalContext(createSend)
