import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"

const STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
}

export async function execService({service, msg = {}, opts = {}}) {
  try {
    const res = await STRATEGIES[service.method](service, msg, opts)
    if (res.status === "REDIRECT") {
      const {endpoint, method} = res
      try {
        return await execService({
          service: {
            endpoint,
            method,
          },
        })
      } catch (e) {
        console.error("Error while authenticating", e)
      }
    } else {
      return res
    }
  } catch (error) {
    console.error("execService({service, msg = {}, opts = {}})", error, {
      service,
      msg,
      opts,
    })
    throw error
  }
}
