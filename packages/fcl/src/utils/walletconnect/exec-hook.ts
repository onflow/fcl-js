import {execStrategy as _execStrategy, RpcController} from "@onflow/fcl-core"
import {createSessionProposal, FLOW_METHODS, request} from "@onflow/fcl-wc"
import {getSignClient} from "./loader"
import {SessionTypes} from "@walletconnect/types"
import {PROPOSAL_EXPIRY_MESSAGE} from "@walletconnect/sign-client"

const AbortController =
  globalThis.AbortController || require("abort-controller")

// Defines the execStrategy hook for Discovery Service to enable the WalletConnect bypass
export async function execStrategyHook(opts: any) {
  // TODO: Should we check the service type/name here?
  const {body, abortSignal: baseAbortSignal} = opts

  // Create an abort controller for this context
  // Either used to terminate WC bypass proposal loop or the base discovery request
  const abortController = wrapAbortSignal(baseAbortSignal)

  // Create a new session proposal with the WalletConnect client
  const {uri: wcUri, approval} = await refreshingProposal(uri => {
    // Notify the URI change
    console.log("WalletConnect URI:", uri)
  }, abortController.signal)

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

  const rpcController = new RpcController()
  rpcController.onMessage

  const res = await Promise.race([
    // Execute base discovery request
    _execStrategy({
      ...opts,
      config: discoveryConfig,
      // TODO: Combine abort signals?
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

// Continuously refresh the session proposal until it is approved or rejected
export async function refreshingProposal(
  onUriChange: (uri: string) => void,
  abortSignal: AbortSignal
): Promise<{
  uri: string | null
  approval: () => Promise<SessionTypes.Struct>
}> {
  return new Promise(async (resolveOuter, rejectOuter) => {
    // Store the WC URI
    let uri: string | null = null

    // Wrap approval promise
    let resolveApprovedPromise: (value: any) => void
    let rejectApprovedPromise: (reason: any) => void
    let approvedPromise = new Promise<SessionTypes.Struct>(
      (resolve, reject) => {
        resolveApprovedPromise = resolve
        rejectApprovedPromise = reject
      }
    )

    // Create a promise to resolve the WC URI
    const proposalLoop = async () => {
      if (abortSignal.aborted) {
        rejectOuter(new Error("Aborted"))
        rejectApprovedPromise(new Error("Aborted"))
        return
      }

      const {uri: _uri, approval: localApproval} = await createSessionProposal({
        client: await getSignClient(),
      })

      // Update the URI
      uri = _uri
      onUriChange(uri)

      // If this is the first proposal, resolve the outer promise since we have the URI
      if (uri == null) {
        resolveOuter({uri, approval: async () => approvedPromise})
      }

      try {
        const session = await localApproval()
        resolveApprovedPromise(session)
      } catch (e) {
        if ((e as any)?.message === PROPOSAL_EXPIRY_MESSAGE) {
          // If the proposal has expired, create a new one
          return proposalLoop()
        }
        rejectApprovedPromise(e)
      }
    }
    await proposalLoop()
  })
}

export function wrapAbortSignal(signal: AbortSignal) {
  const controller = new AbortController()
  if (signal.aborted) controller.abort()
  signal.addEventListener("abort", () => controller.abort())
  return controller
}
