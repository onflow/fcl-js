import {uid} from "@onflow/util-uid"
import {frame} from "./utils/frame"
import {normalizePollingResponse} from "../../normalize/polling-response"
import {normalizeCompositeSignature} from "../../normalize/composite-signature"

export function execIframeRPC(service, signable) {
  return new Promise((resolve, reject) => {
    const id = uid()
    signable.data = service.data

    frame(service, {
      onReady(_, {send}) {
        try {
          // This is out of place, we need to find an alternative
          send({
            jsonrpc: "2.0",
            id: id,
            method: "fcl:sign",
            params: [signable, service.params],
          })
        } catch (error) {
          throw error
        }
      },

      onClose() {
        reject(`Declined: Externally Halted`)
      },

      onMessage(e, {close}) {
        try {
          if (typeof e.data !== "object") return
          if (e.data.jsonrpc !== "2.0") return
          if (e.data.id !== id) return
          const resp = normalizePollingResponse(e.data.result)

          switch (resp.status) {
            case "APPROVED":
              resolve(normalizeCompositeSignature(resp.data))
              close()
              break

            case "DECLINED":
              reject(`Declined: ${resp.reason || "No reason supplied"}`)
              close()
              break

            default:
              reject(`Declined: No reason supplied`)
              close()
              break
          }
        } catch (error) {
          console.error("execIframeRPC onMessage error", error)
          throw error
        }
      },
    })
  })
}
