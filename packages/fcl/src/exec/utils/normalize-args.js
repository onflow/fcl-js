import {isFunc} from "./is"
import * as sdk from "@onflow/sdk"

export function normalizeArgs(ax) {
  if (isFunc(ax)) return ax(sdk.arg, t)
  return []
}
