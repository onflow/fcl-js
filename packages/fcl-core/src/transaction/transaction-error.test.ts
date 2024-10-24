import {FvmErrorCode} from "@onflow/typedefs"
import {TransactionError} from "./transaction-error"

describe("TransactionError", () => {
  describe("fromErrorMessage", () => {
    test("returns unknown error if no code exists", () => {
      const errorMessage = "Transaction rejected by the network"
      const error = TransactionError.fromErrorMessage(errorMessage)
      expect(error).toBeInstanceOf(TransactionError)
      expect(error.code).toEqual(FvmErrorCode.UNKNOWN_ERROR)
      expect(error.type).toEqual("UNKNOWN_ERROR")
    })

    test("parses transaction error with code from status", () => {
      const errorMessage = "[Error Code: 1101] Some Cadence Error"
      const error = TransactionError.fromErrorMessage(errorMessage)
      expect(error).toBeInstanceOf(TransactionError)
      expect(error.code).toEqual(FvmErrorCode.CADENCE_RUNTIME_ERROR)
      expect(error.type).toEqual("CADENCE_RUNTIME_ERROR")
    })

    test("uses first instance of error code in message", () => {
      const errorMessage =
        "[Error Code: 1102] Unsupported value... [Error Code: 1105] Something else to say"
      const error = TransactionError.fromErrorMessage(errorMessage)
      expect(error).toBeInstanceOf(TransactionError)
      expect(error.code).toEqual(FvmErrorCode.ENCODING_UNSUPPORTED_VALUE)
      expect(error.type).toEqual("ENCODING_UNSUPPORTED_VALUE")
    })

    test("allows leading text before error code", () => {
      const errorMessage =
        "This is a message [Error Code: 1102] Unsupported value"
      const error = TransactionError.fromErrorMessage(errorMessage)
      expect(error).toBeInstanceOf(TransactionError)
      expect(error.code).toEqual(FvmErrorCode.ENCODING_UNSUPPORTED_VALUE)
      expect(error.type).toEqual("ENCODING_UNSUPPORTED_VALUE")
    })

    test("returns unknown error for missing error message", () => {
      const errorMessage = ""
      const error = TransactionError.fromErrorMessage(errorMessage)
      expect(error).toBeInstanceOf(TransactionError)
      expect(error.code).toEqual(FvmErrorCode.UNKNOWN_ERROR)
      expect(error.type).toEqual("UNKNOWN_ERROR")
    })
  })
})
