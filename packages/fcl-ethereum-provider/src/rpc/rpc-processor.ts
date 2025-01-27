import {ProviderRequest} from "../types/provider"
import {ethAccounts} from "./handlers/eth-accounts"
import {AccountManager} from "../accounts/account-manager"

export class RpcProcessor {
  constructor(private accountManager: AccountManager) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    switch (method) {
      case "eth_accounts":
        return ethAccounts(this.accountManager)
      case "eth_requestAccounts":
        throw new Error("Not implemented")
      default:
        throw new Error(`Method ${method} not supported`)
    }
  }
}
