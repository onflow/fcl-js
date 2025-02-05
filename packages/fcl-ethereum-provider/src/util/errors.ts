// EIP-1474 error codes
export enum RpcErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

// EIP-1193 error codes
export enum ProviderErrorCode {
  UserRejectedRequest = 4001,
  Unauthorized = 4100,
  UnsupportedMethod = 4200,
  Disconnected = 4900,
}

// EI-1474 error messages used as default
export const RpcErrorMessage: Record<RpcErrorCode, string> = {
  [-32700]: "Parse error",
  [-32600]: "Invalid request",
  [-32601]: "Method not found",
  [-32602]: "Invalid params",
  [-32603]: "Internal error",
}

// EIP-1193 error messages used as default
export const ProviderErrorMessage: Record<ProviderErrorCode, string> = {
  [4001]: "User rejected request",
  [4100]: "Unauthorized",
  [4200]: "Unsupported method",
  [4900]: "Disconnected",
}

export class RpcError extends Error {
  public code: RpcErrorCode
  public data?: unknown

  constructor({
    code,
    message,
    data,
    cause,
  }: {
    code: RpcErrorCode
    message?: string
    data?: unknown
    cause?: any
  }) {
    if (!RpcErrorMessage[code]) {
      throw new Error(`Invalid RPC error code: ${code}`)
    }
    super(message || RpcErrorMessage[code])
    this.code = code
    this.data = data
    if (cause) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`
    }
  }
}

export class ProviderError extends Error {
  public code: ProviderErrorCode

  constructor(code: ProviderErrorCode, message?: string) {
    super(message || ProviderErrorMessage[code])
    this.code = code
  }
}
