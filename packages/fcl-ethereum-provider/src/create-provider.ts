import * as fcl from "@onflow/fcl"
import {Eip1193Provider} from "./types/provider"
import {FclEthereumProvider} from "./provider"
import {Service} from "@onflow/typedefs"
import {EventDispatcher} from "./events/event-dispatcher"
import {AccountManager} from "./accounts/account-manager"
import {NetworkManager} from "./network/network-manager"
import {createRpcController} from "./rpc/rpc"

/**
 * Create a new FCL Ethereum provider
 * @param config - Configuration object
 * @param config.user - The current user
 * @param config.service - The service
 * @param config.gateway - The gateway
 * @returns The provider
 * @public
 * @example
 * ```javascript
 * import {createProvider} from "@onflow/fcl-ethereum-provider"
 *
 * const provider = createProvider({
 *  user: fcl.currentUser,
 *  service: fcl.service,
 *  gateway: "http://localhost:8080",
 * })
 * ```
 */
export function createProvider(config: {
  user: typeof fcl.currentUser
  config: typeof fcl.config
  service?: Service
  rpcUrls?: {[chainId: string]: string}
}): Eip1193Provider {
  const networkManager = new NetworkManager(config.config)
  const accountManager = new AccountManager(
    config.user,
    networkManager,
    config.service
  )
  const rpcProcessor = createRpcController(
    accountManager,
    networkManager,
    config.rpcUrls
  )
  const eventProcessor = new EventDispatcher(accountManager, networkManager)
  const provider = new FclEthereumProvider(
    accountManager,
    rpcProcessor,
    eventProcessor
  )

  return provider
}
