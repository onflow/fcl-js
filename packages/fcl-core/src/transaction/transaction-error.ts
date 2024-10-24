import {FvmErrorCode} from "@onflow/typedefs"

const ERROR_CODE_REGEX = /\[Error Code: (\d+)\]/

export class TransactionError extends Error {
  public code: FvmErrorCode

  constructor(message: string, code: FvmErrorCode) {
    super(message)
    this.code = code
  }
}

export function parseTransactionErrorCode(errorMessage: string): FvmErrorCode {
  const match = errorMessage.match(ERROR_CODE_REGEX)
  const code = match ? parseInt(match[1], 10) : undefined

  return code || FvmErrorCode.UNKNOWN_ERROR
}
