import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useFlowTransaction} from "./useFlowTransaction"
import {TransactionStatus} from "@onflow/typedefs"
import {FlowProvider} from "../provider"

const defaultTxStatus: TransactionStatus = {
  blockId: "",
  status: 0,
  statusString: "UNKNOWN",
  statusCode: 0,
  errorMessage: "",
  events: [],
}

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    tx: jest.fn(),
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
  }
})

describe("useFlowTransaction", () => {
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

    const {result} = renderHook(() => useFlowTransaction("mockTxId"), {
      wrapper: FlowProvider,
    })

    act(() => {
      subscribeCallback(defaultTxStatus)
    })

    expect(result.current.transactionStatus?.status).toBe(0)
    expect(result.current.transactionStatus?.statusString).toBe("UNKNOWN")
    expect(result.current.error).toBe(null)
  })
})
