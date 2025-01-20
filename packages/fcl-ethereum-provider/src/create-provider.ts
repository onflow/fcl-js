import * as fcl from "@onflow/fcl"
import {Eip1193Provider} from "./types/provider"
import {Provider} from "./provider"
import {RpcService} from "./services/rpc"
import {Service} from "@onflow/typedefs"

export function createProvider({
  user,
  service,
}: {
  user: typeof fcl.currentUser
  service?: Service
}): Eip1193Provider {
  const rpcService = new RpcService(user)
  const provider = new Provider(user, service, rpcService)
  return provider
}
