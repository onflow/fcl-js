import {execStrategy} from "@onflow/fcl-core"
import {wrapAbortSignal} from "../utils/async"
import {createDiscoveryRpcClient} from "./rpc/client"
import {execDiscovery} from "./exec-discovery"

const AUTHN_SERVICE_TYPE = "authn"

// Defines the execStrategy hook for Discovery Service
// Used to define custom service execution rules for the Discovery Service
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

  let discoveryPromise: Promise<any> | undefined
  const resultPromise = new Promise(async (resolve, reject) => {
    // Initialize the discovery RPC client
    const rpc = createDiscoveryRpcClient({
      onExecResult: resolve,
      body,
      opts,
      args,
      abortSignal: abortController.signal,
    })

    // Execute the base discovery request
    discoveryPromise = execDiscovery({
      customRpc: rpc,
      opts,
      args,
      abortSignal: abortController.signal,
    }).then(resolve, reject)
  })

  // Wait for the result promise to resolve or reject
  await resultPromise.catch(() => {})

  // Give Discovery time to cleanup
  await Promise.race([
    new Promise(resolve => setTimeout(resolve, 1000)),
    discoveryPromise,
  ]).catch(() => {})

  // Ensure the abort signal is propagated to all candidates on completion
  abortController.abort()

  // Return the result
  return resultPromise
}
