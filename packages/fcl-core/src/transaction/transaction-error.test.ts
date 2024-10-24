import {FvmErrorCode} from "@onflow/typedefs"
import {parseTransactionErrorCode} from "./transaction-error"

describe("parseTransactionErrorCode", () => {
  test("returns unknown error if no code exists", () => {
    const errorMessage = "Transaction rejected by the network"
    const errorCode = parseTransactionErrorCode(status)
    expect(errorCode).toEqual(FvmErrorCode.UNKNOWN_ERROR)
  })

  test("parses transaction error with code from status", () => {
    const errorMessage = "[Error Code: 1101] Some Cadence Error"
    const errorCode = parseTransactionErrorCode(errorMessage)
    expect(errorCode).toEqual(FvmErrorCode.CADENCE_RUNTIME_ERROR)
  })

  test("uses first instance of error code in message", () => {
    const errorMessage =
      "[Error Code: 1102] Some Cadence Error [Error Code: 1105] Something else to say"
    const errorCode = parseTransactionErrorCode(errorMessage)
    expect(errorCode).toEqual(FvmErrorCode.ENCODING_UNSUPPORTED_VALUE)
  })

  test("allows leading text before error code", () => {
    const errorMessage =
      "This is a message [Error Code: 1102] Some Cadence Error"
    const errorCode = parseTransactionErrorCode(errorMessage)
    expect(errorCode).toEqual(FvmErrorCode.ENCODING_UNSUPPORTED_VALUE)
  })

  test("returns unknown error for missing error message", () => {
    const errorMessage = ""
    const errorCode = parseTransactionErrorCode(errorMessage)
    expect(errorCode).toEqual(FvmErrorCode.UNKNOWN_ERROR)
  })
})
