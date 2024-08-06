import {execStrategy, normalizePollingResponse} from "@onflow/fcl-core"
import {
  createSessionProposal,
  FLOW_METHODS,
  request as requestWc,
} from "@onflow/fcl-wc"
import {getSignClient} from "../utils/walletconnect/loader"
import {PROPOSAL_EXPIRY_MESSAGE} from "@walletconnect/sign-client"
import {
  createTimeoutPromise,
  dynamicRace,
  wrapAbortSignal,
} from "../utils/utils"
import {
  DiscoveryRpc,
  DiscoveryRpcMethod,
  FclRpcMethod,
  initDiscoveryRpcClient,
} from "./discovery-rpc"
import {Service} from "@onflow/typedefs"

// TODO: necessary?
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

  // Execute all authentication requests in parallel
  const {result, addCandidate: addAuthnCandidate} = dynamicRace(abortController)

  // Initialize the discovery RPC client
  const {ipcController} = initDiscoveryRpcClient(rpc => {
    // Handle QR URI requests
    rpc.on(
      FclRpcMethod.REQUEST_URI,
      makeRequestUriHandler({addAuthnCandidate, rpc, authnBody: body})
    )

    // Handle service execution requests
    rpc.on(
      FclRpcMethod.EXEC_SERVICE,
      makeExecServiceHandler({
        addAuthnCandidate,
        execStrategyOpts: opts,
        execStrategyArgs: args,
        abortController,
        ipcController,
      })
    )
  })

  // Update the discovery config to enable RPC support
  const discoveryConfig = {
    ...opts.config,
    client: {
      ...opts.config.client,
      discoveryRpcEnabled: true,
    },
  }

  // Execute base discovery request
  addAuthnCandidate(
    (execStrategy as any)(
      {
        ...opts,
        config: discoveryConfig,
        // TODO: Combine abort signals?
        abortSignal: abortController.signal,
        ipcController,
      },
      // Pass the rest of the arguments (protect against future changes)
      ...args.slice(1)
    )
  )

  // Timeout
  addAuthnCandidate(createTimeoutPromise(DISCOVERY_TIMEOUT))

  // Ensure the abort signal is propagated to all candidates on completion
  result.finally(() => {
    abortController.abort()
  })

  return result
}

// RPC handler for handling QR URI requests (e.g WalletConnect)
const makeRequestUriHandler =
  ({
    rpc,
    addAuthnCandidate,
    authnBody,
  }: {
    rpc: DiscoveryRpc
    addAuthnCandidate: (candidate: Promise<any>) => void
    authnBody: any
  }) =>
  // Service is not used for now, but de-risks from WalletConnect & allows custom QR implementations
  async ({service: _}: {service: Service}) => {
    const client = await getSignClient()

    // Execute WC bypass if session is approved
    // TODO: what is correct decline behaviour?
    const {uri, approval} = await createSessionProposal({
      client,
    })

    // Add the WC bypass request to the authn candidates if session is approved
    approval()
      .then(session => {
        addAuthnCandidate(
          requestWc({
            method: FLOW_METHODS.FLOW_AUTHN,
            body: authnBody,
            session,
            client,
            cleanup: () => {},
          })
        )
      })
      .catch(e => {
        // TODO: should we just catch all errors?
        if ((e as any)?.message === PROPOSAL_EXPIRY_MESSAGE) {
          rpc.notify(DiscoveryRpcMethod.NOTIFY_QR_EXPIRY, {uri})
          return
        } else {
          rpc.notify(DiscoveryRpcMethod.NOTIFY_QR_ERROR, {error: e.message})
          console.error(e)
        }
      })

    return {uri}
  }

// RPC handler for handling service execution requests (e.g extension service)
const makeExecServiceHandler =
  ({
    addAuthnCandidate,
    execStrategyOpts,
    execStrategyArgs,
    abortController,
    ipcController,
  }: {
    addAuthnCandidate: (candidate: Promise<any>) => void
    execStrategyOpts: any
    execStrategyArgs: any
    abortController: AbortController
    ipcController: any
  }) =>
  async ({service}: {service: Service}) => {
    return new Promise(async (resolveRpc, rejectRpc) => {
      const execPromise: Promise<any> = (execStrategy as any)(
        {
          ...execStrategyOpts,
          service,
          // TODO: Ideally we shouldn't be using this config, but maybe not worth the effort to refactor
          config: execStrategyOpts.config,
          // TODO: Combine abort signals?
          abortSignal: abortController.signal,
          ipcController,
        },
        // Pass the rest of the arguments (protect against future changes)
        ...execStrategyArgs.slice(1)
      )

      addAuthnCandidate(
        new Promise(async resolveCandidate => {
          const result = await execPromise
          const normalizedResult = normalizePollingResponse(result)
          if (normalizedResult?.status === "APPROVED") {
            resolveCandidate(result)
            resolveRpc({})
          } else {
            // Notify Discovery that the service was rejected
            rejectRpc(
              new Error(normalizedResult?.reason || "Service was declined")
            )
          }
        })
      )
    })
  }
