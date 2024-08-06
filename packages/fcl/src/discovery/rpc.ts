import {RpcClient, RpcNotification} from "@onflow/util-rpc"

export type DiscoveryRpc = RpcClient<{}, DiscoveryNotifications>

export enum DiscoveryNotification {
  NOTIFY_QRCODE_EXPIRY = "notifyQRCodeExpiry",
  NOTIFY_QRCODE_ERROR = "notifyQRCodeError",
}

export enum FclRequest {
  REQUEST_WALLETCONECT_QRCODE = "requestWalletConnectQRCode",
  EXEC_SERVICE = "execService",
}

export type DiscoveryNotifications = {
  [DiscoveryNotification.NOTIFY_QRCODE_EXPIRY]: RpcNotification<{uri: string}>
  [DiscoveryNotification.NOTIFY_QRCODE_ERROR]: RpcNotification<{error: string}>
}
