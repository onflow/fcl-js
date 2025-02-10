import {AccountManager} from "../accounts/account-manager"
import {FLOW_CHAINS} from "../constants"
import {NetworkManager} from "../network/network-manager"
import {Gateway} from "./gateway/gateway"
import {RpcProcessor} from "./processor/rpc-processor"

export function createRpcController(
  accountManager: AccountManager,
  networkManager: NetworkManager,
  rpcUrls?: {[chainId: number]: string}
) {
  const defaultRpcUrls = Object.values(FLOW_CHAINS).reduce(
    (acc, chain) => {
      acc[chain.eip155ChainId] = chain.publicRpcUrl
      return acc
    },
    {} as {[chainId: number]: string}
  )

  const gateway = new Gateway({
    ...defaultRpcUrls,
    ...(rpcUrls || {}),
  })
  const processor = new RpcProcessor(gateway, accountManager, networkManager)
  return processor
}
