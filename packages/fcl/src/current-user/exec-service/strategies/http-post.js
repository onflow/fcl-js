import {fetchService} from "./utils/fetch-service"
import {normalizePollingResponse} from "../../../normalizers/service/polling-response"
import {normalizeLocalView} from "../../../normalizers/service/local-view"
import {poll} from "./utils/poll"
import {VERSION} from "../../../VERSION"
import {serviceEndpoint} from "../strategies/utils/service-endpoint"

export const getExecHttpPost = (execLocal) => async({service, body, config, opts}) => {
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

    // these two flags are required to run polling one more time before it stops
    var canContinue = true
    var shouldContinue = true

    const [_, unmount] = await execLocal(
      normalizeLocalView(resp.local),
      {
        serviceEndpoint,
        onClose: () => (shouldContinue = false)
      }
    )

    const close = () => {
      try {
        unmount()
        shouldContinue = false
      } catch (error) {
        console.error("Frame Close Error", error)
      }
    }
    /**
     * makes sure that polling is performed one extra time after browser is closed
     *
     * @returns {boolean} 
     */ 
    const checkCanContinue = () => {
      const canContinueLastTime = canContinue
      canContinue = shouldContinue

      return canContinueLastTime
    }

    return poll(resp.updates, checkCanContinue)
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
