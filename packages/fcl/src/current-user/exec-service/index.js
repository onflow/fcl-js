import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {invariant} from "@onflow/util-invariant"
import {configLens} from "../../config-utils"
import {VERSION} from "../../VERSION"

const STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
}

export async function execService({service, msg = {}, opts = {}, config = {}}) {
  const fullConfig = {
    ...config,
    services: await configLens(/^service\./),
    app: await configLens(/^app\.detail\./),
    client: {
      fclVersion: VERSION,
      fclLibrary: "https://github.com/onflow/fcl-js",
      hostname: window?.location?.hostname ?? null
    }
  }

  try {
    const res = await STRATEGIES[service.method](
      service, 
      msg, 
      opts, 
      fullConfig
    )
    if (res.status === "REDIRECT") {
      invariant(
        service.type === res.data.type,
        "Cannot shift recursive service type in execService"
      )
      return await execService({
        service: res.data, 
        msg, 
        opts, 
        config: fullConfig
      })
    } else {
      return res
    }
  } catch (error) {
    console.error("execService({service, msg = {}, opts = {}, config = {}})", error, {
      service,
      msg,
      opts,
      config
    })
    throw error
  }
}
