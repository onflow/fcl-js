import {ProviderRequest} from "../types/provider"
import {ethAccounts, ethRequestAccounts} from "./handlers/eth-accounts"
import {AccountManager} from "../accounts/account-manager"

export class RpcProcessor {
  constructor(private accountManager: AccountManager) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    switch (method) {
      case "eth_accounts":
        return ethAccounts(this.accountManager)
      case "eth_requestAccounts":
        return ethRequestAccounts(this.accountManager)
      default:
        throw new Error(`Method ${method} not supported`)
    }
  }
}
