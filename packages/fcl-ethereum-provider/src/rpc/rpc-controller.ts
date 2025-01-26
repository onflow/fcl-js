import {RpcRequest} from "../types/provider"
import * as fcl from "@onflow/fcl"
import {eth_requestAccounts} from "./handlers/eth-request-accounts"
import {eth_chainId} from "./handlers/eth-chain-id"

const handlers = {
  eth_requestAccounts,
  eth_chainId,
}

export class RpcController {
  constructor(
    private user: typeof fcl.currentUser,
    private gateway?: string
  ) {}

  async handleRequest({method, params}: RpcRequest): Promise<any> {
    switch (method) {
      case "eth_requestAccounts":
        throw new Error("Not implemented")
      default:
        throw new Error(`Method ${method} not supported`)
    }
  }
}
