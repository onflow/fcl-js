import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"
import {getChainId} from "../../utils"
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
      network: await getChainId(opts),
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
