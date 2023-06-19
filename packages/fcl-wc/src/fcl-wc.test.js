import {config} from "@onflow/config"
import {init} from './fcl-wc'

jest.mock('@walletconnect/modal', () => {})
jest.mock('@walletconnect/sign-client', () => {})
jest.mock('@walletconnect/utils', () => {})

describe("Init Client", () => {
  it("should throw without projectId", async () => {
    async function testFn() {

      // Mock transport then import fcl-wc because startup of fcl will call getChainId util which hits the chain
      await config.overload(
        {
          "flow.network.default": "testnet",
          "sdk.transport": async ix => ix
        },
        async () => {
          await init()
        }
      )
    }

    expect.assertions(1)
    await expect(testFn).rejects.toThrow(Error)
  })
})
