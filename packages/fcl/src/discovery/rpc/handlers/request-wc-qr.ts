import {
  createSessionProposal,
  FLOW_METHODS,
  getSignClient,
  request as wcRequest,
} from "@onflow/fcl-wc"
import {DiscoveryNotification, DiscoveryRpc} from "../requests"

// RPC handler for handling WalletConnect QR code requests
export const wcRequestHandlerFactory = ({
  rpc,
  onExecResult,
  authnBody,
  abortSignal,
}: {
  rpc: DiscoveryRpc
  onExecResult: (result: any) => void
  authnBody: any
  abortSignal: AbortSignal
}) => {
  const watchQr = watchQrFactory({
    rpc,
    authnBody,
  })

  return async ({}) => {
    if (abortSignal.aborted) {
      throw new Error("Handler has been terminated")
    }

    const client = await getSignClient()

    // Execute WC bypass if session is approved
    const {uri, approval} = await createSessionProposal({
      client,
    })

    // Watch for QR code connection asynchronously
    watchQr({
      uri,
      approval,
      onExecResult,
    })

    return {uri}
  }
}

export function watchQrFactory({
  rpc,
  authnBody,
}: {
  rpc: DiscoveryRpc
  authnBody: any
}) {
  return ({
    uri,
    approval,
    onExecResult,
  }: {
    uri: string
    onExecResult: (result: any) => void
    approval: any
  }) => {
    // Watch for QR code connection & resolve callback if connected
    setTimeout(async () => {
      try {
        const client = await getSignClient()
        const session = await approval()
        rpc.notify(DiscoveryNotification.NOTIFY_QRCODE_CONNECTING, {
          uri,
        })

        const result = await wcRequest({
          method: FLOW_METHODS.FLOW_AUTHN,
          body: authnBody,
          session,
          client,
        })

        rpc.notify(DiscoveryNotification.NOTIFY_QRCODE_CONNECTED, {
          uri,
        })
        onExecResult(result)
      } catch (e: any) {
        rpc.notify(DiscoveryNotification.NOTIFY_QRCODE_ERROR, {
          uri,
          error: e?.message,
        })
      }
    }, 0)
  }
}
