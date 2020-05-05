import {pipe, makePayer} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export function payer(authz) {
  const a = isFn(authz)
    ? {resolve: authz}
    : authz

  return makePayer({ ...a, role: { payer: true }})
}
