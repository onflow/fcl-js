import {
  execService as _execService,
  execStrategy as _execStrategy,
} from "@onflow/fcl-core"
import {createSessionProposal, FLOW_METHODS, request} from "@onflow/fcl-wc"
import {getSignClient} from "./loader"

const AbortController =
  globalThis.AbortController || require("abort-controller")

// Defines the execStrategy hook for Discovery Service to enable the WalletConnect bypass
export async function execStrategyHook(opts: any) {
  // TODO: Should we check the service type/name here?
  const {body, abortSignal: baseAbortSignal} = opts

  // Generate a WC URI for discovery config
  const {uri: wcUri, approval} = await createSessionProposal({
    client: await getSignClient(),
  })

  // Add WC URI to discovery config
  const discoveryConfig = {
    ...opts.config,
    client: {
      ...opts.config.client,
      walletconnect: {
        uri: wcUri,
      },
    },
  }

  // Create an abort controller to terminate the base discovery request
  // If WC bypass is successful
  const abortController = wrapAbortSignal(baseAbortSignal)

  const res = await Promise.race([
    // Execute base discovery request
    _execStrategy({
      ...opts,
      config: discoveryConfig,
      abortSignal: abortController.signal,
    }),
    // Execute WC bypass
    (async () =>
      request({
        method: FLOW_METHODS.FLOW_AUTHN,
        body,
        session: await approval(),
        client: await getSignClient(),
        cleanup: () => {},
      }))(),
  ]).finally(() => {
    // Teardown
    abortController.abort()
  })

  return res
}

export function wrapAbortSignal(signal: AbortSignal) {
  const controller = new AbortController()
  if (signal.aborted) controller.abort()
  signal.addEventListener("abort", () => controller.abort())
  return controller
}
