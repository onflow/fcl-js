import {interaction} from "../interaction/interaction.js"
import {authorizations, authorization} from "./build-authorizations.js"

describe("Build Authorizations", () => {
  test("build authorizer", async () => {
    let ix = await (
      await authorizations([
        authorization("0xabc123", () => ({signature: "123"}), 1, 123),
      ])
    )(interaction())

    const authorizerAccount = ix.accounts[ix.authorizations]

    expect(authorizerAccount.addr).toEqual("0xabc123")
    expect(authorizerAccount.role).toEqual({
      authorizer: true,
      payer: false,
      proposer: false,
      param: false,
    })
  })
})
