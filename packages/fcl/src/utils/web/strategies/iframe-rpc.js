import {uid} from "@onflow/util-uid"
import {frame} from "./utils/frame"
import {normalizePollingResponse} from "@onflow/fcl-core"
import {VERSION} from "../../../VERSION"

export function execIframeRPC({
  service,
  body,
  config,
  ipcController,
  abortSignal,
  opts,
}) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall
    let ipc = null

    const {close} = frame(service, {
      async onReady(_, {send}) {
        try {
          send({
            type: "FCL:VIEW:READY:RESPONSE",
            fclVersion: VERSION,
            body,
            service: {
              params: service.params,
              data: service.data,
              type: service.type,
            },
            config,
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
            config,
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

          ipc = ipcController.connect({
            onMessage: msg => {
              send({
                type: "FCL:VIEW:CUSTOM_IPC",
                payload: msg,
              })
            },
          })
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
              resolve(resp)
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
              resolve(resp)
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

      onCustomIpc(msg) {
        ipc?.send(msg)
      },
    })

    if (abortSignal) {
      if (abortSignal.aborted) {
        reject(`Declined: Aborted`)
        close()
      }
      abortSignal.addEventListener("abort", () => {
        reject(`Declined: Aborted`)
        close()
      })
    }
  })
}
