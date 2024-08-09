import {RpcClient} from "@onflow/util-rpc"
import {DiscoveryRpc, FclRequest} from "./requests"
import {execServiceHandlerFactory} from "./handlers/exec-service"
import {wcRequestHandlerFactory} from "./handlers/request-wc-qr"

// Initialize the discovery RPC client
export function createDiscoveryRpcClient({
  onExecResult,
  body,
  opts,
  args,
  abortSignal,
}: {
  onExecResult: (result: any) => void
  body: any
  opts: any
  args: any
  abortSignal: AbortSignal
}) {
  const rpc: DiscoveryRpc = new RpcClient({
    notifications: [],
  })

  rpc.on(
    FclRequest.REQUEST_WALLETCONNECT_QRCODE,
    wcRequestHandlerFactory({
      rpc,
      onExecResult,
      authnBody: body,
      abortSignal,
    })
  )
  rpc.on(
    FclRequest.EXEC_SERVICE,
    execServiceHandlerFactory({
      onExecResult,
      execStrategyOpts: opts,
      execStrategyArgs: args,
      abortSignal,
    })
  )

  return {
    connect: rpc.connect.bind(rpc),
    receive: rpc.receive.bind(rpc),
  }
}
