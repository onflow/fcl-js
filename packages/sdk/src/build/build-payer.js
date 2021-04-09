import {makeAccountRole} from "../interaction/interaction.js"

const roles = {
  payer: true,
}

export async function payer(authz) {
  return typeof authz === "function"
    ? makeAccountRole({resolve: authz, role: roles, roles})
    : makeAccountRole({...authz, role: roles, roles})
}
