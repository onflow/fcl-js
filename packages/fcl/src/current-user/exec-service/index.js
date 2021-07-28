import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"

const STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
}

export async function execService({service, msg = {}, opts = {}}) {
  try {
    return STRATEGIES[service.method](service, msg, opts)
  } catch (error) {
    console.error("execService({service, msg = {}, opts = {}})", error, {service, msg, opts})
    throw error
  }
}