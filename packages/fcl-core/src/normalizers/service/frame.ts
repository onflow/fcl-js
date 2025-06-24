import {Service} from "@onflow/typedefs"
import {SERVICE_PRAGMA} from "./__vsn"

export interface FrameService extends Service {
  old?: any
}

/**
 * @description Normalizes a frame service to ensure compatibility with FCL service format
 *
 * @param service The frame service to normalize
 * @returns The normalized frame service or null
 *
 * @example
 * const service = normalizeFrame({
 *   f_type: "Service",
 *   f_vsn: "1.0.0",
 *   type: "frame",
 *   endpoint: "https://rawr",
 *   data: {},   // Sent to frame when ready
 *   params: {}, // include in query params on frame
 * })
 */
export function normalizeFrame(service: Service | null): FrameService | null {
  if (service == null) return null

  if (!service["f_vsn"]) {
    return {
      old: service,
      ...SERVICE_PRAGMA,
      type: "frame",
      endpoint: service.endpoint,
      params: service.params || {},
      data: service.data || {},
    } as FrameService
  }

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
