import {pipe} from "@qvvg/mario"
import {get, update} from "@onflow/assigns"

export const resolveParams = pipe([
  update("code", (code, ix) => {
    return typeof code === "function" ? code(get(ix, "params", {})) : code
  }),
])
