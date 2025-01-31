import {ProviderRequest} from "../types/provider"
import {ethAccounts, ethRequestAccounts} from "./handlers/eth-accounts"
import {Gateway} from "../gateway/gateway"
import {AccountManager} from "../accounts/account-manager"
import {ethSendTransaction} from "./handlers/eth-send-transaction"
import {NetworkManager} from "../network/network"
import {personalSign} from "./handlers/personal-sign"
import {PersonalSignParams} from "../types/eth"

export class RpcProcessor {
  constructor(
    private gateway: Gateway,
    private accountManager: AccountManager,
    private networkManager: NetworkManager
  ) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    const chainId = await this.networkManager.getChainId()
    if (!chainId) {
      throw new Error("No active chain")
    }

    switch (method) {
      case "eth_accounts":
        return ethAccounts(this.accountManager)
      case "eth_requestAccounts":
        return ethRequestAccounts(this.accountManager)
      case "eth_sendTransaction":
        return await ethSendTransaction(this.accountManager, params)
      case "personal_sign":
        return await personalSign(
          this.accountManager,
          params as PersonalSignParams
        )
      default:
        return await this.gateway.request({
          chainId,
          method,
          params,
        })
    }
  }
}
