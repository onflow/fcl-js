import {AccountManager} from "./account-manager"
import {mockUser} from "../__mocks__/fcl"
import * as fcl from "@onflow/fcl"
import * as rlp from "@onflow/rlp"
import {CurrentUser} from "@onflow/typedefs"

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

jest.mock("@onflow/rlp", () => ({
  encode: jest.fn(),
  Buffer: jest.requireActual("@onflow/rlp").Buffer,
}))

const mockFcl = jest.mocked(fcl)
const mockQuery = jest.mocked(fcl.query)

describe("AccountManager", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with null COA address", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user.mock)
    expect(await accountManager.getCOAAddress()).toBeNull()
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should reset state when the user is not logged in", async () => {
    const user = mockUser()

    const accountManager = new AccountManager(user.mock)

    expect(await accountManager.getCOAAddress()).toBeNull()
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should fetch and update COA address when user logs in", async () => {
    const user = mockUser()
    mockQuery.mockResolvedValue("0x123")

    const accountManager = new AccountManager(user.mock)

    expect(await accountManager.getCOAAddress()).toBe(null)

    user.set!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(await accountManager.getAccounts()).toEqual(["0x123"])
    expect(fcl.query).toHaveBeenCalledWith({
      cadence: expect.any(String),
      args: expect.any(Function),
    })
  })

  it("should not update COA address if user has not changed", async () => {
    const user = mockUser()
    mockQuery.mockResolvedValue("0x123")

    const accountManager = new AccountManager(user.mock)

    user.set!({addr: "0x1"} as CurrentUser)

    await new Promise(setImmediate)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1)

    user.set!({addr: "0x1"} as CurrentUser)

    expect(await accountManager.getCOAAddress()).toBe("0x123")
    expect(fcl.query).toHaveBeenCalledTimes(1) // Should not have fetched again
  })

  it("should not update COA address if fetch is outdated when user changes", async () => {
    const user = mockUser()
    mockQuery.mockResolvedValue("0x123")

    mockQuery
      // 1st fetch: delayed
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve("0x123"), 500))
      )
      // 2nd fetch: immediate
      .mockResolvedValueOnce("0x456")

    const accountManager = new AccountManager(user.mock)

    await user.set!({addr: "0x1"} as CurrentUser)
    await user.set!({addr: "0x2"} as CurrentUser)

    // The second fetch (for address 0x2) is the latest, so "0x456"
    expect(await accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should throw if COA address fetch fails", async () => {
    const user = mockUser()
    mockQuery.mockRejectedValueOnce(new Error("Fetch failed"))

    const accountManager = new AccountManager(user.mock)

    await user.set!({addr: "0x1"} as CurrentUser)

    await expect(accountManager.getCOAAddress()).rejects.toThrow("Fetch failed")
  })

  it("should handle user changes correctly", async () => {
    const user = mockUser()

    mockQuery
      .mockResolvedValueOnce("0x123") // for user 0x1
      .mockResolvedValueOnce("0x456") // for user 0x2

    const accountManager = new AccountManager(user.mock)

    await user.set({addr: "0x1"} as CurrentUser)
    expect(await accountManager.getCOAAddress()).toBe("0x123")

    await user.set({addr: "0x2"} as CurrentUser)

    await new Promise(setImmediate)
    expect(await accountManager.getCOAAddress()).toBe("0x456")
  })

  it("should call the callback with updated accounts in subscribe", async () => {
    mockQuery.mockResolvedValue("0x123")

    const user = mockUser()

    const accountManager = new AccountManager(user.mock)

    const callback = jest.fn()
    accountManager.subscribe(callback)

    user.set({addr: "0x1"} as CurrentUser)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith(["0x123"])
  })

  it("should reset accounts in subscribe if user is not authenticated", async () => {
    mockQuery.mockResolvedValue("0x123")
    const user = mockUser()

    const callback = jest.fn()

    const accountManager = new AccountManager(user.mock)

    accountManager.subscribe(callback)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith([])
  })

  it("should call the callback when COA address is updated", async () => {
    const callback = jest.fn()

    const user = mockUser({addr: "0x1"} as CurrentUser)

    mockQuery.mockResolvedValueOnce("0x123")

    const accountManager = new AccountManager(user.mock)

    accountManager.subscribe(callback)

    await new Promise(setImmediate)

    expect(callback).toHaveBeenCalledWith(["0x123"])
  })

  it("should return an empty array when COA address is null", async () => {
    const {mock: user} = mockUser()
    const accountManager = new AccountManager(user)
    expect(await accountManager.getAccounts()).toEqual([])
  })

  it("should return COA address array when available", async () => {
    mockQuery.mockResolvedValueOnce("0x123")
    const {mock: user} = mockUser({addr: "0x1"} as CurrentUser)

    const accountManager = new AccountManager(user)

    expect(await accountManager.getAccounts()).toEqual(["0x123"])
  })
})

