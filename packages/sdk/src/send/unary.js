import {grpc} from "@improbable-eng/grpc-web"
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport"

grpc.setDefaultTransport(NodeHttpTransport())

export async function unary(host, method, request) {
  return new Promise((resolve, reject) => {
    grpc.unary(method, {
      request: request,
      host: host,
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
