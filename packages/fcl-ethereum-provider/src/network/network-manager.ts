import {ACCESS_NODE_API_KEY, FLOW_CHAINS, FlowNetwork} from "../constants"
import {
  BehaviorSubject,
  concat,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  of,
  Subscription,
  switchMap,
} from "../util/observable"
import * as fcl from "@onflow/fcl"

type ChainIdStore = {
  isLoading: boolean
  chainId: number | null
  error: unknown | null
}
export class NetworkManager {
  private $chainIdStore = new BehaviorSubject<ChainIdStore>({
    isLoading: true,
    chainId: null,
    error: null,
  })

  constructor(config: typeof fcl.config) {
    // Map FCL config to behavior subject
    const $config = new BehaviorSubject<Record<string, unknown> | null>(null)
    config.subscribe((cfg, err) => {
      if (err) {
        $config.error(err)
      } else {
        $config.next(cfg)
      }
    })

    // Bind $network to chainId
    $config
      .pipe(
        distinctUntilChanged(),
        switchMap(cfg =>
          concat(
            of({isLoading: true} as ChainIdStore),
            from(
              (async () => {
                try {
                  const accessNode = cfg?.[ACCESS_NODE_API_KEY]
                  const flowNetwork = (await fcl.getChainId({
                    node: accessNode,
                  })) as FlowNetwork
                  if (!(flowNetwork in FLOW_CHAINS)) {
                    throw new Error("Unknown network")
                  }
                  const {eip155ChainId: chainId} = FLOW_CHAINS[flowNetwork]
                  return {isLoading: false, chainId, error: null}
                } catch (error) {
                  return {isLoading: false, chainId: null, error}
                }
              })()
            )
          )
        )
      )
      .subscribe(this.$chainIdStore)
  }

  public subscribe(callback: (chainId: number | null) => void): Subscription {
    return this.$chainIdStore
      .pipe(
        filter(x => !x.isLoading && !x.error),
        map(x => x.chainId)
      )
      .subscribe(callback)
  }

  public async getChainId(): Promise<number | null> {
    const {chainId, error} = await firstValueFrom(
      this.$chainIdStore.pipe(filter(x => !x.isLoading))
    )

    if (error) {
      throw error
    }
    return chainId
  }
}
