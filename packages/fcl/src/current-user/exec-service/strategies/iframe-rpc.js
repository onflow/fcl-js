import {uid} from "@onflow/util-uid"
import {frame} from "./utils/frame"
import {normalizePollingResponse} from "../../normalize/polling-response"
import {configLens} from "../../../config-utils"
import {VERSION} from "../../../VERSION"

export function execIframeRPC(service, body, opts) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall
    body.data = service.data ?? null

    frame(service, {
      async onReady(_, {send}) {
        try {
          send({
            fclVersion: VERSION,
            type: "FCL:VIEW:READY:RESPONSE",
            body,
            service: {
              params: service.params,
              data: service.data,
              type: service.type,
            },
            config: {
              services: await configLens(/^service\./),
              app: await configLens(/^app\.detail\./),
            },
          })
          send({
            fclVersion: VERSION,
            type: "FCL:FRAME:READY:RESPONSE",
            body,
            service: {
              params: service.params,
              data: service.data,
              type: service.type,
            },
            config: {
              services: await configLens(/^service\./),
              app: await configLens(/^app\.detail\./),
            },
            deprecated: {
              message:
                "FCL:FRAME:READY:RESPONSE is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE",
            },
          })
          if (includeOlderJsonRpcCall) {
            send({
              jsonrpc: "2.0",
              id: id,
              method: "fcl:sign",
              params: [body, service.params],
              deprecated: {
                message:
                  "jsonrpc is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE",
              },
            })
          }
        } catch (error) {
          throw error
        }
      },

      onResponse(e, {close}) {
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

            case "REDIRECT":
              resolve({...resp.data, status: "REDIRECT"})
              close()
              break

            default:
              reject(`Declined: No reason supplied`)
              close()
              break
          }
        } catch (error) {
          console.error("execIframeRPC onResponse error", error)
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

            case "REDIRECT":
              resolve({...resp.data, status: "REDIRECT"})
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

      onClose() {
        reject(`Declined: Externally Halted`)
      },
    })
  })
}
