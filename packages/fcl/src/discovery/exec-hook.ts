import {execStrategy} from "@onflow/fcl-core"
import {dynamicRace, wrapAbortSignal} from "../utils/async"
import {createDiscoveryRpcClient} from "./rpc/client"

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
  const {result: _result, addCandidate: addAuthnCandidate} = dynamicRace()

  // Initialize the discovery RPC client
  const rpc = createDiscoveryRpcClient({
    onExecResult: addAuthnCandidate,
    body,
    opts,
    args,
    abortSignal: abortController.signal,
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
  const discoveryPromise = (execStrategy as any)(
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
  addAuthnCandidate(discoveryPromise)

  // Wrap the result promise to ensure cleanup on completion
  const result = new Promise((resolve, reject) => {
    _result.finally(async () => {
      // Give Discovery a chance to cleanup
      await Promise.race([
        new Promise(resolve => setTimeout(resolve, 1000)),
        discoveryPromise,
      ]).catch(() => {})

      // Ensure the abort signal is propagated to all candidates on completion
      abortController.abort()

      _result.then(resolve, reject)
    })
  })

  return result
}
