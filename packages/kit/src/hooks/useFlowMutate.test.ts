import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowMutate} from "./useFlowMutate"

jest.mock("@onflow/fcl", () => {
  const actualFcl = jest.requireActual("@onflow/fcl")
  return {
    ...actualFcl,
    mutate: jest.fn(),
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
  }
})

describe("useFlowMutate", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("throws error if no variables are provided", async () => {
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.mutateAsync(undefined as any)).rejects.toThrow(
      "Variables are required."
    )
  })

  test("throws error if cadence is not provided", async () => {
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.mutateAsync({} as any)).rejects.toThrow(
      "Cadence transaction code is required."
    )
  })
})
