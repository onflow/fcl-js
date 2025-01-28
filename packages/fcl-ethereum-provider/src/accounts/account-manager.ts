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

export class AccountManager {
  private addressPromise: Promise<string | null> | null = null
  private subscribers = new Set<(coaAddress: string | null) => void>()

  constructor(private user: typeof fcl.currentUser) {
    let lastAddress: string | null = null
    this.user.subscribe((currentUser: CurrentUser) => {
      if (lastAddress !== currentUser.addr) {
        lastAddress = currentUser.addr || null
        this.updateAddress(currentUser.addr)
      }
    })
  }

  subscribe(callback: (coaAddress: string | null) => void) {
    this.subscribers.add(callback)

    return () => {
      this.subscribers.delete(callback)
    }
  }

  async sendTransaction({
    to,
    value,
    data,
    gasLimit,
    chainId,
  }: {
    to: string
    value: string
    data: string
    nonce: string
    gasLimit: string
    chainId: string
  }) {
    // Find the Flow network based on the chain ID
    const flowNetwork = Object.entries(FLOW_CHAINS).find(
      ([, chain]) => chain.eip155ChainId === parseInt(chainId)
    )?.[0] as FlowNetwork

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
        arg(gasLimit, t.UInt64),
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
    const evmTxHash = eventData.hash.reduce(
      (acc, val) => acc + parseInt(val, 16).toString(16).padStart(2, "0"),
      ""
    )

    return evmTxHash
  }

  private async updateAddress(addr?: string) {
    this.addressPromise = (async () => {
      const coaAddress = addr ? await this.getCoaAddress(addr) : null
      this.subscribers.forEach(subscriber => subscriber(coaAddress))
      return coaAddress
    }).call(this)

    return await this.addressPromise
  }

  private async getCoaAddress(flowAddress: string) {
    return flowAddress
  }

  /**
   * Get the COA address
   * @returns The COA address
   */
  async getAddress() {
    if (this.addressPromise === null) {
      this.addressPromise = this.updateAddress()
    }

    return await this.addressPromise
  }
}
