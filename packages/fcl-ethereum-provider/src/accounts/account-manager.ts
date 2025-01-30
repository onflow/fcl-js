import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"
import {
  ContractType,
  EVENT_IDENTIFIERS,
  EventType,
  FLOW_CHAINS,
  FLOW_CONTRACTS,
  FlowNetwork,
} from "../constants"
import {TransactionExecutedEvent} from "../types/events"
import {
  BehaviorSubject,
  distinctUntilChanged,
  fromPromise,
  map,
  Observable,
  skip,
  Subscribable,
  Subscription,
  switchMap,
  tap,
} from "../util/observable"

export class AccountManager implements Subscribable<string[]> {
  private user: typeof fcl.currentUser

  private $address: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null)

  private isLoading: boolean = true

  constructor(user: typeof fcl.currentUser) {
    this.user = user

    const $user = new Observable<CurrentUser>(subscriber => {
      return this.user.subscribe(subscriber) as Subscription
    })

    console.log("user", $user)

    // Bind $accounts to COA address
    $user
      .pipe(
        map(snapshot => {
          console.log("snapshot", snapshot)
          return snapshot.addr || null
        }),
        distinctUntilChanged,
        tap(() => (this.isLoading = true)),
        switchMap(addr =>
          fromPromise(
            (async () => {
              console.log("fetching COA from flow address", addr)
              if (!addr) {
                return null
              }
              console.log("fetching COA from flow address", addr)
              return this.fetchCOAFromFlowAddress(addr)
            })()
          )
        ),
        tap(() => (this.isLoading = false))
      )
      .subscribe(coaAddress => {
        console.log("setting COA address", coaAddress)
        this.$address.next(coaAddress)
      })
  }

  private async fetchCOAFromFlowAddress(flowAddr: string): Promise<string> {
    const cadenceScript = `
      import EVM

      access(all)
      fun main(address: Address): String? {
          if let coa = getAuthAccount(address)
              .storage
              .borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm) {
              return coa.address().toString()
          }
          return nil
      }
    `
    const response = await fcl.query({
      cadence: cadenceScript,
      args: (arg: typeof fcl.arg, t: typeof fcl.t) => [
        arg(flowAddr, t.Address),
      ],
    })

    if (!response) {
      throw new Error("COA account not found for the authenticated user")
    }
    return response as string
  }

  public async getCOAAddress(): Promise<string | null> {
    if (!this.isLoading) {
      return this.$address.getValue()
    }

    return new Promise<string | null>(resolve => {
      const sub = this.$address.pipe(skip(1)).subscribe(coaAddress => {
        if (coaAddress !== null) {
          sub()
          resolve(coaAddress)
        }
      })
    })
  }

  public async getAccounts(): Promise<string[]> {
    const coaAddress = await this.getCOAAddress()
    return coaAddress ? [coaAddress] : []
  }

  public subscribe(callback: (accounts: string[]) => void): Subscription {
    console.log("subscribing to COA address")
    return this.$address.subscribe((addr: string | null) => {
      callback(addr ? [addr] : [])
    })
  }

  async sendTransaction({
    to,
    from,
    value,
    data,
    gas,
    chainId,
  }: {
    to: string
    from: string
    value: string
    data: string
    gas: string
    chainId: string
  }) {
    // Find the Flow network based on the chain ID
    const flowNetwork = Object.entries(FLOW_CHAINS).find(
      ([, chain]) => chain.eip155ChainId === parseInt(chainId)
    )?.[0] as FlowNetwork | undefined

    if (!flowNetwork) {
      throw new Error("Flow network not found for chain ID")
    }

    const evmContractAddress = fcl.withPrefix(
      FLOW_CONTRACTS[ContractType.EVM][flowNetwork]
    )

    const txId = await fcl.mutate({
      cadence: `import EVM from ${evmContractAddress}
        
        /// Executes the calldata from the signer's COA
        ///
        transaction(evmContractAddressHex: String, calldata: String, gasLimit: UInt64, value: UInt256) {
        
            let evmAddress: EVM.EVMAddress
            let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount
        
            prepare(signer: auth(BorrowValue) &Account) {
                self.evmAddress = EVM.addressFromString(evmContractAddressHex)
        
                self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(from: /storage/evm)
                    ?? panic("Could not borrow COA from provided gateway address")
            }
        
            execute {
                let valueBalance = EVM.Balance(attoflow: value)
                let callResult = self.coa.call(
                    to: self.evmAddress,
                    data: calldata.decodeHex(),
                    gasLimit: gasLimit,
                    value: valueBalance
                )
                assert(callResult.status == EVM.Status.successful, message: "Call failed")
            }
        }`,
      limit: 9999,
      args: (arg: typeof fcl.arg, t: typeof fcl.t) => [
        arg(to, t.String),
        arg(data, t.String),
        arg(gas, t.UInt64),
        arg(value, t.UInt256),
      ],
      authz: this.user,
    })

    const result = await fcl.tx(txId).onceExecuted()
    const {events} = result

    const evmTxExecutedEvent = events.find(
      event =>
        event.type ===
        EVENT_IDENTIFIERS[EventType.TRANSACTION_EXECUTED][flowNetwork]
    )
    if (!evmTxExecutedEvent) {
      throw new Error("EVM transaction hash not found")
    }

    const eventData: TransactionExecutedEvent = evmTxExecutedEvent.data
    const evmTxHash = eventData.hash
      .map(h => parseInt(h, 16).toString().padStart(2, "0"))
      .join("")

    return evmTxHash
  }
}
