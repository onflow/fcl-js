import * as fcl from "@onflow/fcl"
let authz

describe("tx test", () => {
  beforeAll(() => {
    authz = global.__authz__
  })

  test("tx test no args", async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(
          `transaction() {prepare(auth: AuthAccount) { log("hello")} }`
        ),
        fcl.limit(100),
        fcl.proposer(authz),
        fcl.payer(authz),
        fcl.authorizations([authz]),
      ])
      .then(fcl.decode)

    let statusList = []

    let unsubscribeFn = fcl.tx(transactionId).subscribe(status => {
      statusList.push(status)
    })

    let finalizedStatus = await fcl.tx(transactionId).onceFinalized()
    expect(finalizedStatus.status).toBeGreaterThanOrEqual(2)

    let executedStatus = await fcl.tx(transactionId).onceExecuted()
    expect(executedStatus.status).toBeGreaterThanOrEqual(3)

    let sealedStatus = await fcl.tx(transactionId).onceSealed()
    expect(sealedStatus.status).toBeGreaterThanOrEqual(4)

    let snapshot = await fcl.tx(transactionId).snapshot()
    expect(snapshot).toEqual(sealedStatus)

    expect(statusList.length).toBeGreaterThanOrEqual(1)

    await unsubscribeFn()
  })
})
