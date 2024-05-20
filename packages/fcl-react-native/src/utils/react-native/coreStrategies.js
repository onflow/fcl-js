import {CORE_STRATEGIES, getExecHttpPost} from "@onflow/fcl-core"
import {execLocal} from "./exec-local"
import {execDeeplinkRPC} from "./strategies/deeplink-rpc"

export const coreStrategies = {
  [CORE_STRATEGIES["HTTP/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["DEEPLINK/RPC"]]: execDeeplinkRPC,
}
