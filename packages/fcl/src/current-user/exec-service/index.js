import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {serviceRegistry} from "./plugins"
import {configLens, getNetworkConfig} from "../../default-config"
import {VERSION} from "../../VERSION"

const execStrategy = async ({service, body, config, opts}) => {
  const strategy = serviceRegistry.getStrategy(service.method)
  return strategy({service, body, config, opts})
}

export async function execService({service, msg = {}, config = {}, opts = {}}) {
  msg.data = service.data
  const execConfig = {
    services: await configLens(/^service\./),
    app: await configLens(/^app\.detail\./),
    client: {
      ...config.client,
      fclVersion: VERSION,
      fclLibrary: "https://github.com/onflow/fcl-js",
      hostname: window?.location?.hostname ?? null,
      network: await getNetworkConfig(),
    },
  }

  try {
    const res = await execStrategy({
      service,
      body: msg,
      config: execConfig,
      opts,
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
