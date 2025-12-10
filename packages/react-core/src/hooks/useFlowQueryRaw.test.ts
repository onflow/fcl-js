import {renderHook, act, waitFor} from "@testing-library/react"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowQueryRaw} from "./useFlowQueryRaw"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {arg, t} from "@onflow/fcl-core"

describe("useFlowQueryRaw", () => {
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

  test("returns undefined when no cadence is provided", async () => {
    const {result} = renderHook(() => useFlowQueryRaw({cadence: ""}), {
      wrapper: TestProvider,
    })

    expect(result.current.data).toBeUndefined()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  test("fetches data successfully", async () => {
    const cadenceScript = "access(all) fun main(): Int { return 42 }"
    const expectedResult = 42
    const queryMock = mockFcl.mockFclInstance.queryRaw
    queryMock.mockResolvedValueOnce(expectedResult)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowQueryRaw({cadence: cadenceScript}),
        {
          wrapper: TestProvider,
        }
      )
      hookResult = result
    })

    expect(hookResult.current.data).toBeUndefined()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))
    expect(queryMock).toHaveBeenCalledWith({
      cadence: cadenceScript,
      args: undefined,
    })
    expect(hookResult.current.data).toEqual(expectedResult)
  })

  test("does not fetch data when enabled is false", async () => {
    const cadenceScript = "access(all) fun main(): Int { return 42 }"
    const queryMock = jest.mocked(mockFcl.mockFclInstance.queryRaw)

    renderHook(
      () => useFlowQueryRaw({cadence: cadenceScript, query: {enabled: false}}),
      {
        wrapper: TestProvider,
      }
    )

    // wait a little to ensure fcl.queryRaw isn't called
    await waitFor(() => {
      expect(queryMock).not.toHaveBeenCalled()
    })
  })

  test("handles error from fcl.queryRaw", async () => {
    const cadenceScript = "access(all) fun main(): Int { return 42 }"
    const testError = new Error("Query failed")
    const queryMock = jest.mocked(mockFcl.mockFclInstance.queryRaw)
    queryMock.mockRejectedValueOnce(testError)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowQueryRaw({cadence: cadenceScript}),
        {
          wrapper: TestProvider,
        }
      )
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))
    expect(hookResult.current.data).toBeUndefined()
    expect(hookResult.current.error).toEqual(testError)
  })

  test("refetch function works correctly", async () => {
    const cadenceScript = "access(all) fun main(): Int { return 42 }"
    const initialResult = 42
    const updatedResult = 100
    const queryMock = jest.mocked(mockFcl.mockFclInstance.queryRaw)
    queryMock.mockResolvedValueOnce(initialResult)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowQueryRaw({cadence: cadenceScript}),
        {
          wrapper: TestProvider,
        }
      )
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(initialResult))

    queryMock.mockResolvedValueOnce(updatedResult)
    act(() => {
      hookResult.current.refetch()
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(updatedResult))
    expect(queryMock).toHaveBeenCalledTimes(2)
  })

  test("supports args function parameter", async () => {
    const cadenceScript = "access(all) fun main(a: Int): Int { return a }"
    const expectedResult = 7
    const queryMock = jest.mocked(mockFcl.mockFclInstance.queryRaw)
    queryMock.mockResolvedValueOnce(expectedResult)

    const argsFunction = (_arg: typeof arg, _t: typeof t) => [_arg(7, _t.Int)]

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowQueryRaw({cadence: cadenceScript, args: argsFunction}),
        {
          wrapper: TestProvider,
        }
      )
      hookResult = result
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))
    expect(hookResult.current.data).toEqual(expectedResult)
    expect(queryMock).toHaveBeenCalledWith({
      cadence: cadenceScript,
      args: argsFunction,
    })
  })

  test("detects args changes", async () => {
    const cadenceScript = "access(all) fun main(a: Int): Int { return a }"
    const initialResult = 7
    const updatedResult = 42
    const queryMock = jest.mocked(mockFcl.mockFclInstance.queryRaw)
    queryMock.mockResolvedValueOnce(initialResult)

    const argsFunction = (_arg: typeof arg, _t: typeof t) => [_arg(7, _t.Int)]

    let hookResult: any
    let hookRerender: any

    await act(async () => {
      const {result, rerender} = renderHook(useFlowQueryRaw, {
        wrapper: TestProvider,
        initialProps: {cadence: cadenceScript, args: argsFunction},
      })
      hookResult = result
      hookRerender = rerender
    })

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))
    expect(hookResult.current.data).toEqual(initialResult)

    queryMock.mockResolvedValueOnce(updatedResult)
    await act(() => {
      hookRerender({
        cadence: cadenceScript,
        args: (_arg: typeof arg, _t: typeof t) => [_arg(42, _t.Int)],
      })
    })

    await waitFor(() => expect(hookResult.current.data).toEqual(updatedResult))
  })
})