describe("send transaction", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("send transaction mainnet", async () => {
    const user = mockUser({addr: "0x4444"} as CurrentUser).mock
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
    jest.mocked(fcl.query).mockResolvedValue("0x1234")

    const tx = {
      to: "0x1234",
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "747",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1852")
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
    const accountManager = new AccountManager(user.mock)

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
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "646",
    }

    const result = await accountManager.sendTransaction(tx)

    expect(result).toEqual("1852")
    expect(fcl.mutate).toHaveBeenCalled()
    expect(mockFcl.mutate.mock.calls[0][0]).toMatchObject({
      cadence: expect.any(String),
      args: expect.any(Function),
      authz: user.mock,
      limit: 9999,
    })

    expect(mockFcl.tx).toHaveBeenCalledWith("1111")
    expect(mockFcl.tx).toHaveBeenCalledTimes(1)
    expect(mockTxResult.onceExecuted).toHaveBeenCalledTimes(1)
  })

  test("throws error if no executed event not found", async () => {
    const user = mockUser()
    const accountManager = new AccountManager(user.mock)

    const mockTxResult = {
      onceExecuted: jest.fn().mockResolvedValue({
        events: [],
      }),
    } as any as jest.Mocked<ReturnType<typeof fcl.tx>>

    jest.mocked(fcl.tx).mockReturnValue(mockTxResult)
    jest.mocked(fcl.mutate).mockResolvedValue("1111")

    const tx = {
      to: "0x1234",
      from: "0x1234",
      value: "0",
      data: "0x1234",
      nonce: "0",
      gas: "0",
      chainId: "646",
    }

    await expect(accountManager.sendTransaction(tx)).rejects.toThrow(
      "EVM transaction hash not found"
    )
  })
})

describe("signMessage", () => {
  let accountManager: AccountManager
  let user: ReturnType<typeof mockUser>["mock"]
  let updateUser: ReturnType<typeof mockUser>["set"]

  beforeEach(() => {
    jest.clearAllMocks()
    ;({mock: user, set: updateUser} = mockUser({addr: "0x123"} as CurrentUser))
    jest.mocked(fcl.query).mockResolvedValue("0xCOA1")
    accountManager = new AccountManager(user)
  })

  it("should throw an error if the COA address is not available", async () => {
    await updateUser({addr: undefined} as CurrentUser)
    accountManager["coaAddress"] = null

    await expect(
      accountManager.signMessage("Test message", "0x1234")
    ).rejects.toThrow(
      "COA address is not available. User might not be authenticated."
    )
  })

  it("should throw an error if the signer address does not match the COA address", async () => {
    await expect(
      accountManager.signMessage("Test message", "0xDIFFERENT")
    ).rejects.toThrow("Signer address does not match authenticated COA address")
  })

  it("should successfully sign a message and return an RLP-encoded proof", async () => {
    const mockSignature = "0xabcdef1234567890"
    const mockRlpEncoded = "f86a808683abcdef682f73746f726167652f65766d"

    user.signUserMessage.mockResolvedValue([
      {addr: "0xCOA1", keyId: 0, signature: mockSignature} as any,
    ])

    jest.mocked(rlp.encode).mockReturnValue(Buffer.from(mockRlpEncoded, "hex"))

    const proof = await accountManager.signMessage("Test message", "0xCOA1")

    expect(proof).toBe(`0x${mockRlpEncoded}`)

    expect(user.signUserMessage).toHaveBeenCalledWith("Test message")

    expect(rlp.encode).toHaveBeenCalledWith([
      [0],
      expect.any(Buffer),
      "/public/evm",
      [mockSignature],
    ])
  })

  it("should throw an error if signUserMessage returns an empty array", async () => {
    accountManager["coaAddress"] = "0xCOA1"

    user.signUserMessage = jest.fn().mockResolvedValue([])

    await expect(
      accountManager.signMessage("Test message", "0xCOA1")
    ).rejects.toThrow("Failed to sign message")
  })

  it("should throw an error if signUserMessage fails", async () => {
    user.signUserMessage = jest
      .fn()
      .mockRejectedValue(new Error("Signing failed"))

    await expect(
      accountManager.signMessage("Test message", "0xCOA1")
    ).rejects.toThrow("Signing failed")
  })
})
