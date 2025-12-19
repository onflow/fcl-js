import {renderHook} from "@testing-library/react"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowMutate} from "./useFlowMutate"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"

describe("useFlowMutate", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    queryClient.clear()
    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    setMockFlowClient(null)
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
      wrapper: TestProvider,
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
      wrapper: TestProvider,
    })

    await expect(result.current.mutateAsync(variables)).rejects.toThrow(error)
    expect(mockFcl.mockFclInstance.mutate).toHaveBeenCalledWith(variables)
  })
})
