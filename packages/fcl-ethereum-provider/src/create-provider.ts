import * as fcl from "@onflow/fcl"
import {Eip1193Provider} from "./types/provider"
import {Provider} from "./provider"
import {RpcController} from "./rpc/rpc-controller"
import {Service} from "@onflow/typedefs"

export function createProvider({
  user,
  service,
  gateway,
}: {
  user: typeof fcl.currentUser
  service?: Service
  gateway?: string
}): Eip1193Provider {
  const rpcService = new RpcControllers(user, gateway)
  const provider = new Provider(user, service, rpcService)
  return provider
}
