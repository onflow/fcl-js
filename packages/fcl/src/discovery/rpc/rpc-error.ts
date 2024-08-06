export enum RpcErrorCode {
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  PARSE_ERROR = -32700,
}

export const RpcErrorMessages = {
  [RpcErrorCode.INVALID_REQUEST]: 'Invalid Request',
  [RpcErrorCode.METHOD_NOT_FOUND]: 'Method not found',
  [RpcErrorCode.INVALID_PARAMS]: 'Invalid params',
  [RpcErrorCode.INTERNAL_ERROR]: 'Internal error',
  [RpcErrorCode.PARSE_ERROR]: 'Parse error',
} as const

export class RpcError extends Error {
  constructor(
    public code: RpcErrorCode,
    public message: string,
    public data?: any
  ) {
    super(message)
  }
}
