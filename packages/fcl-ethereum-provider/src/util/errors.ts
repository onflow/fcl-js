export const ProviderErrorCode = {
  // EIP-1193 error codes
  UserRejectedRequest: 4001,
  Unauthorized: 4100,
  UnsupportedMethod: 4200,
  Disconnected: 4900,

  // EIP-1474 / JSON-RPC error codes
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
} as const

export type ProviderErrorCode =
  (typeof ProviderErrorCode)[keyof typeof ProviderErrorCode]

export const ProviderErrorMessage: Record<ProviderErrorCode, string> = {
  // EIP-1193 error messages
  [ProviderErrorCode.UserRejectedRequest]: "User rejected request",
  [ProviderErrorCode.Unauthorized]: "Unauthorized",
  [ProviderErrorCode.UnsupportedMethod]: "Unsupported method",
  [ProviderErrorCode.Disconnected]: "Disconnected",
  // EIP-1474 / JSON-RPC error messages
  [ProviderErrorCode.ParseError]: "Parse error",
  [ProviderErrorCode.InvalidRequest]: "Invalid request",
  [ProviderErrorCode.MethodNotFound]: "Method not found",
  [ProviderErrorCode.InvalidParams]: "Invalid params",
  [ProviderErrorCode.InternalError]: "Internal error",
}

export class ProviderError extends Error {
  public code: ProviderErrorCode
  public cause?: any

  constructor({code, cause}: {code: ProviderErrorCode; cause?: any}) {
    super(ProviderErrorMessage[code])
    this.code = code
    this.cause = cause
  }
}
