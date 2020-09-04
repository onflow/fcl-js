import {urlFromService} from "./url-from-service"
import {renderAuthzFrame} from "./render-authz-frame"
import {pollForAuthzUpdates} from "./poll-for-authz-updates"
import {uid} from "./uid"

const STRATEGIES = {
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
}

export async function execAuthzService(authz, signable) {
  return STRATEGIES[authz.method](authz, signable)
}

async function execHttpPost(authz, signable) {
  var unrender = () => {}
  var result = null
  try {
    const resp = await fetch(urlFromService(authz), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: signable ? JSON.stringify(signable) : undefined,
    }).then(d => d.json())

    if (resp.local && resp.local.length > 0) {
      const [_, unmount] = renderAuthzFrame(resp.local[0])
      unrender = unmount
    }

    result = await pollForAuthzUpdates(resp.authorizationUpdates)
  } catch (error) {
    unrender()
    console.error(error)
    throw error
  } finally {
    unrender()
    return result
  }
}

async function execIframeRPC(authz, signable) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const [$frame, unmount] = renderAuthzFrame(authz)
    $frame.contentWindow.postMessage(
      {
        jsonrpc: "2.0",
        id,
        method: "fcl:sign",
        params: [signable, authz.params],
      },
      "*"
    )

    const listener = window.addListener("message", async ({data}) => {
      if (typeof data !== "object") return
      if (data.jsonrpc !== "2.0") return
      if (data.id !== id) return

      const result = data.result

      if (result.status === "APPROVED") {
        resolve(result.compositeSignature)
      } else if (result.status === "DECLINED") {
        reject({status: result.status, reason: result.reason})
      } else {
        reject({
          status: "DECLINED",
          reason: "Status was neither APPROVED nor DECLINED",
        })
      }
    })
  })
}
