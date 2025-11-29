import {CORE_STRATEGIES, getExecHttpPost} from "@onflow/fcl-core"
import {execLocal} from "./exec-local"
import {execDeeplinkRPC} from "./strategies/deeplink-rpc"
import {execDiscoveryRN} from "./strategies/discovery-rn"
import {DISCOVERY_RN_METHOD} from "./constants"

export const coreStrategies = {
  [CORE_STRATEGIES["HTTP/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["DEEPLINK/RPC"]]: execDeeplinkRPC,
  [DISCOVERY_RN_METHOD]: execDiscoveryRN,
}
