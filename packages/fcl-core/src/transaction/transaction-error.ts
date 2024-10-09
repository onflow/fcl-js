import {FvmErrorCode, TransactionStatus} from "@onflow/typedefs"

const ERROR_CODE_REGEX = /\[Error Code: (\d+)\]/

export class TransactionError extends Error {
  public code?: FvmErrorCode

  private constructor(message: string, code?: FvmErrorCode) {
    super(message)
    this.code = code
  }
}

function createTransactionError(
  status: TransactionStatus
): TransactionError | null {
  if (status.statusCode === 0) return null

  const match = status.errorMessage.match(ERROR_CODE_REGEX)
  const code = match ? parseInt(match[1], 10) : undefined

  return new TransactionError(status.errorMessage || "Unknown error", code)
}
