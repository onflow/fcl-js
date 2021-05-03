import {normalizeAuthn} from "./authn"
import {normalizeAuthz} from "./authz"
import {normalizePreAuthz} from "./pre-authz"
import {normalizeFrame} from "./frame"
import {normalizeBackChannelRpc} from "./back-channel-rpc"
import {normalizeOpenId} from "./open-id"
import {normalizeSignature} from "./signature"

export function normalizeServices(services, data) {
  return services.map(service => normalizeService(service, data))
}

const serviceNormalizers = {
  "back-channel-rpc": normalizeBackChannelRpc,
  "pre-authz": normalizePreAuthz,
  authz: normalizeAuthz,
  authn: normalizeAuthn,
  frame: normalizeFrame,
  "open-id": normalizeOpenId,
  signature: normalizeSignature,
}

export function normalizeService(service, data) {
  try {
    var normalized = serviceNormalizers[service.type](service, data)
    return normalized
  } catch (error) {
    console.error(
      `Unrecognized FCL Service Type [${service.type}]`,
      service,
      error
    )
    return service
  }
}
