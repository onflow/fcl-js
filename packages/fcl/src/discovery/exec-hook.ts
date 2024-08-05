import {execStrategy} from "@onflow/fcl-core"
import {createSessionProposal, FLOW_METHODS, request} from "@onflow/fcl-wc"
import {getSignClient} from "../utils/walletconnect/loader"
import {SessionTypes} from "@walletconnect/types"
import {PROPOSAL_EXPIRY_MESSAGE} from "@walletconnect/sign-client"
import {
  createTimeoutPromise,
  dynamicRace,
  wrapAbortSignal,
} from "../utils/utils"
import {DiscoveryRpc} from "./discovery-rpc"

const DISCOVERY_TIMEOUT = 3600 * 1000 // 1 hour

const AbortController =
  globalThis.AbortController || require("abort-controller")

// Defines the execStrategy hook for Discovery Service to enable the WalletConnect bypass
export async function execStrategyHook(...args: any) {
  // TODO: Should we check the service type/name here?
  const [opts] = args
  const {body, abortSignal: baseAbortSignal} = opts

  // Create an abort controller for this context
  // Either used to terminate WC bypass proposal loop or the base discovery request
  const abortController = wrapAbortSignal(baseAbortSignal)
  const discovery = new DiscoveryRpc()

  // Create a new session proposal with the WalletConnect client
  // Wait for the first URI to continue
  const {uri: wcUri, session} = await new Promise<{
    uri: string
    session: Promise<SessionTypes.Struct>
  }>((resolve, reject) => {
    let _session = revolvingProposal(uri => {
      // Capture the first
      resolve({uri, session: _session})

      // Notify the URI change
      discovery.updateWalletConnectUri(uri)
    }, abortController.signal)

    // If we reject before getting a URI, we throw
    _session.catch(reject)

    return _session
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

  // Execute all authentication requests in parallel
  const {result, addCandidate: addAuthnCandidate} = dynamicRace(abortController)

  // Execute base discovery request
  addAuthnCandidate(
    (execStrategy as any)(
      {
        ...opts,
        config: discoveryConfig,
        // TODO: Combine abort signals?
        abortSignal: abortController.signal,
        ipcController: discovery.ipcController,
      },
      // Pass the rest of the arguments (protect against future changes)
      ...args.slice(1)
    )
  )

  // Execute WC bypass if session is approved
  // TODO: what is correct decline behaviour?
  session.then(session => {
    addAuthnCandidate(
      (async () =>
        request({
          method: FLOW_METHODS.FLOW_AUTHN,
          body,
          session,
          client: await getSignClient(),
          cleanup: () => {},
        }))()
    )
  })

  // Add a bypass for services Discovery requests to execute in parallel
  // (e.g. extension services)
  discovery.onExecService(service => {
    addAuthnCandidate(
      (execStrategy as any)(
        {
          ...opts,
          service,
          // TODO: Ideally we shouldn't be using this config, but maybe not worth the effort to refactor
          config: opts.config,
          // TODO: Combine abort signals?
          abortSignal: abortController.signal,
          ipcController: discovery.ipcController,
        },
        // Pass the rest of the arguments (protect against future changes)
        ...args.slice(1)
      )
    )
  })

  // Timeout
  addAuthnCandidate(createTimeoutPromise(DISCOVERY_TIMEOUT))

  // Ensure the abort signal is propagated to all candidates on completion
  result.finally(() => {
    abortController.abort()
  })

  return result
}

// Continuously refresh the session proposal until it is approved or rejected
function revolvingProposal(
  onUriChange: (uri: string) => void,
  abortSignal: AbortSignal
) {
  return new Promise<SessionTypes.Struct>((resolve, reject) => {
    // Create a promise to resolve the WC URI
    const proposalLoop = async (): Promise<void> => {
      if (abortSignal.aborted) {
        reject(new Error(abortSignal.reason || "Aborted"))
        return
      }

      const {uri, approval: localApproval} = await createSessionProposal({
        client: await getSignClient(),
      })
      onUriChange(uri)

      try {
        const session = await localApproval()
        resolve(session)
      } catch (e) {
        // TODO: should we just catch all errors?
        if ((e as any)?.message === PROPOSAL_EXPIRY_MESSAGE) {
          // If the proposal has expired, create a new one
          return proposalLoop()
        }
        reject(e)
      }
    }
    proposalLoop()
  })
}
