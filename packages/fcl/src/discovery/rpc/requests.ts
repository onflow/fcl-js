import {RpcClient, RpcNotification} from "@onflow/util-rpc"

export type DiscoveryRpc = RpcClient<{}, DiscoveryNotifications>

export enum DiscoveryNotification {
  NOTIFY_QRCODE_ERROR = "notifyQRCodeError",
  NOTIFY_QRCODE_CONNECTED = "notifyQRCodeConnected",
}

export enum FclRequest {
  REQUEST_WALLETCONNECT_QRCODE = "requestWalletConnectQRCode",
  EXEC_SERVICE = "execService",
}

export type DiscoveryNotifications = {
  [DiscoveryNotification.NOTIFY_QRCODE_ERROR]: RpcNotification<{
    uri: string
    error: string
  }>
  [DiscoveryNotification.NOTIFY_QRCODE_CONNECTED]: RpcNotification<{
    uri: string
  }>
}
