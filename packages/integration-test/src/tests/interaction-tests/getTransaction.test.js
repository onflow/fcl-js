import * as fcl from "@onflow/fcl"

let authz

describe("getTransaction test", () => {
  beforeAll(() => {
    authz = global.__authz__
  })

  test("getTransaction simple test", async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(
          `transaction(a: String, b: String, c: Address) {
            prepare(acct: AuthAccount) {
              log(acct)
              log(a)
              log(b)
              log(c)
            }
          }`
        ),
        fcl.args([
          fcl.arg("6", fcl.t.String),
          fcl.arg("7", fcl.t.String),
          fcl.arg("0xba1132bc08f82fe2", fcl.t.Address),
        ]),
        fcl.limit(100),
        fcl.proposer(authz),
        fcl.payer(authz),
        fcl.authorizations([authz]),
      ])
      .then(fcl.decode)

    // wait for transaction to be sealed
    await fcl.tx(transactionId).onceSealed()

    const tx = await fcl
      .send([fcl.getTransaction(transactionId)])
      .then(fcl.decode)

    expect(tx.script).toMatch(
      `transaction(a: String, b: String, c: Address) {
            prepare(acct: AuthAccount) {
              log(acct)
              log(a)
              log(b)
              log(c)
            }
          }`
    )
    expect(tx.args).toStrictEqual([
      {type: "String", value: "6"},
      {type: "String", value: "7"},
      {type: "Address", value: "0xba1132bc08f82fe2"},
    ])
    expect(tx.gasLimit).toBe(100)

    const txStatus = await fcl
      .send([fcl.getTransactionStatus(transactionId)])
      .then(fcl.decode)

    expect(txStatus.status).toBe(4)
  })
})
