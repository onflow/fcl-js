import {isFunc} from "../../utils/is"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export function normalizeArgs(ax) {
  if (isFunc(ax)) return ax(sdk.arg, t)
  return []
}
