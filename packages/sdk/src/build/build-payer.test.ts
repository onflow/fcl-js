import {initInteraction} from "../interaction/interaction"
import {payer} from "./build-payer"

describe("Build Payer", () => {
  test("Build Payer", async () => {
    const authz = {addr: "0xabc123"}

    let ix = await (await payer(authz))(initInteraction())

    const payerAccount = ix.accounts[ix.payer[0]]

    expect(payerAccount.addr).toEqual(authz.addr)
    expect(payerAccount.role).toEqual({
      authorizer: false,
      param: false,
      payer: true,
      proposer: false,
    })
  })
})
