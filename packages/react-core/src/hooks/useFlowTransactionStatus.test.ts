import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useFlowTransactionStatus} from "./useFlowTransactionStatus"
import {TransactionStatus} from "@onflow/typedefs"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {defaultTxStatus, errorTxStatus} from "../__mocks__/tx"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowTransactionStatus", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    queryClient.clear()
    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    setMockFlowClient(null)
    jest.clearAllMocks()
  })

  test("returns UNKNOWN when first called", async () => {
    const txMock = jest.mocked(mockFcl.mockFclInstance.tx)

    let subscribeCallback: (txStatus: TransactionStatus) => void = () => {}

    const subscribeMock = jest.fn().mockImplementation(callback => {
      subscribeCallback = callback
      return () => {}
    })

    txMock.mockReturnValue({
      subscribe: subscribeMock,
    } as unknown as ReturnType<typeof fcl.tx>)

    const {result} = renderHook(
      () => useFlowTransactionStatus({id: "mockTxId"}),
      {
        wrapper: TestProvider,
      }
    )

    act(() => {
      subscribeCallback(defaultTxStatus)
    })

    expect(result.current.transactionStatus?.status).toBe(0)
    expect(result.current.transactionStatus?.statusString).toBe("UNKNOWN")
    expect(result.current.error).toBe(null)
  })

  test("sets error when transaction status includes an errorMessage", async () => {
    const txMock = jest.mocked(mockFcl.mockFclInstance.tx)

    let subscribeCallback: (txStatus: TransactionStatus) => void = () => {}
    const subscribeMock = jest.fn().mockImplementation(callback => {
      subscribeCallback = callback
      return () => {}
    })

    txMock.mockReturnValue({
      subscribe: subscribeMock,
    } as unknown as ReturnType<typeof fcl.tx>)

    const {result} = renderHook(
      () => useFlowTransactionStatus({id: "mockTxId"}),
      {
        wrapper: TestProvider,
      }
    )

    act(() => {
      subscribeCallback(errorTxStatus)
    })

    expect(result.current.transactionStatus?.statusString).toBe("ERROR")
    expect(result.current.error).not.toBeNull()
    expect(result.current.error?.message).toBe("Test error occurred")
  })

  test("returns null when no transaction ID is provided", () => {
    const {result} = renderHook(() => useFlowTransactionStatus({}), {
      wrapper: TestProvider,
    })

    expect(result.current.transactionStatus).toBe(null)
    expect(result.current.error).toBe(null)
  })
})
