import {interaction} from "../interaction/interaction.js"
import {payer} from "./build-payer.js"

describe("Build Payer", () => {
  test("Build Payer", async () => {
    const authz = { addr: "0xabc123" }

    let ix = await (await payer(authz))(interaction())

    const payerAccount = ix.accounts[ix.payer]
    
    expect(payerAccount.addr).toEqual(authz.addr)
    expect(payerAccount.role).toEqual({ 
        authorizer: false,
        param: false,
        payer: true,
        proposer: false
    })
  })
})
