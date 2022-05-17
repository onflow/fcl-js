import {resolveAccounts} from "../sdk"
import {prepAccount} from "./interaction"

describe("prepAccount", () => {
  test("prepAccount converts account object keyId to integer", async () => {
    const keyId = "1"
    const acct = {
      addr: "f8d6e0586b0a20c7",
      keyId,
      signingFunction: () => ({
        addr: "f8d6e0586b0a20c7",
        signature: "abc123",
      }),
    }

    const ix = prepAccount(acct, {role: "proposer"})({accounts: {}})
    expect(ix.accounts[ix.proposer].keyId).toBe(parseInt(keyId))
  })

  test("prepAccount converts authorization function keyId to integer", async () => {
    const keyId = "1"
    const authz = acct => {
      return {
        ...acct,
        addr: "f8d6e0586b0a20c7",
        keyId,
        signingFunction: () => ({
          addr: "f8d6e0586b0a20c7",
          signature: "abc123",
        }),
      }
    }

    const ix = await resolveAccounts(
      prepAccount(authz, {role: "proposer"})({
        accounts: {},
      })
    )
    ix.accounts[ix.proposer] = ix.accounts[ix.proposer].resolve()
    expect(ix.accounts[ix.proposer].keyId).toBe(parseInt(keyId))
  })
})
