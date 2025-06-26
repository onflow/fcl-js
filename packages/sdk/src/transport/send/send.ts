import {Buffer} from "@onflow/rlp"
import {initInteraction, pipe} from "../../interaction/interaction"
import * as ixModule from "../../interaction/interaction"
import {response} from "../../response/response"
import {resolve as defaultResolve} from "../../resolve/resolve"
import {SdkContext} from "../../context/context"
import {invariant} from "@onflow/util-invariant"
import {withGlobalContext} from "../../context/global"

export function createSend(context: SdkContext) {
  /**
   * @description Sends arbitrary scripts, transactions, and requests to Flow
   * @param args An array of functions that take interaction and return interaction
   * @param opts Optional parameters
   * @returns A promise that resolves to a response
   */
  async function send(
    args: (Function | false) | (Function | false)[] = [],
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

    if (Array.isArray(args)) args = pipe(initInteraction(), args as any) as any
    return sendFn(
      await resolveFn(args),
      // TODO(jribbink): FIX any type here
      {response, ix: ixModule, Buffer} as any,
      opts
    )
  }

  return send
}

/* @__PURE__ */
export const send = withGlobalContext(createSend)
