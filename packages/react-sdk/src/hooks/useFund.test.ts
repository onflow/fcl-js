import {renderHook, waitFor} from "@testing-library/react"
import {useFund} from "./useFund"
import {FundingIntent, FundingSession, PaymentsClient} from "@onflow/payments"
import {FlowProvider} from "../provider/FlowProvider"

describe("useFund", () => {
  const mockSession: FundingSession = {
    provider: "test-provider",
    instructions: {
      kind: "crypto",
      address: "0xTestDepositAddress",
      chain: "eip155:1",
      currency: "0xUSDC",
    },
  }

  const mockIntent: FundingIntent = {
    kind: "crypto",
    destination: "eip155:747:0xRecipient",
    currency: "0xUSDC",
    amount: "100",
    sourceChain: "eip155:1",
    sourceCurrency: "0xUSDC",
  }

  // Create mock payments client
  const createMockPaymentsClient = (shouldSucceed: boolean): PaymentsClient => {
    return {
      createSession: jest
        .fn()
        .mockResolvedValue(
          shouldSucceed
            ? mockSession
            : Promise.reject(new Error("Provider failed"))
        ),
    } as any
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should successfully create a funding session", async () => {
    const mockClient = createMockPaymentsClient(true)

    const {result} = renderHook(() => useFund({paymentsClient: mockClient}), {
      wrapper: FlowProvider,
    })

    // Trigger the mutation
    result.current.mutateAsync(mockIntent)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockSession)
    expect(mockClient.createSession).toHaveBeenCalledWith(mockIntent)
  })

  it("should handle funding session errors", async () => {
    const error = new Error("Provider failed")
    const mockClient = createMockPaymentsClient(false)

    const {result} = renderHook(() => useFund({paymentsClient: mockClient}), {
      wrapper: FlowProvider,
    })

    // Trigger the mutation
    result.current.mutate(mockIntent)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain("Provider failed")
  })

  it("should throw error when no payments client is provided", async () => {
    const {result} = renderHook(() => useFund(), {
      wrapper: FlowProvider,
    })

    // Trigger the mutation
    result.current.mutate(mockIntent)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain(
      "No payments client available"
    )
  })
})
