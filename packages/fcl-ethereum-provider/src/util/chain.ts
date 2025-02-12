import {FLOW_CHAINS, FlowNetwork} from "../constants"

export function getFlowNetwork(chainId: number): FlowNetwork {
  const flowNetwork = Object.entries(FLOW_CHAINS).find(
    ([, chain]) => chain.eip155ChainId === chainId
  )?.[0] as FlowNetwork | undefined

  return flowNetwork
}
