import {urlFromService} from "./url-from-service"
import {renderAuthzFrame} from "./render-authz-frame"
import {pollForAuthzUpdates} from "./poll-for-authz-updates"
import {validateCompositeSignature} from "./validate-composite-signature"
import {uid} from "@onflow/util-uid"

const STRATEGIES = {
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
}

export async function execAuthzService(authz, signable) {
  const compSig = await STRATEGIES[authz.method](authz, signable)
  if (compSig.sig == null) compSig.sig = compSig.signature
  if (compSig.signature == null) compSig.signature = compSig.sig
  validateCompositeSignature(compSig, authz)
  return compSig
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
    trouble(authz, signable, error)
    throw error
  } finally {
    unrender()
    return result
  }
}

async function execIframeRPC(authz, signable) {
  return new Promise((resolve, reject) => {
    try {
      const id = uid()
      const [$frame, unmount] = renderAuthzFrame(authz)
      setTimeout(() => {
        $frame.contentWindow.postMessage(
          JSON.parse(
            JSON.stringify({
              jsonrpc: "2.0",
              id,
              method: "fcl:sign",
              params: [signable, authz.params],
            })
          ),
          "*"
        )
      }, 500)

      const replyFn = async ({data}) => {
        if (typeof data !== "object") return
        if (data.jsonrpc !== "2.0") return
        if (data.id !== id) return

        const result = data.result

        if (result.status === "APPROVED") {
          window.removeEventListener("message", replyFn)
          unmount()
          resolve(result.compositeSignature)
        } else if (result.status === "DECLINED") {
          window.removeEventListener("message", replyFn)
          unmount()
          reject({status: result.status, reason: result.reason})
        } else {
          window.removeEventListener("message", replyFn)
          unmount()
          reject({
            status: "DECLINED",
            reason: "Status was neither APPROVED nor DECLINED",
          })
        }
      }

      window.addEventListener("message", replyFn)
    } catch (error) {
      trouble(authz, signable, error)
      reject({status: "DECLINED", reason: "Trouble talking to Wallet Provider"})
    }
  })
}

function trouble(authz, signable, error) {
  console.error(
    `[${authz.method}] Trouble talking to Wallet Provider`,
    "\n\n",
    {authz, signable},
    error
  )
}
