import {
  isTransaction,
  isScript,
  pipe,
  get,
  Ok,
  update,
} from "@onflow/interaction"

function isFn(v) {
  return typeof v === "function"
}

export const resolveParams = pipe([
  ix => {
    if (!isTransaction(ix) && !isScript(ix)) return Ok(ix)
    const code = get(ix, "ix.code")
    ix.payload.code = isFn(code) ? code(get(ix, "ix.params", {})) : code
    return Ok(ix)
  },
])
