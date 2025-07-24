import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"
import {createGetChainId} from "../../utils"
import {VERSION} from "../../VERSION"
import {configLens} from "../../default-config"
import {checkWalletConnectEnabled} from "./wc-check"
import {Service, CurrentUser} from "@onflow/typedefs"
import {FCLContext} from "../../context"

const AbortController =
  globalThis.AbortController || require("abort-controller")

export interface ExecStrategyParams {
  service: Service
  body: Record<string, any>
  config: ExecConfig
  abortSignal: AbortSignal
  customRpc?: string
  user?: CurrentUser
  opts?: Record<string, any>
}

export interface ExecServiceParams {
  service: Service
  msg?: Record<string, any>
  config?: Record<string, any>
  opts?: Record<string, any>
  platform?: string
  abortSignal?: AbortSignal
  execStrategy?: (params: ExecStrategyParams) => Promise<StrategyResponse>
  user?: CurrentUser
  serviceRegistry?: any // Optional service registry for context-aware usage
}

export interface StrategyResponse {
  status: string
  data?: any
  updates?: Record<string, any>
  local?: boolean
  authorizationUpdates?: Record<string, any>
}

export interface ExecConfig {
  services: Record<string, any>
  app: Record<string, any>
  client: {
    platform?: string
    fclVersion: string
    fclLibrary: string
    hostname: string | null
    network: string
    [key: string]: any
  }
}

export type StrategyFunction = (
  params: ExecStrategyParams
) => Promise<StrategyResponse>

/**
 * @description Executes a service strategy based on the service method. This function looks up the
 * appropriate strategy from the service registry and executes it with the provided parameters.
 * It's used internally by FCL to handle different communication methods with wallet services.
 *
 * @param params The parameters object containing service details and execution context
 * @param params.serviceRegistry Optional service registry to use (falls back to global if not provided)
 * @returns Promise resolving to the strategy response
 *
 * @example
 * // Execute a service strategy (internal usage with global registry)
 * const response = await execStrategy({
 *   service: { method: "HTTP/POST", endpoint: "https://wallet.example.com/authz" },
 *   body: { transaction: "..." },
 *   config: execConfig,
 *   abortSignal: controller.signal
 * })
 *
 * // Execute with context-aware registry
 * const response = await execStrategy({
 *   service: { method: "HTTP/POST", endpoint: "https://wallet.example.com/authz" },
 *   body: { transaction: "..." },
 *   config: execConfig,
 *   abortSignal: controller.signal,
 *   serviceRegistry: myContextRegistry
 * })
 */
export const execStrategy = async ({
  service,
  body,
  config,
  abortSignal,
  customRpc,
  user,
  opts,
  serviceRegistry,
}: ExecStrategyParams & {serviceRegistry?: any}): Promise<StrategyResponse> => {
  const registry = serviceRegistry || getServiceRegistry()
  const strategy = registry.getStrategy(service.method) as StrategyFunction
  return strategy({service, body, config, abortSignal, customRpc, opts, user})
}

/**
 * @description Executes a service with the provided parameters, handling configuration setup,
 * error handling, and recursive service redirects. This is the main entry point for executing
 * wallet service interactions in FCL.
 *
 * @param params The service execution parameters including service, message, and configuration
 * @returns Promise resolving to a StrategyResponse containing the execution result
 *
 * @example
 * // Execute a service (internal usage)
 * const response = await execService({
 *   service: { type: "authz", method: "HTTP/POST", endpoint: "..." },
 *   msg: { transaction: "..." },
 *   config: { client: { platform: "web" } }
 * })
 */
export async function execService(
  context: Pick<FCLContext, "config" | "sdk" | "serviceRegistry">,
  {
    service,
    msg = {},
    config = {},
    opts = {},
    platform,
    abortSignal = new AbortController().signal,
    execStrategy: _execStrategy,
    user,
    serviceRegistry,
  }: ExecServiceParams
): Promise<StrategyResponse> {
  // Notify the developer if WalletConnect is not enabled
  checkWalletConnectEnabled(context)

  msg.data = service.data
  const execConfig: ExecConfig = {
    services: await configLens(context, /^service\./),
    app: await configLens(context, /^app\.detail\./),
    client: {
      ...config.client,
      platform,
      fclVersion: VERSION,
      fclLibrary: "https://github.com/onflow/fcl-js",
      hostname: window?.location?.hostname ?? null,
      network: await createGetChainId(context)(opts),
    },
  }

  try {
    const res = await (_execStrategy || execStrategy)({
      service,
      body: msg,
      config: execConfig,
      opts,
      user,
      abortSignal,
      serviceRegistry,
    })

    if (res.status === "REDIRECT") {
      invariant(
        service.type === res.data.type,
        "Cannot shift recursive service type in execService"
      )
      return await execService(context, {
        service: res.data,
        msg,
        config: execConfig,
        opts,
        abortSignal,
        platform,
        user,
        serviceRegistry,
      })
    } else {
      return res
    }
  } catch (error: any) {
    log({
      title: `Error on execService ${service?.type}`,
      message: error,
      level: LEVELS.error,
    })
    throw error
  }
}
