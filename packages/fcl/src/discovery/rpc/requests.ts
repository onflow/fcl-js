import {RpcClient, RpcNotification} from "@onflow/util-rpc"

export type DiscoveryRpc = RpcClient<{}, DiscoveryNotifications>

export enum DiscoveryNotification {
  NOTIFY_QRCODE_CONNECTING = "notifyQrCodeConnecting",
  NOTIFY_QRCODE_CONNECTED = "notifyQrCodeConnected",
  NOTIFY_QRCODE_ERROR = "notifyQrCodeError",
}

export enum FclRequest {
  REQUEST_WALLETCONNECT_QRCODE = "requestWalletConnectQrCode",
  EXEC_SERVICE = "execService",
}

export type DiscoveryNotifications = {
  [DiscoveryNotification.NOTIFY_QRCODE_CONNECTING]: RpcNotification<{
    uri: string
  }>
  [DiscoveryNotification.NOTIFY_QRCODE_CONNECTED]: RpcNotification<{
    uri: string
  }>
  [DiscoveryNotification.NOTIFY_QRCODE_ERROR]: RpcNotification<{
    uri: string
    error: string
  }>
}
