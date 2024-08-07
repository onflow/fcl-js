export enum RpcErrorCode {
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  PARSE_ERROR = -32700,
}

export class RpcError extends Error {
  constructor(
    public code: RpcErrorCode,
    public message: string,
    public data?: any
  ) {
    super(message)
  }
}
