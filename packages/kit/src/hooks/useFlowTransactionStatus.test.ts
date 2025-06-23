import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useFlowTransactionStatus} from "./useFlowTransactionStatus"
import {TransactionStatus} from "@onflow/typedefs"
import {FlowProvider} from "../provider"
import {defaultTxStatus, errorTxStatus} from "../__mocks__/tx"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowTransactionStatus", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("returns UNKNOWN when first called", async () => {
    const txMock = jest.mocked(fcl.tx)

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
        wrapper: FlowProvider,
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
    const txMock = jest.mocked(fcl.tx)

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
        wrapper: FlowProvider,
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
      wrapper: FlowProvider,
    })

    expect(result.current.transactionStatus).toBe(null)
    expect(result.current.error).toBe(null)
  })
})
