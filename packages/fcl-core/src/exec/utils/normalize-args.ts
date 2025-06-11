import {isFunc} from "../../utils/is"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import type {ArgsFn} from "../args"

export function normalizeArgs(ax: ArgsFn | any[] | undefined): any[] {
  if (isFunc(ax)) return (ax as ArgsFn)(sdk.arg, t)
  return []
}
