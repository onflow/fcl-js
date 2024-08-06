import {extension} from "./utils/extension"
import {normalizePollingResponse} from "@onflow/fcl-core"
import {VERSION} from "../../../VERSION"

export function execExtRPC({
  service,
  body,
  config,
  abortSignal,
  customRpc,
  opts,
}) {
  return new Promise((resolve, reject) => {
    const {close} = extension(service, {
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
          console.error("execExtRPC onResponse error", error)
          throw error
        }
      },

      onClose() {
        reject(`Declined: Externally Halted`)
      },

      onCustomRpc(e) {
        rpc?.receive(e)
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
