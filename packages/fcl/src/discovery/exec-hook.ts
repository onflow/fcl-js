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
  DiscoveryNotification,
  DiscoveryNotifications,
  DiscoveryRpc,
  FclRequest,
} from "./rpc"
import {Service} from "@onflow/typedefs"
import {RpcClient, RpcError, RpcErrorCode} from "@onflow/util-rpc"

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
  const rpc = new RpcClient<{}, DiscoveryNotifications>({
    notifications: [],
  })
  rpc.on(
    FclRequest.REQUEST_QRCODE,
    makeRequestUriHandler({
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
        // TODO: Combine abort signals?
        abortSignal: abortController.signal,
        customRpc: rpc,
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
// Open-ended implementation for future compatibility with other QR methods
// e.g. `authn-qrcode` Service type in future could be used for custom QR implementations
const makeRequestUriHandler =
  ({
    addAuthnCandidate,
    authnBody,
  }: {
    addAuthnCandidate: (candidate: Promise<any>) => void
    authnBody: any
  }) =>
  // Service is not used for now, but de-risks from WalletConnect & allows custom QR implementations
  async (rpc: DiscoveryRpc, {service}: {service: Service}) => {
    if (service.type !== "authn") {
      throw new RpcError(RpcErrorCode.INVALID_PARAMS, "Invalid service type", {
        type: service.type,
      })
    }

    if (service.method !== "WC/RPC") {
      throw new RpcError(
        RpcErrorCode.INVALID_PARAMS,
        "Invalid service method",
        {
          method: service.method,
        }
      )
    }

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
          // TODO: Ideally we shouldn't be using this config, but maybe not worth the effort to refactor
          config: execStrategyOpts.config,
          // TODO: Combine abort signals?
          abortSignal: abortController.signal,
        },
        // Pass the rest of the arguments (protect against future changes)
        ...execStrategyArgs.slice(1)
      )

      addAuthnCandidate(
        new Promise(async resolveCandidate => {
          try {
            const result = await execPromise
            const status =
              normalizePollingResponse(result)?.status || "APPROVED"
            if (status === "APPROVED") {
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
