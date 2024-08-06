import {uid} from "@onflow/util-uid"
import {tab} from "./utils/tab"
import {normalizePollingResponse} from "@onflow/fcl-core"
import {VERSION} from "../../../VERSION"

export function execTabRPC({
  service,
  body,
  config,
  abortSignal,
  customRpc,
  opts,
}) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const {redir, includeOlderJsonRpcCall} = opts
    let rpc = null

    const {close} = tab(service, {
      customRpc,
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
            })
          }

          rpc = customRpc?.connect({
            send: msg => {
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
              !redir && close()
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
              !redir && close()
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
          console.error("execPopRPC onMessage error", error)
          throw error
        }
      },

      onClose() {
        reject(`Declined: Externally Halted`)
      },

      onCustomRpc(msg) {
        rpc?.receive(msg)
      },
    })

    if (abortSignal) {
      if (abortSignal.aborted) {
        close()
        reject(`Declined: Aborted`)
      }
      abortSignal.addEventListener("abort", () => {
        close()
        reject(`Declined: Aborted`)
      })
    }
  })
}
