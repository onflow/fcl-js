import {renderHook, act, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowQuery} from "./useFlowQuery"

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    query: jest.fn(),
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
})
