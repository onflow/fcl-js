import * as fcl from "@onflow/fcl"
import {Eip1193Provider} from "./types/provider"
import {FclEthereumProvider} from "./provider"
import {RpcController} from "./rpc/rpc-controller"
import {Service} from "@onflow/typedefs"
import {EventService} from "./events/event-service"

export function createProvider({
  user,
  service,
  gateway,
}: {
  user: typeof fcl.currentUser
  service?: Service
  gateway?: string
}): Eip1193Provider {
  const rpcController = new RpcController(user, gateway)
  const eventService = new EventService(user)
  const provider = new FclEthereumProvider(rpcController, eventService)
  return provider
}
