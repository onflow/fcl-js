import {FvmErrorCode, TransactionStatus} from "@onflow/typedefs"
import {TransactionError} from "./transaction-error"

describe("TransactionError", () => {
  test("parses transaction error from status", () => {
    const status: TransactionStatus = {
      blockId: "123",
      status: 1,
      statusString: "PENDING",
      statusCode: 1,
      errorMessage: "Transaction rejected by the network",
      events: [],
    }
    const error = TransactionError.from(status)
    expect(error).toBeInstanceOf(TransactionError)
    expect(error!.message).toEqual("Transaction rejected by the network")
    expect(error!.code).toBeUndefined()
  })

  test("parses transaction error with code from status", () => {
    const status: TransactionStatus = {
      blockId: "123",
      status: 1,
      statusString: "PENDING",
      statusCode: 1,
      errorMessage: "[Error Code: 1101] Some Cadence Error",
      events: [],
    }
    const error = TransactionError.from(status)
    expect(error).toBeInstanceOf(TransactionError)
    expect(error!.message).toEqual("[Error Code: 1101] Some Cadence Error")
    expect(error!.code).toEqual(FvmErrorCode.CADENCE_RUNTIME_ERROR)
  })

  test("returns null for successful transaction", () => {
    const status: TransactionStatus = {
      blockId: "123",
      status: 1,
      statusString: "PENDING",
      statusCode: 0,
      errorMessage: "",
      events: [],
    }
    const error = TransactionError.from(status)
    expect(error).toBeNull()
  })

  test("returns unknown error for missing error message", () => {
    const status: TransactionStatus = {
      blockId: "123",
      status: 1,
      statusString: "PENDING",
      statusCode: 1,
      errorMessage: "",
      events: [],
    }
    const error = TransactionError.from(status)
    expect(error).toBeInstanceOf(TransactionError)
    expect(error!.message).toEqual("Unknown error")
  })
})
