import {FlowProvider} from "../provider/FlowProvider"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQuery} from "./useFlowQuery"
import {useFullTokenBalance} from "./useFullTokenBalance"
import {act, renderHook, waitFor} from "@testing-library/react"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)
jest.mock("./useFlowQuery")
jest.mock("./useFlowChainId")

describe("useFullTokenBalance", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should return null when data is undefined", async () => {
    const mockQueryResult = {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFlowQuery>

    jest.mocked(useFlowQuery).mockReturnValue(mockQueryResult)
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as unknown as ReturnType<typeof useFlowChainId>)

    let result: ReturnType<typeof renderHook<any, any>>
    act(() => {
      result = renderHook(useFullTokenBalance, {
        wrapper: FlowProvider,
        initialProps: {
          contractIdentifier: "A.1234.Token",
          owner: "0x5678",
        },
      })
    })

    await waitFor(() => expect(result.result.current).toBeDefined())

    expect(jest.mocked(useFlowQuery)).toHaveBeenCalledWith(
      expect.objectContaining({
        cadence: expect.any(String),
        args: expect.any(Function),
        query: {
          enabled: true,
        },
      })
    )

    expect(result!.result.current).toEqual({
      ...mockQueryResult,
      data: null,
    })
  })

  test("should return formatted balance when data is defined", async () => {
    const mockQueryResult = {
      data: ["4", "123.00", "200001", "300001"],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFlowQuery>

    jest.mocked(useFlowQuery).mockReturnValue(mockQueryResult)
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as unknown as ReturnType<typeof useFlowChainId>)

    let result: ReturnType<typeof renderHook<any, any>>
    act(() => {
      result = renderHook(useFullTokenBalance, {
        wrapper: FlowProvider,
        initialProps: {
          contractIdentifier: "A.1234.Token",
          owner: "0x5678",
        },
      })
    })

    await waitFor(() => expect(result.result.current).toBeDefined())

    expect(jest.mocked(useFlowQuery)).toHaveBeenCalledWith(
      expect.objectContaining({
        cadence: expect.any(String),
        args: expect.any(Function),
        query: {
          enabled: true,
        },
      })
    )

    expect(result!.result.current).toEqual({
      ...mockQueryResult,
      data: {
        cadenceBalance: "123.00",
        evmBalance: "20.0001",
        totalBalance: "30.0001",
      },
    })
  })
})
