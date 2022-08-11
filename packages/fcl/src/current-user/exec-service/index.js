import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {execWcRPC} from "./strategies/wc-rpc"
import {invariant} from "@onflow/util-invariant"

const CORE_STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
}

const ServiceRegistry = () => {
  const strategies = {...CORE_STRATEGIES}
  const addStrategy = servicePlugin => {
    strategies[servicePlugin.name] = servicePlugin
  }
  const getStrategy = method => strategies[method]

  return Object.freeze({
    strategies,
    addStrategy,
    getStrategy,
  })
}

const execStrategy = async ({service, body, config, opts}) => {
  const strategy = ServiceRegistry().getStrategy(service.method)
  return strategy({service, body, config, opts})
}

export async function execService({service, msg = {}, config = {}, opts = {}}) {
  msg.data = service.data

  try {
    const res = await execStrategy({
      service,
      body: msg,
      config,
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
        opts,
        config,
      })
    } else {
      return res
    }
  } catch (error) {
    console.error("Error on execService", error, {
      service,
      msg,
      config,
      opts,
    })
    throw error
  }
}
