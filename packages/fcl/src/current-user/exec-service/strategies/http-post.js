import {fetchService} from "./utils/fetch-service"
import {normalizePollingResponse} from "../../../normalizers/service/polling-response"
import {normalizeLocalView} from "../../../normalizers/service/local-view"
import {poll} from "./utils/poll"
import {execLocal} from "../exec-local"
import {VERSION} from "../../../VERSION"

export async function execHttpPost({service, body, config, opts}) {
  const resp = await fetchService(service, {
    data: {
      fclVersion: VERSION,
      service: {
        params: service.params,
        data: service.data,
        type: service.type,
      },
      config,
      ...body,
    },
  }).then(normalizePollingResponse)

  if (resp.status === "APPROVED") {
    return resp.data
  } else if (resp.status === "DECLINED") {
    throw new Error(`Declined: ${resp.reason || "No reason supplied."}`)
  } else if (resp.status === "REDIRECT") {
    return resp
  } else if (resp.status === "PENDING") {
    var canContinue = true
    const [_, unmount] = await execLocal(normalizeLocalView(resp.local))

    const close = () => {
      try {
        unmount()
        canContinue = false
      } catch (error) {
        console.error("Frame Close Error", error)
      }
    }

    return poll(resp.updates, () => canContinue)
      .then(serviceResponse => {
        close()
        return serviceResponse
      })
      .catch(error => {
        console.error(error)
        close()
        throw error
      })
  } else {
    console.error(`Auto Decline: Invalid Response`, {service, resp})
    throw new Error(`Auto Decline: Invalid Response`)
  }
}
