export type RpcRequestMessage = {
  jsonrpc: "2.0"
  id: number
  method: string
  params: any
}

export type RpcNotificationMessage = {
  jsonrpc: "2.0"
  method: string
  params: any
}

export type RpcResponseMessage = {
  jsonrpc: "2.0"
  id: number
  result: any
}

export type RpcErrorMessage = {
  jsonrpc: "2.0"
  id: number
  error: {
    code: number
    message: string
    data?: any
  }
}

export type RpcMessage =
  | RpcRequestMessage
  | RpcNotificationMessage
  | RpcResponseMessage
  | RpcErrorMessage
