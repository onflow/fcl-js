import {execStrategy, normalizePollingResponse} from "@onflow/fcl-core"
import {
  createSessionProposal,
  FLOW_METHODS,
  request as requestWc,
  getSignClient,
} from "@onflow/fcl-wc"
import {PROPOSAL_EXPIRY_MESSAGE} from "@walletconnect/sign-client"
import {dynamicRace, wrapAbortSignal} from "../utils/async"
import {
  DiscoveryNotification,
  DiscoveryNotifications,
  DiscoveryRpc,
  FclRequest,
} from "./rpc"
import {Service} from "@onflow/typedefs"
import {RpcClient} from "@onflow/util-rpc"

const APPROVED = "APPROVED"
const AUTHN_SERVICE_TYPE = "authn"

// Defines the execStrategy hook for Discovery Service to enable the WalletConnect bypass
export async function execStrategyHook(...args: any) {
  const [opts] = args
  const {body, abortSignal: baseAbortSignal, service} = opts

  // Ensure the service type is "auth" for the execStrategyHook
  if (service?.type !== AUTHN_SERVICE_TYPE) {
    console.error(
      `ERROR: Invalid service type for FCL Discovery execStrategyHook, expected "${AUTHN_SERVICE_TYPE}" but got "${service?.type}"`
    )
    return (execStrategy as any)(...args)
  }

  // Create an abort controller for this context
  // Either used to terminate WC bypass proposal loop or the base discovery request
  const abortController = wrapAbortSignal(baseAbortSignal)

  // Execute all authentication requests in parallel
  const {result, addCandidate: addAuthnCandidate} = dynamicRace(abortController)

  // Initialize the discovery RPC client
  const rpc = new RpcClient<{}, DiscoveryNotifications>({
    notifications: [],
  })
  rpc.on(
    FclRequest.REQUEST_WALLETCONNECT_QRCODE,
    makeRequestWcQRHandler({
      addAuthnCandidate,
      authnBody: body,
    })
  )
  rpc.on(
    FclRequest.EXEC_SERVICE,
    makeExecServiceHandler({
      addAuthnCandidate,
      execStrategyOpts: opts,
      execStrategyArgs: args,
      abortController,
    })
  )

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
        abortSignal: abortController.signal,
        // Pass the custom RPC client to the execStrategy
        // Select only the relevant interface to prevent accidental coupling in the future
        customRpc: {
          connect: rpc.connect.bind(rpc),
          receive: rpc.receive.bind(rpc),
        },
      },
      // Pass the rest of the arguments (protect against future changes)
      ...args.slice(1)
    )
  )

  // Ensure the abort signal is propagated to all candidates on completion
  result.finally(() => {
    abortController.abort()
  })

  return result
}

// RPC handler for handling WalletConnect QR code requests
// Adds another authentication candidate to the authn race for the WC bypass
const makeRequestWcQRHandler =
  ({
    addAuthnCandidate,
    authnBody,
  }: {
    addAuthnCandidate: (candidate: Promise<any>) => void
    authnBody: any
  }) =>
  // Service is not used for now, but de-risks from WalletConnect & allows custom QR implementations
  async (rpc: DiscoveryRpc) => {
    const client = await getSignClient()

    // Execute WC bypass if session is approved
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
          })
        )
      })
      .catch(e => {
        if ((e as any)?.message === PROPOSAL_EXPIRY_MESSAGE) {
          rpc.notify(DiscoveryNotification.NOTIFY_QRCODE_EXPIRY, {uri})
          return
        } else {
          rpc.notify(DiscoveryNotification.NOTIFY_QRCODE_ERROR, {
            error: e.message,
          })
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
  }: {
    addAuthnCandidate: (candidate: Promise<any>) => void
    execStrategyOpts: any
    execStrategyArgs: any
    abortController: AbortController
  }) =>
  async (_: DiscoveryRpc, {service}: {service: Service}) => {
    return new Promise(async (resolveRpc, rejectRpc) => {
      const execPromise: Promise<any> = (execStrategy as any)(
        {
          ...execStrategyOpts,
          service,
          config: execStrategyOpts.config,
          abortSignal: abortController.signal,
        },
        // Pass the rest of the arguments (protect against future changes)
        ...execStrategyArgs.slice(1)
      )

      addAuthnCandidate(
        new Promise(async resolveCandidate => {
          try {
            const result = await execPromise
            const status = normalizePollingResponse(result)?.status || APPROVED
            if (status === APPROVED) {
              resolveCandidate(result)
              resolveRpc({})
            } else {
              // Notify Discovery that the service was rejected
              rejectRpc(new Error(result?.reason || "Service was declined"))
            }
          } catch (e: any) {
            rejectRpc(new Error(e?.message || "Service execution failed"))
          }
        })
      )
    })
  }
