import * as fcl from "@onflow/fcl"
const execSync = require("child_process").execSync

describe("events test", () => {
  beforeAll(() => {
    fcl.config().put("fcl.eventPollRate", 100)
  })

  afterAll(() => {
    fcl.config().delete("fcl.eventPollRate")
  })

  test("AccountCreated events test", async () => {
    let eventList = []

    // Create two accounts to make a block (events need at least one block in the chain to work)
    let output = execSync(
      "flow accounts create --key e570c319765cf506af22234c5839d98e5a4f11cc199429133aa012e4745e454453efa698f1b05c34520a13ce8636d990c35fd45b6ac3681b4bc3a534ddc3545e",
      {encoding: "utf-8"}
    )
    output = execSync(
      "flow accounts create --key 8c1a50fd1f84561c1c439c74ae863feb36a4803a1645e70d4d39919abb15c638fca5ebfd1e71145ff5eaac8c241d1fd9fe9741d7d089b14ffeea3e307ed5df2e",
      {encoding: "utf-8"}
    )

    let unsubscribeFn = fcl.events("flow.AccountCreated").subscribe(event => {
      eventList.push(event)
    })

    // wait for previous transactions to be sealed
    await new Promise((res, rej) => setTimeout(res, 500))

    // Create two accounts to emit flow.AccountCreated event
    output = execSync(
      "flow accounts create --key b09b8cf7421df57411aec82c2b94df0e593212e02449421977f6972e53aaaf1be49493f08950ee52dd115d52eb8523e7653a0d83ac9c8617d857eda96285497d",
      {encoding: "utf-8"}
    )
    output = execSync(
      "flow accounts create --key dfa5402be121667bb3987e7afe1d4ab2d1526afc1516b2fa7bde3e36eb99dc0c23c576c8caebc56a98d4c61591e372f01363ccd6d55f5f1eb121bbc8b8f3b70a",
      {encoding: "utf-8"}
    )

    // wait for previous transactions to be sealed
    await new Promise((res, rej) => setTimeout(res, 500))
    await unsubscribeFn()

    expect(eventList.length).toBe(2)
  })

  test("AccountKeyAdded events test", async () => {
    let eventList = []

    // Create two accounts to make a block (events need at least one block in the chain to work)
    let output = execSync(
      "flow accounts create --key bc109999c133a4de49e699f7ec597872afc1f5e8c6f2a98b88cc9165ee047074fede4622ee8c49c9c74995c73f855877aa571a46035df3e2222548129ce76f96",
      {encoding: "utf-8"}
    )
    output = execSync(
      "flow accounts create --key 7b5e223c0efaffc120f4137c5d178ec3ec55438bc065111986745969f6749822afac6b7a23136bce9b66fce1103884e5bc7764b1ed6d08f1eee5918d862b8ab6",
      {encoding: "utf-8"}
    )

    let unsubscribeFn = fcl.events("flow.AccountKeyAdded").subscribe(event => {
      eventList.push(event)
    })

    // wait for previous transactions to be sealed
    await new Promise((res, rej) => setTimeout(res, 500))

    let publicKey1 =
      "af6c1ca75219516bf7d1225ba1465371edb2e03492936f154b6493ce591b1334d6fe0563aae34bd1734b249247dd38764c8518a8f0dc557f279d7d1acc29b8a5"
    let publicKey2 =
      "42927c3be0a29b7151799082e2ac9f061568689dfc95111a37b4aed31a6986944275a50f0d94e7c348b5916abfb050f91bffe546225429d77fcae66b2433d401"
    let publicKeys = [publicKey1, publicKey2]

    // Create two accounts to add keys to emit flow.AccountKeyAdded event
    output = execSync(`flow accounts create --key ${publicKeys[0]}`, {
      encoding: "utf-8",
    })
    output = execSync(`flow accounts create --key ${publicKeys[1]}`, {
      encoding: "utf-8",
    })

    // wait for previous transactions to be sealed
    await new Promise((res, rej) => setTimeout(res, 500))
    await unsubscribeFn()

    expect(eventList.length).toBe(2)

    for (let i = 0; i < eventList.length; i++) {
      let builtKey = ""
      eventList[i].publicKey.publicKey.forEach(byte => {
        let hexNumber = Number(byte).toString(16)
        if (hexNumber.length < 2) {
          hexNumber = "0" + hexNumber
        }

        builtKey += hexNumber
      })

      expect(publicKeys).toContain(builtKey)
    }
  })
})
