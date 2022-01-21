import {invariant} from "@onflow/util-invariant"
import {grpc} from "@improbable-eng/grpc-web"
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport"

grpc.setDefaultTransport(NodeHttpTransport())

export async function unary(host, method, request, context) {
  invariant(context.config, `SDK GRPC Unary Error: context.config must be defined.`)
  const metadataFromConfig = await context.config().get("grpc.metadata", {})
  return new Promise((resolve, reject) => {
    grpc.unary(method, {
      request: request,
      host: host,
      metadata: new grpc.Metadata(metadataFromConfig),
      onEnd: ({status, statusMessage, message}) => {
        if (status === grpc.Code.OK) {
          resolve(message)
        } else {
          reject(new Error(statusMessage))
        }
      },
    })
  })
}
