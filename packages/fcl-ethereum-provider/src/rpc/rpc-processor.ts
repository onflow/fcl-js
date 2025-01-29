import {ProviderRequest} from "../types/provider"
import {ethAccounts} from "./handlers/eth-accounts"
import {JsonRpcProvider} from "@walletconnect/jsonrpc-provider"
import {Gateway} from "../gateway/gateway"
import {AccountManager} from "../accounts/account-manager"

export class RpcProcessor {
  constructor(
    private gateway: Gateway,
    private accountManager: AccountManager
  ) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    switch (method) {
      case "eth_accounts":
        return ethAccounts(this.accountManager)
      case "eth_requestAccounts":
        return ethRequestAccounts(this.accountManager)
      default:
        return await this.gateway.request({method, params})
    }
  }
}
