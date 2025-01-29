import {FLOW_CHAINS, FlowNetwork} from "../constants"
import {
  BehaviorSubject,
  Subscribable,
  Subscriber,
  Subscription,
} from "../util/observable"
import * as fcl from "@onflow/fcl"

// TODO RACE CONDITIONS IN INITIAL VALUE
export class NetworkManager implements Subscribable<string> {
  private subject: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(0)

  constructor(config: typeof fcl.config) {
    config.subscribe(async cfg => {
      const accessNode = cfg?.["accessNode.api"]
      const flowNetwork = (await fcl.getChainId({
        node: accessNode,
      })) as FlowNetwork
      const {eip155ChainId: chainId} = FLOW_CHAINS[flowNetwork]
      this.subject.next(chainId)
    })
  }

  get chainId(): string {
    return this._chainId
  }

  subscribe(observer: Subscriber<string>): Subscription {
    return this.subject.subscribe(chainId => {
        this._chainId = chainId.toString()
        observer(this._chainId)
        }
  }
}
