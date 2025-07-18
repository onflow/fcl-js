import {renderHook} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowMutate} from "./useFlowMutate"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/fclInstance"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowMutate", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFcl).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("calls fcl.mutate and returns transaction id", async () => {
    const txId = "transaction-id-123"
    jest.mocked(mockFcl.mockFclInstance.mutate).mockResolvedValueOnce(txId)

    const variables = {
      cadence: "transaction {}",
      args: (arg: any) => [],
    }
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    const returnedTxId = await result.current.mutateAsync(variables)
    expect(returnedTxId).toBe(txId)
    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalledWith(variables)
  })

  test("handles error when fcl.mutate rejects", async () => {
    const error = new Error("Mutation failed")
    jest.mocked(mockFcl.mockFclInstance.mutate).mockRejectedValue(error)

    const variables = {
      cadence: "transaction {}",
      args: (arg: any) => [],
    }
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.mutateAsync(variables)).rejects.toThrow(error)
    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalledWith(variables)
  })
})
