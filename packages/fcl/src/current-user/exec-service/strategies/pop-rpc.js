import {uid} from "@onflow/util-uid"
import {pop} from "./utils/pop"
import {normalizePollingResponse} from "../../normalize/polling-response"

export function execPopRPC(service, body, opts) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall

    body.data = service.data

    pop(service, {
      onReady(_, {send}) {
        try {
          send({
            type: "FCL:FRAME:READY:RESPONSE",
            body,
            service: {
              params: service.params,
              data: service.data,
            },
          })
          if (includeOlderJsonRpcCall) {
            send({
              jsonrpc: "2.0",
              id: id,
              method: "fcl:sign",
              params: [body, service.params],
            })
          }
        } catch (error) {
          throw error
        }
      },

      onResponse(e, {send, close}) {
        try {
          if (typeof e.data !== "object") return
          const resp = normalizePollingResponse(e.data)

          switch (resp.status) {
            case "APPROVED":
              resolve(resp.data)
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
          console.error("execPopRPC onResponse error", error)
          throw error
        }
      },

      onMessage(e, {close}) {
        try {
          if (typeof e.data !== "object") return
          if (e.data.jsonrpc !== "2.0") return
          if (e.data.id !== id) return
          const resp = normalizePollingResponse(e.data.result)

          switch (resp.status) {
            case "APPROVED":
              resolve(resp.data)
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
          console.error("execPopRPC onMessage error", error)
          throw error
        }
      },

      onClose() {
        reject(`Declined: Externally Halted`)
      },
    })
  })
}
