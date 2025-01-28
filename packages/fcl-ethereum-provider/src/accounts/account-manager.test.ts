import {AccountManager} from "./account-manager"
import {mockUser} from "../__mocks__/fcl"
import * as fcl from "@onflow/fcl"

jest.mock("@onflow/fcl", () => {
  const fcl = jest.requireActual("@onflow/fcl")
  return {
    withPrefix: fcl.withPrefix,
    sansPrefix: fcl.sansPrefix,
    tx: jest.fn(),
    mutate: jest.fn(),
    query: jest.fn(),
  }
})

const mockFcl = fcl as jest.Mocked<typeof fcl>

describe("account manager", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("send transaction mainnet", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [
          {
            type: "A.e467b9dd11fa00df.EVM.TransactionExecuted",
            data: {
              hash: ["12", "34"],
            },
          },
        ],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "747",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1234")
    expect(fcl.mutate).toHaveBeenCalled()
    expect(mockFcl.mutate.mock.calls[0][0]).toMatchObject({
      cadence: expect.any(String),
      args: expect.any(Function),
      authz: user,
      limit: 9999,
    })

    expect(mockFcl.tx).toHaveBeenCalledWith("1111")
    expect(mockFcl.tx).toHaveBeenCalledTimes(1)
    expect(mockTxResult.onceExecuted).toHaveBeenCalledTimes(1)
  })

  test("send transaction testnet", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [
          {
            type: "A.8c5303eaa26202d6.EVM.TransactionExecuted",
            data: {
              hash: ["12", "34"],
            },
          },
        ],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "646",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1234")
    expect(fcl.mutate).toHaveBeenCalled()
    expect(mockFcl.mutate.mock.calls[0][0]).toMatchObject({
      cadence: expect.any(String),
      args: expect.any(Function),
      authz: user,
      limit: 9999,
    })

    expect(mockFcl.tx).toHaveBeenCalledWith("1111")
    expect(mockFcl.tx).toHaveBeenCalledTimes(1)
    expect(mockTxResult.onceExecuted).toHaveBeenCalledTimes(1)
  })

  test("throws error if no executed event not found", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gasLimit: "0",
      chainId: "646",
    }

    await expect(accountManager.sendTransaction(tx)).rejects.toThrow(
      "EVM transaction hash not found"
    )
  })
})
