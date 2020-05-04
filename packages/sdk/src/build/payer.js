import {pipe, makePayer} from "@onflow/interaction"

export function payer(authz) {
  return pipe([
    makePayer(
      {
        ...authz,
        role: {payer: true},
      }
    ),
  ])
}
