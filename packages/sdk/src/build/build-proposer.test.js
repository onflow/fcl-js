import {initInteraction} from "../interaction/interaction"
import {proposer} from "./build-proposer.js"

describe("Build Proposer", () => {
  test("Build Proposer", async () => {
    const authz = {addr: "0xabc123"}

    let ix = await (await proposer(authz))(initInteraction())

    const proposerAccount = ix.accounts[ix.proposer]

    expect(proposerAccount.addr).toEqual(authz.addr)
    expect(proposerAccount.role).toEqual({
      authorizer: false,
      param: false,
      payer: false,
      proposer: true,
    })
  })
})
