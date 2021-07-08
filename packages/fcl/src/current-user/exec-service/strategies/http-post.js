import {fetchService} from "./utils/fetch-service"
import {serviceEndpoint} from "./utils/service-endpoint"
import {normalizePollingResponse} from "../../normalize/polling-response"
import {frame} from "./utils/frame"
import {poll} from "./utils/poll"

export async function execHttpPost(service, signable, opts) {
  signable.data = service.data
  const resp = await fetchService(service, {
    data: signable,
  }).then(normalizePollingResponse)

  if (resp.status === "APPROVED") {
    return resp.data
  } else if (resp.status === "DECLINED") {
    throw new Error(`Declined: ${resp.reason || "No reason supplied."}`)
  } else if (resp.status === "PENDING") {
    var canContinue = true
    const {close: closeFrame} = frame(resp.local, {
      onClose() {
        canContinue = false
      },
    })

    return poll(resp.updates, () => canContinue)
      .then(serviceResponse => {
        closeFrame()
        return serviceResponse
      })
      .catch(error => {
        console.error(error)
        closeFrame()
        throw error
      })
  } else {
    console.error(`Auto Decline: Invalid Response`, {service, resp})
    throw new Error(`Auto Decline: Invalid Response`)
  }
}
