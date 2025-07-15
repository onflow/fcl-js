import {RpcClient, RpcNotification} from "@onflow/util-rpc"

export type DiscoveryRpc = RpcClient<{}, DiscoveryNotifications>

export const DiscoveryNotification = {
  NOTIFY_QRCODE_CONNECTING: "notifyQrCodeConnecting",
  NOTIFY_QRCODE_CONNECTED: "notifyQrCodeConnected",
  NOTIFY_QRCODE_ERROR: "notifyQrCodeError",
} as const

export type DiscoveryNotification =
  (typeof DiscoveryNotification)[keyof typeof DiscoveryNotification]

export const FclRequest = {
  REQUEST_WALLETCONNECT_QRCODE: "requestWalletConnectQrCode",
  EXEC_SERVICE: "execService",
} as const

export type FclRequest = (typeof FclRequest)[keyof typeof FclRequest]

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
