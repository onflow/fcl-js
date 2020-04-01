import {pipe, get, update} from "@onflow/interaction"

function isFn(v) {
  return typeof v === "function"
}

export const resolveParams = pipe([
  update("ix.code", (code, ix) => {
    return isFn(code) ? code(get(ix, "ix.params", {})) : code
  }),
])
