import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowQuery} from "./useFlowQuery"

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    query: jest.fn(),
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
  }
})

describe("useFlowQuery", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("returns null when no cadence is provided", async () => {
    const {result} = renderHook(() => useFlowQuery({cadence: ""}), {
      wrapper: FlowProvider,
    })

    expect(result.current.data).toBeNull()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  test("fetches data successfully", async () => {
    const cadenceScript = "access(all) fun main(): Int { return 42 }"
    const expectedResult = 42
    const queryMock = jest.mocked(fcl.query)
    queryMock.mockResolvedValueOnce(expectedResult)

    let hookResult: any

    await act(async () => {
      const {result} = renderHook(
        () => useFlowQuery({cadence: cadenceScript}),
        {
          wrapper: FlowProvider,
        }
      )
      hookResult = result
    })

    expect(hookResult.current.data).toBeNull()

    await waitFor(() => expect(hookResult.current.isLoading).toBe(false))
    expect(hookResult.current.data).toEqual(expectedResult)
    expect(queryMock).toHaveBeenCalledWith({
      cadence: cadenceScript,
      args: undefined,
    })
  })
})
