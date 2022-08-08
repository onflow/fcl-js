import {execHttpPost} from "./strategies/http-post"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {execWcRPC} from "./strategies/wc-rpc"
import {invariant} from "@onflow/util-invariant"

const STRATEGIES = {
  "HTTP/RPC": execHttpPost,
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
  "POP/RPC": execPopRPC,
  "TAB/RPC": execTabRPC,
  "EXT/RPC": execExtRPC,
  "WC/RPC": execWcRPC,
}

export async function execService({service, msg = {}, config = {}, opts = {}}) {
  msg.data = service.data

  try {
    const res = await STRATEGIES[service.method]({
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
