import {renderHook} from "@testing-library/react"
import {useFlowTransactionStatus} from "./useFlowTransactionStatus"
import {useCrossVmTransactionStatus} from "./useCrossVmTransactionStatus"
import {useFlowChainId} from "./useFlowChainId"
import {mock} from "node:test"

jest.mock("./useFlowTransactionStatus")
jest.mock("./useFlowChainId")

describe("useCrossVmTransactionStatus", () => {
  test("should return transaction status from useFlowTransactionStatus", async () => {
    const mockTxId = "0x123"
    const mockStatus = {
      status: "FINALIZED",
      errorMessage: null,
    } as any
    jest.mocked(useFlowTransactionStatus).mockReturnValue({
      transactionStatus: mockStatus,
      error: null,
    })
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
    } as any)
    const {result} = renderHook(() =>
      useCrossVmTransactionStatus({id: mockTxId})
    )
    expect(result.current.transactionStatus).toEqual(mockStatus)
    expect(result.current.error).toBeNull()
    expect(useFlowTransactionStatus).toHaveBeenCalledWith({
      id: mockTxId,
    })
  })

  test("should parse EVM events correctly, testnet", async () => {
    const mockTxId = "0x123"
    const mockStatus = {
      status: "FINALIZED",
      errorMessage: null,
      events: [
        {
          type: "A.8c5303eaa26202d6.EVM.TransactionExecuted",
          data: {
            hash: [
              parseInt("a", 16).toString(10),
              parseInt("bc", 16).toString(10),
            ],
            errorCode: "0",
            errorMessage: "",
          },
        },
      ],
    } as any
    jest.mocked(useFlowTransactionStatus).mockReturnValue({
      transactionStatus: mockStatus,
      error: null,
    })
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
    } as any)
    const {result} = renderHook(() =>
      useCrossVmTransactionStatus({id: mockTxId})
    )
    expect(result.current.transactionStatus).toEqual(mockStatus)
    expect(result.current.evmResults).toEqual([
      {
        status: "passed",
        hash: "0x0abc",
      },
    ])
    expect(result.current.error).toBeNull()
    expect(useFlowTransactionStatus).toHaveBeenCalledWith({
      id: mockTxId,
    })
  })

  test("should parse EVM events correctly, mainnet", async () => {
    const mockTxId = "0x123"
    const mockStatus = {
      status: "FINALIZED",
      errorMessage: null,
      events: [
        {
          type: "A.e467b9dd11fa00df.EVM.TransactionExecuted",
          data: {
            hash: [
              parseInt("d4", 16).toString(10),
              parseInt("f8", 16).toString(10),
            ],
            errorCode: "0",
            errorMessage: "",
          },
        },
      ],
    } as any
    jest.mocked(useFlowTransactionStatus).mockReturnValue({
      transactionStatus: mockStatus,
      error: null,
    })
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "mainnet",
    } as any)
    const {result} = renderHook(() =>
      useCrossVmTransactionStatus({id: mockTxId})
    )
    expect(result.current.transactionStatus).toEqual(mockStatus)
    expect(result.current.evmResults).toEqual([
      {
        status: "passed",
        hash: "0xd4f8",
      },
    ])
    expect(result.current.error).toBeNull()
    expect(useFlowTransactionStatus).toHaveBeenCalledWith({
      id: mockTxId,
    })
  })

  test("should handle error correctly", async () => {
    const mockTxId = "0x123"
    const mockError = new Error("Transaction not found")
    jest.mocked(useFlowTransactionStatus).mockReturnValue({
      transactionStatus: null,
      error: mockError,
    })
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "testnet",
      isLoading: false,
    } as any)
    const {result} = renderHook(() =>
      useCrossVmTransactionStatus({id: mockTxId})
    )
    expect(result.current.transactionStatus).toBeNull()
    expect(result.current.error).toEqual(mockError)
    expect(useFlowTransactionStatus).toHaveBeenCalledWith({
      id: mockTxId,
    })
  })

  test("should not poll transaction status if chain ID is unsupported and return error", async () => {
    const mockTxId = "0x123"
    jest.mocked(useFlowChainId).mockReturnValue({
      data: "unsupported",
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any)
    const {result} = renderHook(() =>
      useCrossVmTransactionStatus({id: mockTxId})
    )
    expect(result.current.transactionStatus).toBeNull()
    expect(result.current.error).toEqual(
      new Error(
        "Unsupported chain: unsupported. Please ensure the chain ID is valid and supported."
      )
    )
    expect(useFlowTransactionStatus).toHaveBeenCalledWith({
      id: undefined,
    })
  })
})
