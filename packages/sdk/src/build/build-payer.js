import {pipe, makePayer} from "../interaction/interaction.js"

const roles = {
  payer: true
}

export function payer(authz) {
  return typeof authz === "function"
    ? makePayer({resolve: authz, role: roles, roles})
    : makePayer({...authz, role: roles, roles})
}
