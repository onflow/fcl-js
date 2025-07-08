import {FvmErrorCode} from "@onflow/typedefs"

const ERROR_CODE_REGEX = /\[Error Code: (\d+)\]/

// Reverse mapping from error codes to error type names for better lookup
const ERROR_CODE_TO_TYPE: Record<number, string> = Object.entries(
  FvmErrorCode
).reduce(
  (acc, [key, value]) => {
    acc[value as number] = key
    return acc
  },
  {} as Record<number, string>
)

export class TransactionError extends Error {
  public code: FvmErrorCode
  public type: string

  private constructor(message: string, code: FvmErrorCode) {
    super(message)
    this.code = code
    this.type = ERROR_CODE_TO_TYPE[code] || "UNKNOWN_ERROR"
  }

  static fromErrorMessage(errorMessage: string): TransactionError {
    const match = errorMessage.match(ERROR_CODE_REGEX)
    const code = match ? (parseInt(match[1], 10) as FvmErrorCode) : undefined

    return new TransactionError(
      errorMessage,
      code || (FvmErrorCode.UNKNOWN_ERROR as FvmErrorCode)
    )
  }
}
