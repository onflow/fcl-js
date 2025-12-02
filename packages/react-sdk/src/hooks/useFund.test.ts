import {renderHook} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFund} from "./useFund"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {
  FundingProvider,
  FundingSession,
  CryptoFundingIntent,
} from "@onflow/payments"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFund", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    mockFcl = createMockFclInstance()
    // Override getChainId to return numeric chain ID (payments client expects "747", not "mainnet")
    mockFcl.mockFclInstance.getChainId = jest.fn().mockResolvedValue("747")
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const createMockProvider = (session: FundingSession): FundingProvider => ({
    id: "mock-provider",
    getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
    startSession: jest.fn().mockResolvedValue(session),
  })

  test("creates a funding session and returns it", async () => {
    const mockSession: FundingSession = {
      id: "session-123",
      providerId: "mock-provider",
      kind: "crypto",
      instructions: {
        address: "0x1234567890123456789012345678901234567890",
      },
    }

    const mockProvider = createMockProvider(mockSession)

    const {result} = renderHook(
      () =>
        useFund({
          providers: [mockProvider],
        }),
      {
        wrapper: FlowProvider,
      }
    )

    const intent: CryptoFundingIntent = {
      kind: "crypto",
      destination: "eip155:747:0xRecipient",
      currency: "USDC",
      amount: "100",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    const session = await result.current.mutateAsync(intent)

    expect(session).toEqual(mockSession)
    expect(mockProvider.startSession).toHaveBeenCalledWith(intent)
  })

  test("handles provider error", async () => {
    const error = new Error("Provider failed")
    const mockProvider: FundingProvider = {
      id: "failing-provider",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockRejectedValue(error),
    }

    const {result} = renderHook(
      () =>
        useFund({
          providers: [mockProvider],
        }),
      {
        wrapper: FlowProvider,
      }
    )

    const intent: CryptoFundingIntent = {
      kind: "crypto",
      destination: "eip155:747:0xRecipient",
      currency: "USDC",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    await expect(result.current.mutateAsync(intent)).rejects.toThrow(error)
  })

  test("returns mutation state properties", () => {
    const mockSession: FundingSession = {
      id: "session-123",
      providerId: "mock-provider",
      kind: "crypto",
      instructions: {address: "0x123"},
    }

    const mockProvider = createMockProvider(mockSession)

    const {result} = renderHook(
      () =>
        useFund({
          providers: [mockProvider],
        }),
      {
        wrapper: FlowProvider,
      }
    )

    // Check that mutation properties are present
    expect(result.current.mutate).toBeInstanceOf(Function)
    expect(result.current.mutateAsync).toBeInstanceOf(Function)
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
  })
})
