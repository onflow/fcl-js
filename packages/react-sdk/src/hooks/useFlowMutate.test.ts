import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowMutate} from "./useFlowMutate"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowMutate", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("calls fcl.mutate and returns transaction id", async () => {
    const txId = "transaction-id-123"
    jest.spyOn(fcl, "mutate").mockResolvedValue(txId)

    const variables = {
      cadence: "transaction {}",
      args: (arg: any) => [],
    }
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    const returnedTxId = await result.current.mutateAsync(variables)
    expect(returnedTxId).toBe(txId)
    expect(fcl.mutate).toHaveBeenCalledWith(variables)
  })

  test("handles error when fcl.mutate rejects", async () => {
    const error = new Error("Mutation failed")
    jest.spyOn(fcl, "mutate").mockRejectedValue(error)

    const variables = {
      cadence: "transaction {}",
      args: (arg: any) => [],
    }
    const {result} = renderHook(() => useFlowMutate(), {
      wrapper: FlowProvider,
    })

    await expect(result.current.mutateAsync(variables)).rejects.toThrow(error)
    expect(fcl.mutate).toHaveBeenCalledWith(variables)
  })
})
