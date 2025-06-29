import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"
import {createGetChainId} from "../../utils"
import {VERSION} from "../../VERSION"
import {configLens} from "../../default-config"
import {checkWalletConnectEnabled} from "./wc-check"
import {Service, CurrentUser} from "@onflow/typedefs"

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
 * @returns Promise resolving to the strategy response
 *
 * @example
 * // Execute a service strategy (internal usage)
 * const response = await execStrategy({
 *   service: { method: "HTTP/POST", endpoint: "https://wallet.example.com/authz" },
 *   body: { transaction: "..." },
 *   config: execConfig,
 *   abortSignal: controller.signal
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
}: ExecStrategyParams): Promise<StrategyResponse> => {
  const strategy = getServiceRegistry().getStrategy(
    service.method
  ) as StrategyFunction
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
export async function execService({
  service,
  msg = {},
  config = {},
  opts = {},
  platform,
  abortSignal = new AbortController().signal,
  execStrategy: _execStrategy,
  user,
}: ExecServiceParams): Promise<StrategyResponse> {
  // Notify the developer if WalletConnect is not enabled
  checkWalletConnectEnabled()

  msg.data = service.data
  const execConfig: ExecConfig = {
    services: await configLens(/^service\./),
    app: await configLens(/^app\.detail\./),
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
    })

    if (res.status === "REDIRECT") {
      invariant(
        service.type === res.data.type,
        "Cannot shift recursive service type in execService"
      )
      return await execService({
        service: res.data,
        msg,
        config: execConfig,
        opts,
        abortSignal,
        platform,
        user,
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
