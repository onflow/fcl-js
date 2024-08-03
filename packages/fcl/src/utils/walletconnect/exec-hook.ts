import {
  execService as _execService,
  execStrategy as _execStrategy,
} from "@onflow/fcl-core"
import {createSessionProposal, FLOW_METHODS, request} from "@onflow/fcl-wc"
import {getSignClient} from "./loader"

const AbortController =
  globalThis.AbortController || require("abort-controller")

export async function execStrategyHook(cfg: any) {
  // TODO: Should we check the service type/name here?
  const {body, abortSignal: baseAbortSignal} = cfg

  // Generate a WC URI for discovery config
  const {uri: walletConnectUri, approval} = await createSessionProposal({
    client: await getSignClient(),
  })

  // Add WC URI to discovery config
  const discoveryConfig = {
    ...cfg,
    client: {
      ...cfg.client,
      walletConnect: {
        uri: walletConnectUri,
      },
    },
  }

  // Create an abort controller to terminate the base discovery request
  // If WC bypass is successful
  const abortController = wrapAbortSignal(baseAbortSignal)

  const res = await Promise.race([
    // Execute base discovery request
    _execStrategy({
      ...cfg,
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
  ])

  // Abort the other request
  abortController.abort()

  return res
}

export function wrapAbortSignal(signal: AbortSignal) {
  const controller = new AbortController()
  if (signal.aborted) controller.abort()
  signal.addEventListener("abort", () => controller.abort())
  return controller
}
