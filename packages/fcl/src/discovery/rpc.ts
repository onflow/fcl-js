import {RpcClient, RpcNotification, RpcRequest} from "@onflow/util-rpc"
import {Service} from "@onflow/typedefs"

export type DiscoveryRpc = RpcClient<{}, DiscoveryNotifications>

export enum DiscoveryNotification {
  NOTIFY_QRCODE_EXPIRY = "notify_qrcode_expiry",
  NOTIFY_QRCODE_ERROR = "notify_qrcode_error",
}

export enum FclRequest {
  REQUEST_QRCODE = "request_qrcode",
  EXEC_SERVICE = "exec_service",
}

export type DiscoveryNotifications = {
  [DiscoveryNotification.NOTIFY_QRCODE_EXPIRY]: RpcNotification<{uri: string}>
  [DiscoveryNotification.NOTIFY_QRCODE_ERROR]: RpcNotification<{error: string}>
}

export type FclRequests = {
  [FclRequest.EXEC_SERVICE]: RpcRequest<{service: Service}, {}>
  [FclRequest.REQUEST_QRCODE]: RpcRequest<{service: Service}, {uri: string}>
}
