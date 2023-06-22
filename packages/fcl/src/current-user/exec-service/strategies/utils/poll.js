import {normalizePollingResponse} from "../../../../normalizers/service/polling-response"
import {serviceEndpoint} from "./service-endpoint"
import {invariant} from "@onflow/util-invariant"
import {fetchService} from "./fetch-service"

const OPTIONS = {
  "HTTP/GET": "GET",
  "HTTP/POST": "POST",
}

const serviceMethod = service => {
  invariant(
    OPTIONS[service.method],
    "Invalid Service Method for type back-channel-rpc",
    {service}
  )
  return OPTIONS[service.method]
}

const serviceBody = service => {
  if (service.method === "HTTP/GET") return undefined
  if (service.method === "HTTP/POST" && service.data != null)
    return JSON.stringify(service.data)
  return undefined
}

export async function poll(service, canContinue = () => true, willContinue = true) {
  invariant(service, "Missing Polling Service", {service})

  // willContinue ensures that one last poll is made before the polling is halted
  if (!willContinue) throw new Error("Externally Halted")
  willContinue = canContinue()
  
  let resp
  try {
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
    ) {
      await new Promise(r => setTimeout(r, 500))
      return poll(service, canContinue)
    }

    resp = await fetchService(service, {
      method: serviceMethod(service),
    }).then(normalizePollingResponse)
  } catch (error) {
    throw error
  }

  switch (resp.status) {
    case "APPROVED":
      return resp.data
    case "DECLINED":
      throw new Error(`Declined: ${resp.reason || "No reason supplied."}`)
    default:
      await new Promise(r => setTimeout(r, 500))
      return poll(resp.updates, canContinue)
  }
}
