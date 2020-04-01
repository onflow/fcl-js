import {pipe, put} from "@onflow/interaction"

export function ref(ref) {
  return pipe([put("tx.ref", ref)])
}
