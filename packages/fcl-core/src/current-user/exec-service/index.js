import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {getServiceRegistry} from "./plugins"
import {getChainId} from "../../utils"
import {VERSION} from "../../VERSION"
import {configLens} from "../../default-config"
import {checkWalletConnectEnabled} from "./wc-check"

const AbortController =
  globalThis.AbortController || require("abort-controller")

export const execStrategy = async ({
  service,
  body,
  config,
  abortSignal,
  customRpc,
  user,
  opts,
}) => {
  const strategy = getServiceRegistry().getStrategy(service.method)
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
}) {
  // Notify the developer if WalletConnect is not enabled
  checkWalletConnectEnabled()

  msg.data = service.data
  const execConfig = {
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
  } catch (error) {
    log({
      title: `Error on execService ${service?.type}`,
      message: error,
      level: LEVELS.error,
    })
    throw error
  }
}
