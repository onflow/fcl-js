import {fetchService} from "./utils/fetch-service"
import {serviceEndpoint} from "./utils/service-endpoint"
import {normalizePollingResponse} from "../../normalize/polling-response"
import {normalizeCompositeSignature} from "../../normalize/composite-signature"
import {frame} from "./utils/frame"
import {poll} from "./utils/poll"

export async function execHttpPost(service, signable) {
  signable.data = service.data
  const resp = await fetchService(service, {
    data: signable,
  }).then(normalizePollingResponse)

  var canContinue = true
  const {close: closeFrame} = frame(resp.local, {
    onClose() {
      canContinue = false
    },
  })

  return poll(resp.updates, () => canContinue)
    .then((compositeSignature) => {
      closeFrame()
      return normalizeCompositeSignature(compositeSignature)
    })
    .catch((error) => {
      console.error(error)
      closeFrame()
      throw error
    })
}
