import * as fcl from "@onflow/fcl"
import { createAccountCLI } from "../../test-utils/test-utils"

describe("block test", () => {

  test("block test", async () => {
    createAccountCLI("f8fc10de64a4494fad66eff2a8d9f3c4610bfee56f81bc9935d479fde5cb135135c271a99ec6a8579ca765a1d7b75294cce83ab4c4bb07cc7fdd503779b5ae01")
    createAccountCLI("2a6f642d51c0e36a859667705764b32e9623fc346e90fb5bb652fda04a567e9229d6f544160bde766803c56ec28d9d231308508c7c5678ca3ebe12134a537546")
    
    let block = await fcl.block()
    expect(block).toBeDefined()

    block = await fcl.block({sealed: true})
    expect(block).toBeDefined()

    block = await fcl.block({id: block.id})
    expect(block).toBeDefined()

    block = await fcl.block({height: 2})
    expect(block).toBeDefined()
  })
})
