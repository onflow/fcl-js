import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowChainId} from "./useFlowChainId"
import {useFlowQuery} from "./useFlowQuery"
import {useCrossVmTokenBalance} from "./useCrossVmTokenBalance"
import {act, renderHook, waitFor} from "@testing-library/react"
import {createMockFclInstance} from "../__mocks__/flow-client"

jest.mock("./useFlowQuery")
jest.mock("./useFlowChainId")

describe("useCrossVmTokenBalance", () => {
  beforeEach(() => {
    queryClient.clear()
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
      result = renderHook(useCrossVmTokenBalance, {
        wrapper: TestProvider,
        initialProps: {
          vaultIdentifier: "A.1234.Token.Vault",
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
      data: ["4", "10.001", "200001"],
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
      result = renderHook(useCrossVmTokenBalance, {
        wrapper: TestProvider,
        initialProps: {
          vaultIdentifier: "A.1234.Token.Vault",
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
        cadence: {
          formatted: "10.001",
          value: BigInt("1000100000"),
          precision: 8,
        },
        evm: {
          formatted: "20.0001",
          value: BigInt("200001"),
          precision: 4,
        },
        combined: {
          formatted: "30.0011",
          value: BigInt("3000110000"),
          precision: 8,
        },
      },
    })
  })
})
