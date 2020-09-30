import {pipe, makePayer} from "@onflow/interaction"

const roles = {
  payer: true
}

export function payer(authz) {
  return typeof authz === "function"
    ? makePayer({resolve: authz, role: roles, roles})
    : makePayer({...authz, role: roles, roles})
}
