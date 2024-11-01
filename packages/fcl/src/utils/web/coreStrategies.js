import {CORE_STRATEGIES, getExecHttpPost} from "@onflow/fcl-core"
import {execIframeRPC} from "./strategies/iframe-rpc"
import {execPopRPC} from "./strategies/pop-rpc"
import {execTabRPC} from "./strategies/tab-rpc"
import {execExtRPC} from "./strategies/ext-rpc"
import {execLocal} from "./exec-local"

export const coreStrategies = {
  [CORE_STRATEGIES["HTTP/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["IFRAME/RPC"]]: execIframeRPC,
  [CORE_STRATEGIES["POP/RPC"]]: execPopRPC,
  [CORE_STRATEGIES["TAB/RPC"]]: execTabRPC,
  [CORE_STRATEGIES["EXT/RPC"]]: execExtRPC,
}
