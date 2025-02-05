import {formatChainId} from "../../util/eth"
import {ethChainId} from "./eth-chain-id"

jest.mock("../../util/eth", () => ({
  ...jest.requireActual("../../util/eth"),
  formatChainId: jest.fn().mockReturnValue("0x747"),
}))

describe("eth_chainId handler", () => {
  test("should return the formatted chain id", async () => {
    const networkManagerMock = {
      getChainId: jest.fn(),
    }
    networkManagerMock.getChainId.mockResolvedValue(747)

    const chainId = await ethChainId(networkManagerMock as any)()

    expect(chainId).toEqual("0x747")
    expect(networkManagerMock.getChainId).toHaveBeenCalled()
  })

  test("should throw an error if no chain id is available", async () => {
    const networkManagerMock = {
      getChainId: jest.fn(),
    }
    networkManagerMock.getChainId.mockResolvedValue(null)

    await expect(ethChainId(networkManagerMock as any)()).rejects.toThrow(
      "No active chain"
    )
    expect(networkManagerMock.getChainId).toHaveBeenCalled()
  })
})
