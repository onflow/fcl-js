import {Service} from "@onflow/typedefs"
import {RpcClient, RpcNotification, RpcRequest} from "./rpc/rpc-client"
import {createIpcController, IpcConnection} from "@onflow/fcl-core"

export type DiscoveryRpc = RpcClient<DiscoveryRpcMethods, FclRpcMethods>

export enum DiscoveryRpcMethod {
  NOTIFY_QRCODE_EXPIRY = "notify_qrcode_expiry",
  NOTIFY_QRCODE_ERROR = "notify_qrcode_error",
  GET_METHODS = "get_methods",
}

export enum FclRpcMethod {
  REQUEST_QRCODE = "request_qrcode",
  EXEC_SERVICE = "exec_service",
  GET_METHODS = "get_methods",
}

export type DiscoveryRpcMethods = {
  [DiscoveryRpcMethod.NOTIFY_QRCODE_EXPIRY]: RpcNotification<{uri: string}>
  [DiscoveryRpcMethod.NOTIFY_QRCODE_ERROR]: RpcNotification<{error: string}>
  [DiscoveryRpcMethod.GET_METHODS]: RpcRequest<{}, {methods: string[]}>
}

export type FclRpcMethods = {
  [FclRpcMethod.EXEC_SERVICE]: RpcRequest<{service: Service}, {}>
  [FclRpcMethod.REQUEST_QRCODE]: RpcRequest<{service: Service}, {uri: string}>
  [FclRpcMethod.GET_METHODS]: RpcRequest<{}, {methods: string[]}>
}

export function initDiscoveryRpcClient(
  setup: (rpc: RpcClient<DiscoveryRpcMethods, FclRpcMethods>) => void
) {
  let onMessage: (msg: any) => void = () => {}
  let resolveConnection: (conn: IpcConnection) => void = () => {}
  const ctrl = createIpcController({
    onConnect: conn => {
      resolveConnection(conn)
    },
    onMessage: msg => {
      onMessage(msg)
    },
    onClose: () => {
      // TODO: handle close
    },
  })

  const connectionPromise = new Promise<IpcConnection>(resolve => {
    resolveConnection = resolve
  })

  const rpcPromise = new Promise<DiscoveryRpc>(async resolve => {
    const connection = await connectionPromise
    const {rpc, receive} = RpcClient.create<DiscoveryRpcMethods, FclRpcMethods>(
      connection.send
    )
    onMessage = receive
    setup(rpc)
    resolve(rpc)
  })

  return {
    rpc: rpcPromise,
    ipcController: ctrl,
  }
}
