import {FvmErrorCode} from "@onflow/typedefs"

const ERROR_CODE_REGEX = /\[Error Code: (\d+)\]/

export class TransactionError extends Error {
  public code: FvmErrorCode
  public type: string

  private constructor(message: string, code: FvmErrorCode) {
    super(message)
    this.code = code
    this.type = FvmErrorCode[code]
  }

  static fromErrorMessage(errorMessage: string): TransactionError {
    const match = errorMessage.match(ERROR_CODE_REGEX)
    const code = match ? parseInt(match[1], 10) : undefined

    return new TransactionError(
      errorMessage,
      code || FvmErrorCode.UNKNOWN_ERROR
    )
  }
}
