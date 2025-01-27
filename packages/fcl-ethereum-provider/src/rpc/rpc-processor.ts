import {ProviderRequest} from "../types/provider"
import {eth_accounts} from "./handlers/eth-accounts"
import {JsonRpcProvider} from "@walletconnect/jsonrpc-provider"
import HTTPConnection from "@walletconnect/jsonrpc-http-connection"
import * as fcl from "@onflow/fcl"
import {FLOW_CHAINS, FlowNetwork} from "../constants"
import {Gateway} from "../gateway/gateway"

const handlers = {
  eth_accounts,
}

export class RpcProcessor {
  private providers: {[chainId: number]: JsonRpcProvider} = {}

  constructor(private gateway: Gateway) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    switch (method) {
      case "eth_requestAccounts":
        throw new Error("Not implemented")
      default:
        return await this.gateway.request({method, params})
    }
  }
}
