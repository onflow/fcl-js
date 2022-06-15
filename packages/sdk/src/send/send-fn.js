import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {send as defaultSendREST} from "@onflow/transport-http"
import {log} from "@onflow/util-logger"
//import {send as defaultSendGRPC} from "@onflow/transport-grpc"

function defaultSendGRPC() {
  console.log("SUP")
}

export async function sendFn(ix, context = {}, opts = {}) {
  const restNode = await config().get("accessNode.httpApi")
  const grpcNode = await config().get("accessNode.grpcApi")

  if (!restNode && !grpcNode) {
    opts.node = opts.node || (await config().get("accessNode.api"))
    log.deprecate({
      pkg: "FCL/SDK",
      subject:
        'Providing the access node endpoint via the "accessNode.api" configuration key',
      message:
        'Please provide either "accessNode.httpApi" or "accessNode.grpcApi" instead.',
      transition:
        "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0010-deprecate-accessNode-api",
    })
  } else {
    invariant(
      !(restNode && grpcNode),
      "One of either accessNode.httpApi or accessNode.grpcApi must be provided but not both"
    )
    opts.node = restNode || grpcNode
  }

  const sendFn = await config.first(
    ["sdk.transport", "sdk.send"],
    grpcNode ? defaultSendGRPC : defaultSendREST
  )

  return sendFn(ix, context, opts)
}
