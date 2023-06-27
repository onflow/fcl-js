import { CORE_STRATEGIES } from "../constants"
import {getExecHttpPost} from "../../current-user/exec-service/strategies/http-post"
import {execIframeRPC} from "../../current-user/exec-service/strategies/iframe-rpc"
import {execPopRPC} from "../../current-user/exec-service/strategies/pop-rpc"
import {execTabRPC} from "../../current-user/exec-service/strategies/tab-rpc"
import {execExtRPC} from "../../current-user/exec-service/strategies/ext-rpc"
import { execLocal } from "./exec-local"

export const coreStrategies = ({
  [CORE_STRATEGIES["HTTP/RPC"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["HTTP/POST"]]: getExecHttpPost(execLocal),
  [CORE_STRATEGIES["IFRAME/RPC"]]: execIframeRPC,
  [CORE_STRATEGIES["POP/RPC"]]: execPopRPC,
  [CORE_STRATEGIES["TAB/RPC"]]: execTabRPC,
  [CORE_STRATEGIES["EXT/RPC"]]: execExtRPC,
})
