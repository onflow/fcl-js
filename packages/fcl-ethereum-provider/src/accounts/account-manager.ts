import * as fcl from "@onflow/fcl"
import * as rlp from "@onflow/rlp"
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
import {
  BehaviorSubject,
  concat,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from "../util/observable"
import {EthSignatureResponse} from "../types/eth"

export class AccountManager {
  private $addressStore = new BehaviorSubject<{
    isLoading: boolean
    address: string | null
    error: Error | null
  }>({
    isLoading: true,
    address: null,
    error: null,
  })

  private ethereumDisconnectHandler?: (...args: any[]) => void

  constructor(private user: typeof fcl.currentUser) {
    // Create an observable from the user
    const $user = new Observable<CurrentUser>(subscriber => {
      return this.user.subscribe((currentUser: CurrentUser, error?: Error) => {
        if (error) {
          subscriber.error?.(error)
        } else {
          subscriber.next(currentUser)
        }
      }) as Subscription
    })

    // Bind the address store to the user observable
    $user
      .pipe(
        map(snapshot => snapshot.addr || null),
        distinctUntilChanged(),
        switchMap(addr =>
          concat(
            of({isLoading: true} as {
              isLoading: boolean
              address: string | null
              error: Error | null
            }),
            from(
              (async () => {
                try {
                  if (!addr) {
                    return {isLoading: false, address: null, error: null}
                  }
                  return {
                    isLoading: false,
                    address: await this.fetchCOAFromFlowAddress(addr),
                    error: null,
                  }
                } catch (error: any) {
                  return {isLoading: false, address: null, error}
                }
              })()
            )
          )
        )
      )
      .subscribe(this.$addressStore)

    this.setupEthereumListeners()
  }

  private setupEthereumListeners() {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereum = window.ethereum

      if (typeof ethereum.on === "function") {
        this.ethereumDisconnectHandler = () => {
          this.destroy();
        };

        ethereum.on("disconnect", this.ethereumDisconnectHandler)
      }
    }
  }

  public destroy() {
    if (typeof window !== "undefined" && window.ethereum && this.ethereumDisconnectHandler) {
      window.ethereum.removeListener("disconnect", this.ethereumDisconnectHandler)
      this.ethereumDisconnectHandler = undefined
    }

    this.$addressStore.next({
      isLoading: false,
      address: null,
      error: new Error("Ethereum provider disconnected"),
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
    const {address, error} = await firstValueFrom(
      this.$addressStore.pipe(filter(x => !x.isLoading))
    )
    if (error) {
      throw error
    }
    return address
  }

  public async getAccounts(): Promise<string[]> {
    const coaAddress = await this.getCOAAddress()
    return coaAddress ? [coaAddress] : []
  }

  public subscribe(callback: (accounts: string[]) => void): Subscription {
    return this.$addressStore
      .pipe(filter(x => !x.isLoading && !x.error))
      .subscribe(({address}) => {
        callback(address ? [address] : [])
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

    // Check if the from address matches the authenticated COA address
    const expectedCOAAddress = await this.getCOAAddress()
    if (from.toLowerCase() !== expectedCOAAddress?.toLowerCase()) {
      throw new Error(
        `From address does not match authenticated user address.\nUser: ${expectedCOAAddress}\nFrom: ${from}`
      )
    }

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

  public async signMessage(
    message: string,
    from: string
  ): Promise<EthSignatureResponse> {
    const coaAddress = await this.getCOAAddress()
    if (!coaAddress) {
      throw new Error(
        "COA address is not available. User might not be authenticated."
      )
    }

    if (from.toLowerCase() !== coaAddress.toLowerCase()) {
      throw new Error("Signer address does not match authenticated COA address")
    }

    try {
      const response: CompositeSignature[] =
        await this.user.signUserMessage(message)

      if (!response || response.length === 0) {
        throw new Error("Failed to sign message")
      }

      const keyIndices = response.map(sig => sig.keyId)
      const signatures = response.map(sig => sig.signature)

      const addressHexArray = Buffer.from(from.replace(/^0x/, ""), "hex")

      const capabilityPath = "/public/evm"

      const rlpEncodedProof = rlp
        .encode([keyIndices, addressHexArray, capabilityPath, signatures])
        .toString("hex")

      return rlpEncodedProof.startsWith("0x")
        ? rlpEncodedProof
        : `0x${rlpEncodedProof}` // Return 0x-prefix for Ethereum compatibility
    } catch (error) {
      throw error
    }
  }
}
