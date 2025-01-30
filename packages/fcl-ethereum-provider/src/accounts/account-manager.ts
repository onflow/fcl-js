import * as fcl from "@onflow/fcl"
import {CompositeSignature, CurrentUser} from "@onflow/typedefs"
import {
  ContractType,
  EVENT_IDENTIFIERS,
  EventType,
  FLOW_CHAINS,
  FLOW_CONTRACTS,
  FlowNetwork,
} from "../constants"
import {TransactionExecutedEvent} from "../types/events"
import {EthSignatureResponse} from "../types/eth"

export class AccountManager {
  private user: typeof fcl.currentUser

  // For race-condition checks:
  private currentFetchId = 0

  // Track the last Flow address we fetched for
  private lastFlowAddr: string | null = null

  // The COA address (or null if none/not fetched)
  private coaAddress: string | null = null

  constructor(user: typeof fcl.currentUser) {
    this.user = user
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

  public async updateCOAAddress(force = false): Promise<void> {
    const snapshot = await this.user.snapshot()
    const currentFlowAddr = snapshot?.addr

    // If user not logged in, reset everything
    if (!currentFlowAddr) {
      this.lastFlowAddr = null
      this.coaAddress = null
      return
    }

    const userChanged = this.lastFlowAddr !== currentFlowAddr
    if (force || userChanged) {
      this.lastFlowAddr = currentFlowAddr
      const fetchId = ++this.currentFetchId

      try {
        const address = await this.fetchCOAFromFlowAddress(currentFlowAddr)
        // Only update if this fetch is still the latest
        if (fetchId === this.currentFetchId) {
          this.coaAddress = address
        }
      } catch (error) {
        // If this fetch is the latest, clear
        if (fetchId === this.currentFetchId) {
          this.coaAddress = null
        }
        throw error
      }
    }
  }

  public getCOAAddress(): string | null {
    return this.coaAddress
  }

  public getAccounts(): string[] {
    return this.coaAddress ? [this.coaAddress] : []
  }

  public subscribe(callback: (accounts: string[]) => void): () => void {
    const unsubscribe = this.user.subscribe(async (snapshot: CurrentUser) => {
      if (!snapshot.addr) {
        this.lastFlowAddr = null
        this.coaAddress = null
        callback(this.getAccounts())
        return
      }

      await this.updateCOAAddress()
      callback(this.getAccounts())
    }) as () => void

    return unsubscribe
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

  public async signMessage(message: string, expectedAddress: string): Promise<EthSignatureResponse> {
    const snapshot = await this.user.snapshot()
    const authenticatedAddress = snapshot?.addr

    if (!authenticatedAddress) {
      throw new Error("User is not authenticated")
    }

    if (expectedAddress.toLowerCase() !== authenticatedAddress.toLowerCase()) {
      throw new Error("Signer address does not match authenticated user")
    }

    // Convert message to hex format (Ethereum expects hex)
    const hexMessage = Buffer.from(message, "utf8").toString("hex")

    try {
      const response: CompositeSignature[] = await user.signUserMessage(hexMessage)

      if (!response || response.length === 0) {
        throw new Error("Failed to sign message")
      }

      return response[0].signature
    } catch (error) {
      console.error("Error signing message:", error)
      throw error
    }
  }
}
