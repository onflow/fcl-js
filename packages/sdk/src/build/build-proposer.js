import {makeAccountRole} from "../interaction/interaction.js"

const roles = {
  proposer: true,
}

export async function proposer(authz) {
  return typeof authz === "function"
    ? makeAccountRole({resolve: authz, role: roles})
    : makeAccountRole({...authz, role: roles})
}
