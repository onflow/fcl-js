import {withPrefix} from "@onflow/util-address"

export function mergeServices(sx1 = [], sx2 = []) {
  // TODO: Make this smarter
  return [...sx1, ...sx2]
}
