import {normalizePollingResponse} from "../../../../normalizers/service/polling-response"
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

export async function poll(service, checkCanContinue = () => true) {
  invariant(service, "Missing Polling Service", {service})
  const canContinue = checkCanContinue()
  if (!canContinue) throw new Error("Externally Halted")

  let resp
  try {
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
    ) {
      await new Promise(r => setTimeout(r, 500))
      return poll(service, checkCanContinue)
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
      return poll(resp.updates, checkCanContinue)
  }
}
