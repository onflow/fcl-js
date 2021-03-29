import {pipe, makeProposer} from "../interaction/interaction.js"

const roles = {
  proposer: true,
}

export async function proposer(authz) {
  return typeof authz === "function"
    ? makeProposer({resolve: authz, role: roles, roles})
    : makeProposer({...authz, role: roles, roles})
}
