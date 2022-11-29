import * as fcl from "@onflow/fcl"

let authz

describe("Serialize tests", () => {
  beforeAll(() => {
    authz = global.__authz__
  })

  test.only("serialize test", async () => {
    let voucher = await fcl.serialize([
      fcl.transaction`
            transaction() {
              prepare(acct: AuthAccount) {
                log(acct)
              }
            }
          `,
      fcl.limit(999),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.payer(authz),
    ])

    expect(voucher).toBeDefined()
  })
})
