import * as fcl from "@onflow/fcl"
import { createAccountCLI } from "../../../test-utils/test-utils"

describe("getBlock test", () => {

  test("get latest block test", async () => {
    let block = await fcl
      .send([fcl.getBlock(true)])
      .then(fcl.decode)

    expect(block).toBeDefined()
    let parentId = block.id

    createAccountCLI("92d158390d8d0470300582a6380abbb466fa183fb57481e3ae1038f6269b75a61b3ca27cc48019bcac2cc72c8ba12b2a194ddacf3c1c499a0fb694d75de1ae4d")

    block = await fcl
      .send([fcl.getBlock(false)])
      .then(fcl.decode)

    expect(block).toBeDefined()
    expect(block.parentId).toMatch(parentId)
  })

  test("get block atBlockHeight test", async () => {
    const block = await fcl
      .send([fcl.getBlock(), fcl.atBlockHeight(0)])
      .then(fcl.decode)

    // genesis block
    expect(block.height).toBe(0)
  })

  test("get block atBlockId test", async () => {
    const latestBlock = await fcl
      .send([fcl.getBlock()])
      .then(fcl.decode)

    const result = await fcl.send([fcl.getBlock(), fcl.atBlockId(latestBlock.id)]).then(fcl.decode);

    expect(result.id).toMatch(latestBlock.id)
  })
})
