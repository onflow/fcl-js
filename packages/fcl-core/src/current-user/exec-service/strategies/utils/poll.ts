import {normalizePollingResponse} from "../../../../normalizers/service/polling-response"
import {invariant} from "@onflow/util-invariant"
import {fetchService} from "./fetch-service"
import {Service} from "@onflow/typedefs"

export interface ServiceMethodOptions {
  "HTTP/GET": "GET"
  "HTTP/POST": "POST"
}

const OPTIONS: ServiceMethodOptions = {
  "HTTP/GET": "GET",
  "HTTP/POST": "POST",
}

const serviceMethod = (service: Service): "GET" | "POST" => {
  invariant(
    OPTIONS[service.method as keyof ServiceMethodOptions] as any,
    "Invalid Service Method for type back-channel-rpc",
    {service}
  )
  return OPTIONS[service.method as keyof ServiceMethodOptions]
}

const serviceBody = (service: Service): string | undefined => {
  if (service.method === "HTTP/GET") return undefined
  if (service.method === "HTTP/POST" && (service as any).data != null)
    return JSON.stringify((service as any).data)
  return undefined
}

/**
 * @description Continuously polls a service endpoint until it receives an APPROVED or DECLINED
 * response. This function handles the asynchronous nature of wallet interactions by repeatedly
 * checking for status updates with appropriate delays.
 *
 * @param service The service configuration containing the polling endpoint
 * @param checkCanContinue Optional function to control whether polling should continue
 * @returns Promise resolving to the final response data when approved or rejected
 *
 * @example
 * // Poll a service for completion
 * const result = await poll(pollingService, () => !userCancelled)
 * console.log(result) // Final response data
 */
export async function poll(
  service: Service,
  checkCanContinue: () => boolean = () => true
): Promise<any> {
  invariant(service as any, "Missing Polling Service", {service})
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

  switch (resp?.status) {
    case "APPROVED":
      return resp.data
    case "DECLINED":
      throw new Error(`Declined: ${resp.reason || "No reason supplied."}`)
    default:
      await new Promise(r => setTimeout(r, 500))
      return poll(resp?.updates, checkCanContinue)
  }
}
