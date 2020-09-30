import {pipe, makeProposer} from "@onflow/interaction"

const roles = {
  proposer: true,
}

export async function proposer(authz) {
  return typeof authz === "function"
    ? makeProposer({resolve: authz, role: roles, roles})
    : makeProposer({...authz, role: roles, roles})
}
