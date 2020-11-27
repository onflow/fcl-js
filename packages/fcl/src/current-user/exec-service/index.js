import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"

const STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
}

export async function execService(service, msg) {
  try {
    return STRATEGIES[service.method](service, msg)
  } catch (error) {
    console.error("execService(service, msg)", error, {service, msg})
    throw error
  }
}
