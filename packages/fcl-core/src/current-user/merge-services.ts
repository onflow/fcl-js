import {Service} from "@onflow/typedefs"

export function mergeServices(
  sx1: Service[] = [],
  sx2: Service[] = []
): Service[] {
  // TODO: Make this smarter
  return [...sx1, ...sx2]
}
