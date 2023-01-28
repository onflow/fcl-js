import * as fcl from "@onflow/fcl"
import {
  createAccountCLI,
  getAddressFromCLIOutput,
} from "../../../test-utils/test-utils"

describe("getEvents test", () => {
  test("getEventsAtBlockHeightRange test", async () => {
    let accounts = []

    // the block to get events starting from (might be the genesis block)
    const fromBlockHeader = await fcl
      .send([fcl.getBlockHeader()])
      .then(fcl.decode)

    // Create two accounts to make a block (events need at least one block in the chain to work)
    let output = createAccountCLI(
      "e822814e4e6fdcaffb0f58de99c494d1caa5f69e790bf2ccf5179a544dcd5385f37a61e8eeb6839e4614a506842e748f25c5c5ef4beab66e5188fb9036030d61"
    )
    accounts.push(getAddressFromCLIOutput(output, true))

    output = createAccountCLI(
      "d89bafd9845bed3f233d0e89bd5872187cb71d103c8e156daf86e497403c6063258a966c0c695e0b8eee2c02b084fad1032334501a2812578a40fcaaf31e3b63"
    )
    accounts.push(getAddressFromCLIOutput(output, true))

    // Find latest block to get events
    const toBlockHeader = await fcl
      .send([fcl.getBlockHeader()])
      .then(fcl.decode)

    const events = await fcl
      .send([
        fcl.getEventsAtBlockHeightRange(
          "flow.AccountCreated",
          fromBlockHeader.height + 1, // this is inclusive so we add one
          toBlockHeader.height
        ),
      ])
      .then(fcl.decode)

    // Check that every event we got can be mapped to an account created above
    const result = events.every(value => {
      return accounts.includes(value.data.address)
    })

    expect(result).toBeTruthy()
  })

  test("getEventsAtBlockIds test", async () => {
    let accounts = []

    // Create two accounts to make a block (events need at least one block in the chain to work)
    let output = createAccountCLI(
      "e822814e4e6fdcaffb0f58de99c494d1caa5f69e790bf2ccf5179a544dcd5385f37a61e8eeb6839e4614a506842e748f25c5c5ef4beab66e5188fb9036030d61"
    )
    accounts.push(getAddressFromCLIOutput(output, true))

    // get block of the previous account creation
    const block1Header = await fcl.send([fcl.getBlockHeader()]).then(fcl.decode)

    output = createAccountCLI(
      "d89bafd9845bed3f233d0e89bd5872187cb71d103c8e156daf86e497403c6063258a966c0c695e0b8eee2c02b084fad1032334501a2812578a40fcaaf31e3b63"
    )
    accounts.push(getAddressFromCLIOutput(output, true))

    // get block of the previous account creation
    const block2Header = await fcl.send([fcl.getBlockHeader()]).then(fcl.decode)

    const events = await fcl
      .send([
        fcl.getEventsAtBlockIds("flow.AccountCreated", [
          block1Header.id,
          block2Header.id,
        ]),
      ])
      .then(fcl.decode)

    // Check that every event we got can be mapped to an account created above
    const result = events.every(value => {
      return accounts.includes(value.data.address)
    })

    expect(result).toBeTruthy()
  })
})
