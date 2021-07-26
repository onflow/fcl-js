import {POLLING_RESPONSE_PRAGMA} from "./__vsn"
import {normalizeBackChannelRpc} from "./back-channel-rpc"
import {normalizeFrame} from "./frame"

// {
//    "f_type": "PollingResponse",
//    "f_vsn": "1.0.0",
//    "status": "PENDING", // PENDING | APPROVED | DECLINED
//    "reason": null,      // Reason for Declining Transaction
//    "data": null,        // Return value for APPROVED
//    "updates": BackChannelRpc,
//    "local": Frame,
// }
export function normalizePollingResponse(resp) {
  if (resp == null) return null
  if (!!resp.addr || !!resp.services) {
    resp = {status: "APPROVED", data: {...resp}}
  }

  switch (resp["f_vsn"]) {
    case "1.0.0":
      return resp

    default:
      return {
        ...POLLING_RESPONSE_PRAGMA,
        status: resp.status,
        reason: resp.reason ?? null,
        data: resp.compositeSignature || resp.data || {},
        updates: normalizeBackChannelRpc(resp.authorizationUpdates),
        local: normalizeFrame((resp.local || [])[0]),
      }
  }
}
