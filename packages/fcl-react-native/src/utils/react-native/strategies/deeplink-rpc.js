import {normalizePollingResponse} from "@onflow/fcl-core"
import {browser} from "./utils/browser"

export function execDeeplinkRPC({service, config, body}) {
  return new Promise((resolve, reject) => {
    browser(service, config, body, {
      onResponse: (e, {close}) => {
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
      onClose: () => {
        reject(`Declined: Externally Halted`)
      },
    })
  })
}
