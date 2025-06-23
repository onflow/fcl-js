import {normalizeAuthn} from "./authn"
import {normalizeAuthz} from "./authz"
import {normalizePreAuthz} from "./pre-authz"
import {normalizeFrame} from "./frame"
import {normalizeBackChannelRpc} from "./back-channel-rpc"
import {normalizeOpenId} from "./open-id"
import {normalizeUserSignature} from "./user-signature"
import {normalizeLocalView} from "./local-view"
import {normalizeAccountProof} from "./account-proof"
import {normalizeAuthnRefresh} from "./authn-refresh"
import type {Service} from "@onflow/typedefs"

export function normalizeServices(services: Service[], data?: any): Service[] {
  return services
    .map(service => normalizeService(service, data))
    .filter(Boolean)
}

const serviceNormalizers: Record<
  string,
  (service: Service, data?: any) => any
> = {
  "back-channel-rpc": normalizeBackChannelRpc,
  "pre-authz": normalizePreAuthz,
  authz: normalizeAuthz,
  authn: normalizeAuthn,
  frame: normalizeFrame,
  "open-id": normalizeOpenId,
  "user-signature": normalizeUserSignature,
  "local-view": normalizeLocalView,
  "account-proof": normalizeAccountProof,
  "authn-refresh": normalizeAuthnRefresh,
}

export function normalizeService(service: Service, data?: any): Service {
  try {
    const normalized = serviceNormalizers[service.type](service, data)
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
