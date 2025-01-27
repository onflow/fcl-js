import {ProviderRequest} from "../../types/provider"
import {eth_accounts} from "./handlers/eth-accounts"

const handlers = {
  eth_accounts,
}

export class RpcService {
  constructor() {}

  async request({method, params}: ProviderRequest): Promise<any> {
    switch (method) {
      case "eth_requestAccounts":
        throw new Error("Not implemented")
      default:
        throw new Error(`Method ${method} not supported`)
    }
  }
}
