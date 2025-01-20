import {RpcRequest} from "../types/provider"
import * as fcl from "@onflow/fcl"

export class RpcService {
  constructor(private user: typeof fcl.currentUser) {}

  async handleRequest({method, params}: RpcRequest): Promise<any> {
    return Promise.resolve({jsonrpc: "2.0", result: null, id: null})
  }
}
