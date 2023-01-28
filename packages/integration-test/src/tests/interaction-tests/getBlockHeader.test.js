import * as fcl from "@onflow/fcl"
import { createAccountCLI } from "../../../test-utils/test-utils"

describe("getBlockHeader test", () => {

  test("get latest block header test", async () => {
    let blockHeader = await fcl
      .send([fcl.getBlockHeader(true)])
      .then(fcl.decode)

    expect(blockHeader).toBeDefined()
    let parentId = blockHeader.id

    createAccountCLI("92d158390d8d0470300582a6380abbb466fa183fb57481e3ae1038f6269b75a61b3ca27cc48019bcac2cc72c8ba12b2a194ddacf3c1c499a0fb694d75de1ae4d")

    blockHeader = await fcl
      .send([fcl.getBlockHeader(false)])
      .then(fcl.decode)

    expect(blockHeader).toBeDefined()
    expect(blockHeader.parentId).toMatch(parentId)
  })

  test("get block header atBlockHeight test", async () => {
    const blockHeader = await fcl
      .send([fcl.getBlockHeader(), fcl.atBlockHeight(0)])
      .then(fcl.decode)

    // genesis block
    expect(blockHeader.height).toBe(0)
  })

  test("get block header atBlockId test", async () => {
    const latestBlockHeader = await fcl
      .send([fcl.getBlockHeader()])
      .then(fcl.decode)

    const result = await fcl.send([fcl.getBlockHeader(), fcl.atBlockId(latestBlockHeader.id)]).then(fcl.decode);

    expect(result.id).toMatch(latestBlockHeader.id)
  })
})
