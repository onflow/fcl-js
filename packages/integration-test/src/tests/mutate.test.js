import * as fcl from "@onflow/fcl"

let authz

describe("Mutate tests", () => {
  beforeAll(() => {
    authz = global.__authz__
  })

  test("mutate no args test", async () => {
    const txId = await fcl.mutate({
      cadence: `
              transaction() {
                prepare(acct: AuthAccount) {
                  log(acct)
                }
              }
            `,
      limit: 50,
      payer: authz,
      proposer: authz,
      authorizations: [authz],
    })

    const status = await fcl.tx(txId).onceSealed()
    expect(status.status).toEqual(4)
    expect(status.errorMessage).toEqual("")
  })

  test("mutate with args test", async () => {
    const txId = await fcl.mutate({
      cadence: `
      transaction(a: String, b: String, c: Address) {
        prepare(acct: AuthAccount) {
          log(acct)
          log(a)
          log(b)
          log(c)
        }
      }
    `,
      args: (arg, t) => [
        arg("6", t.String),
        arg("7", t.String),
        arg("0xba1132bc08f82fe2", t.Address),
      ],
      limit: 50,
      payer: authz,
      proposer: authz,
      authorizations: [authz],
    })

    const status = await fcl.tx(txId).onceSealed()
    expect(status.status).toEqual(4)
    expect(status.errorMessage).toEqual("")
  })
})
