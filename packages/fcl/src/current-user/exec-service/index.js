import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {invariant} from "@onflow/util-invariant"

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
      invariant(
        service.type === res.data.type,
        "Cannot shift recursive service type in execService"
      )
      service = res.data
      return await execService({service, msg, opts})
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
