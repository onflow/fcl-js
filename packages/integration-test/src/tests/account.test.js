import * as fcl from "@onflow/fcl"
import { createAccountCLI, getAddressFromCLIOutput } from "../../test-utils/test-utils"

describe("account test", () => {

  test("account test", async () => {

    let output = createAccountCLI("f8fc10de64a4494fad66eff2a8d9f3c4610bfee56f81bc9935d479fde5cb135135c271a99ec6a8579ca765a1d7b75294cce83ab4c4bb07cc7fdd503779b5ae01")
    const address1 = getAddressFromCLIOutput(output, false)

    output = createAccountCLI("2a6f642d51c0e36a859667705764b32e9623fc346e90fb5bb652fda04a567e9229d6f544160bde766803c56ec28d9d231308508c7c5678ca3ebe12134a537546")
    const address2 = getAddressFromCLIOutput(output, false)
    
    const account1 = await fcl.account(address1)
    expect(account1.address).toMatch(address1)

    const account2 = await fcl.account(address2)
    expect(account2.address).toMatch(address2)
  })
})
