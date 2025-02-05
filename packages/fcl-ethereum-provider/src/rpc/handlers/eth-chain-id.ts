import {NetworkManager} from "../../network/network-manager"
import {formatChainId} from "../../util/eth"

export function ethChainId(networkManager: NetworkManager) {
  return async function () {
    const chainId = await networkManager.getChainId()
    if (!chainId) {
      throw new Error("No active chain")
    }
    return formatChainId(chainId)
  }
}
