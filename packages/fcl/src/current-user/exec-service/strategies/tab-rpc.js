import {uid} from "@onflow/util-uid"
import {tab} from "./utils/tab"
import {normalizePollingResponse} from "../../normalize/polling-response"
import {configLens} from "../../../default-config"
import {coldStorage} from "../../../current-user/index"

export function execTabRPC(service, body, opts) {
  return new Promise((resolve, reject) => {
    const id = uid()
    const includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall

    body.data = service.data

    tab(service, {
      async onReady(_, {send}) {
        try {
          send({
            type: "FCL:VIEW:READY:RESPONSE",
            body,
            service: {
              params: service.params,
              data: service.data,
            },
            config: {
              services: await configLens(/^service\./),
              app: await configLens(/^app\.detail\./),
            },
          })
          send({
            type: "FCL:FRAME:READY:RESPONSE",
            body,
            service: {
              params: service.params,
              data: service.data,
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
            })
          }
        } catch (error) {
          throw error
        }
      },

      async onResponse(e, {close}) {
        try {
          if (typeof e.data !== "object") return
          const resp = normalizePollingResponse(e.data)
          const user = await coldStorage.get()

          switch (resp.status) {
            case "APPROVED":
              resolve(resp.data)
              user.loggedIn && close()
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
          console.error("execTabRPC onResponse error", error)
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
              user.loggedIn && close()
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
          console.error("execTabRPC onMessage error", error)
          throw error
        }
      },

      onClose() {
        reject(`Declined: Externally Halted`)
      },
    })
  })
}
