import {pipe, put} from "@onflow/interaction"

export function limit(limit) {
  return pipe([put("tx.limit", limit)])
}
