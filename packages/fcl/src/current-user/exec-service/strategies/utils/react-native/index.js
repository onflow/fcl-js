import { STRATEGY_UTIL_REGISTRY } from "../strategy-util-registry"
import { browser } from "./browser"

export function initStrategyUtils() {
  STRATEGY_UTIL_REGISTRY["FRAME"] = browser
  STRATEGY_UTIL_REGISTRY["POP"] = browser
  STRATEGY_UTIL_REGISTRY["TAB"] = browser
}