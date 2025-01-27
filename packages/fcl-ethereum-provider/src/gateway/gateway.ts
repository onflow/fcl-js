import HTTPConnection from "@walletconnect/jsonrpc-http-connection"
import * as fcl from "@onflow/fcl"
import {JsonRpcProvider} from "@walletconnect/jsonrpc-provider"
import {FLOW_CHAINS, FlowNetwork} from "../constants"

export class Gateway {
  private providers: {[chainId: number]: JsonRpcProvider} = {}

  constructor(private rpcUrls: {[chainId: number]: string}) {}

  async request({method, params}: {method: string; params: any}) {
    return this.getProvider().then(provider =>
      provider.request({method, params})
    )
  }

  private async getProvider(): Promise<JsonRpcProvider> {
    const flowChainId = await fcl.getChainId()
    if (!(flowChainId in FLOW_CHAINS)) {
      throw new Error(`Unsupported chainId ${flowChainId}`)
    }

    const {eip155ChainId} = FLOW_CHAINS[flowChainId as FlowNetwork]
    if (this.providers[eip155ChainId]) {
      return this.providers[eip155ChainId]
    }

    const rpcUrl =
      this.rpcUrls[eip155ChainId] ||
      FLOW_CHAINS[flowChainId as FlowNetwork].publicRpcUrl
    const provider = new JsonRpcProvider(new HTTPConnection(rpcUrl))
    this.providers[eip155ChainId] = provider
    return provider
  }
}
