import {pipe, makePing} from "@onflow/interaction"

export function ping() {
  return pipe([makePing])
}
