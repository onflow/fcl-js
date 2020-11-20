import {urlFromService} from "./url-from-service"
import {renderAuthzFrame} from "./render-authz-frame"
import {pollForAuthzUpdates} from "./poll-for-authz-updates"
import {validateCompositeSignature} from "./validate-composite-signature"
import {uid} from "@onflow/util-uid"
import {sansPrefix} from "@onflow/util-address"
import {execHttpPost} from "./exec-service/strategies/http-post"
import {execIframeRPC} from "./exec-service/strategies/iframe-rpc"

const STRATEGIES = {
  "HTTP/POST": execHttpPost,
  "IFRAME/RPC": execIframeRPC,
}

export async function execAuthzService(authz, signable) {
  const compSig = await STRATEGIES[authz.method](authz, signable)
  if (compSig.sig == null) compSig.sig = compSig.signature
  if (compSig.signature == null) compSig.signature = compSig.sig
  compSig.addr = sansPrefix(compSig.addr)
  validateCompositeSignature(compSig, authz)
  return compSig
}
