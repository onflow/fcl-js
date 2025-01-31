import {FLOW_CHAINS, FlowNetwork} from "../constants"
import {
  BehaviorSubject,
  fromPromise,
  Observer,
  Subscription,
  switchMap,
  tap,
} from "../util/observable"
import * as fcl from "@onflow/fcl"

export class NetworkManager {
  private $network: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null)
  private isLoading: boolean = true

  constructor(config: typeof fcl.config) {
    // Map FCL config to behavior subject
    const $config = new BehaviorSubject<Record<string, unknown> | null>(null)
    config.subscribe(cfg => {
      $config.next(cfg)
    })

    // Bind $network to chainId
    $config
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(cfg =>
          fromPromise(
            (async () => {
              const accessNode = cfg?.["accessNode.api"]
              const flowNetwork = (await fcl.getChainId({
                node: accessNode,
              })) as FlowNetwork
              const {eip155ChainId: chainId} = FLOW_CHAINS[flowNetwork]
              return chainId
            })()
          )
        ),
        tap(() => (this.isLoading = false))
      )
      .subscribe(chainId => {
        this.$network.next(chainId)
      })
  }

  subscribe(callback: (chainId: number | null) => void): Subscription {
    return this.$network.subscribe(callback)
  }

  async getChainId(): Promise<number | null> {
    if (!this.isLoading) {
      return this.$network.getValue()
    }

    return new Promise<number | null>(resolve => {
      const sub = this.$network.subscribe(chainId => {
        if (chainId !== null) {
          sub()
          resolve(chainId)
        }
      })
    })
  }
}
