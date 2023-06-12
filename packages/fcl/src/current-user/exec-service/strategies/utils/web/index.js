import { STRATEGY_UTIL_REGISTRY } from "../strategy-util-registry"
import { frame } from "./frame"
import { pop } from "./pop"
import { tab } from "./tab"

export function initStrategyUtils() {
  STRATEGY_UTIL_REGISTRY["FRAME"] = frame
  STRATEGY_UTIL_REGISTRY["POP"] = pop
  STRATEGY_UTIL_REGISTRY["TAB"] = tab
}