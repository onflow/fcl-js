import * as fcl from "@onflow/fcl"
import * as rlp from "@onflow/rlp"
import {
  CompositeSignature,
  CurrentUser,
  Service,
  FvmErrorCode,
} from "@onflow/typedefs"
import {
  EVENT_IDENTIFIERS,
  EventType,
  FLOW_CHAINS,
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
import {NetworkManager} from "../network/network-manager"
import {
  createCOATx,
  getCOAScript,
  getNonceScript,
  sendTransactionTx,
} from "../cadence"
import {TransactionError} from "@onflow/fcl"
import {displayErrorNotification} from "../notifications"
import {keccak_256} from "@noble/hashes/sha3"
import {bytesToHex, hexToBytes} from "@noble/hashes/utils"

// Helper function to convert a number or bigint to a Uint8Array (minimal byte representation)
function numberToUint8Array(value: number | bigint): Uint8Array {
  const big = typeof value === "bigint" ? value : BigInt(value)
  if (big === BigInt(0)) return new Uint8Array([])
  let hex = big.toString(16)
  if (hex.length % 2 !== 0) {
    hex = "0" + hex
  }
  return hexToBytes(hex)
}

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

  constructor(
    private user: typeof fcl.currentUser,
    private networkManager: NetworkManager,
    private service?: Service
  ) {
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
  }

  public async authenticate(): Promise<string[]> {
    await this.user.authenticate({service: this.service})
    return this.getAccounts().then(accounts => {
      return accounts
    })
  }

  public async unauthenticate(): Promise<void> {
    await this.user.unauthenticate()
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  private async waitForTxResult(
    txId: string,
    eventType: string,
    errorMsg: string = `${eventType} event not found`
  ): Promise<any> {
    const txResult = await fcl.tx(txId).onceExecuted()

    const event = txResult.events.find(e => e.type === eventType)
    if (!event) {
      throw new Error(errorMsg)
    }
    return event
  }

  private async fetchCOAFromFlowAddress(flowAddr: string): Promise<string> {
    const chainId = await this.networkManager.getChainId()
    if (!chainId) {
      throw new Error("No active chain")
    }

    return await fcl.query({
      cadence: getCOAScript(chainId),
      args: (arg: typeof fcl.arg, t: typeof fcl.t) => [
        arg(flowAddr, t.Address),
      ],
    })
  }

  public async getCOAAddress(): Promise<string | null> {
    const {address, error} = await firstValueFrom(
      this.$addressStore.pipe(filter(x => !x.isLoading))
    )
    if (error) {
      throw error
    }
    return address || null
  }

  public async getAccounts(): Promise<string[]> {
    const coaAddress = await this.getCOAAddress()
    return coaAddress ? [coaAddress] : []
  }

  /**
   * Get the COA address and create it if it doesn't exist
   */
  public async getAndCreateAccounts(chainId: number): Promise<string[]> {
    const accounts = await this.getAccounts()

    if (accounts.length === 0) {
      const coaAddress = await this.createCOA(chainId)
      return [coaAddress]
    }

    if (accounts.length === 0) {
      throw new Error("COA address is still missing after creation.")
    }

    return accounts
  }

  public async createCOA(chainId: number): Promise<string> {
    // Find the Flow network based on the chain ID
    const flowNetwork = Object.entries(FLOW_CHAINS).find(
      ([, chain]) => chain.eip155ChainId === chainId
    )?.[0] as FlowNetwork | undefined

    if (!flowNetwork) {
      throw new Error("Flow network not found for chain ID")
    }

    // Validate the chain ID
    const currentChainId = await this.networkManager.getChainId()
    if (chainId !== currentChainId) {
      throw new Error(
        `Chain ID does not match the current network. Expected: ${currentChainId}, Received: ${chainId}`
      )
    }

    const txId = await fcl.mutate({
      cadence: createCOATx(chainId),
      limit: 9999,
      authz: this.user,
    })

    const txResult = await fcl.tx(txId).onceExecuted()

    if (txResult.statusCode == 0) {
      const txErr = TransactionError.fromErrorMessage(txResult.errorMessage)

      if (txErr && txErr.code === FvmErrorCode.STORAGE_CAPACITY_EXCEEDED) {
        displayErrorNotification(
          "Storage Error",
          "Your wallet does not have enough funds to cover storage costs. Please add more funds."
        )

        throw new Error("Insufficient funds to cover storage costs.")
      }

      throw new Error(`Transaction failed: ${txErr.message}`)
    }

    const event = await this.waitForTxResult(
      txId,
      EVENT_IDENTIFIERS[EventType.CADENCE_OWNED_ACCOUNT_CREATED][flowNetwork],
      "Failed to create COA: COACreated event not found"
    )

    const coaAddress = event.data.address
    if (!coaAddress) {
      throw new Error("COA created event did not include an address")
    }

    this.$addressStore.next({
      isLoading: false,
      address: coaAddress,
      error: null,
    })

    return coaAddress
  }

  public subscribe(callback: (accounts: string[]) => void): Subscription {
    return this.$addressStore
      .pipe(filter(x => !x.isLoading && !x.error))
      .subscribe(({address}) => {
        callback(address ? [address] : [])
      })
  }

  /**
   * Fetch the current nonce from the EVM contract via a Cadence script.
   */
  private async getNonce(evmAddress: string): Promise<string> {
    const chainId = await this.networkManager.getChainId()

    if (!chainId) {
      throw new Error("No active chain")
    }

    const nonce = await fcl.query({
      cadence: getNonceScript(chainId),
      args: (arg, t) => [arg(evmAddress, t.String)],
    })

    return nonce.toString()
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
    const parsedChainId = parseInt(chainId)
    const flowNetwork = Object.entries(FLOW_CHAINS).find(
      ([, chain]) => chain.eip155ChainId === parsedChainId
    )?.[0] as FlowNetwork | undefined

    if (!flowNetwork) {
      throw new Error("Flow network not found for chain ID")
    }

    // Validate the chain ID
    const currentChainId = await this.networkManager.getChainId()
    if (parsedChainId !== currentChainId) {
      throw new Error(
        `Chain ID does not match the current network. Expected: ${currentChainId}, Received: ${parsedChainId}`
      )
    }

    // Check if the from address matches the authenticated COA address
    const expectedCOAAddress = await this.getCOAAddress();
    if (fcl.sansPrefix(from).toLowerCase() !== fcl.sansPrefix(expectedCOAAddress)?.toLowerCase()) {
      throw new Error(
        `From address does not match authenticated user address.\nUser: ${expectedCOAAddress}\nFrom: ${from}`
      );
    }

    // ----- Pre-calculate the transaction hash -----
    const evmAddress = fcl.sansPrefix(expectedCOAAddress!).toLowerCase()
    const nonceStr = await this.getNonce(evmAddress)
    const nonce = parseInt(nonceStr, 10)

    const gasLimit = BigInt(gas)

    const valueHex = fcl.sansPrefix(value)
    const txValue = BigInt("0x" + valueHex)

    const dataHex = fcl.sansPrefix(data)

    const gasPrice = BigInt(0)
    const directCallTxType = BigInt(255)
    const contractCallSubType = BigInt(5)

    // Build the transaction fields array, converting numbers/bigints using numberToUint8Array
    const txArray = [
      numberToUint8Array(nonce),
      numberToUint8Array(gasPrice),
      numberToUint8Array(gasLimit),
      hexToBytes(fcl.sansPrefix(to)),
      numberToUint8Array(txValue),
      hexToBytes(dataHex),
      numberToUint8Array(directCallTxType),
      numberToUint8Array(BigInt(fcl.withPrefix(evmAddress))),
      numberToUint8Array(contractCallSubType),
    ]

    const encodedTx = rlp.encode(txArray)
    const digest = keccak_256(encodedTx)
    const preCalculatedTxHash = fcl.withPrefix(bytesToHex(digest))
    // ----- End pre-calculation -----

    await fcl.mutate({
      cadence: sendTransactionTx(parsedChainId),
      limit: 9999,
      args: (arg: typeof fcl.arg, t: typeof fcl.t) => [
        arg(to, t.String),
        arg(data, t.String),
        arg(gas, t.UInt64),
        arg(value, t.UInt256),
      ],
      authz: this.user,
    })

    return preCalculatedTxHash
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

    if (fcl.sansPrefix(from).toLowerCase() !== fcl.sansPrefix(coaAddress).toLowerCase()) {
      throw new Error("Signer address does not match authenticated COA address");
    }

    try {
      const response: CompositeSignature[] =
        await this.user.signUserMessage(message)

      if (!response || response.length === 0) {
        throw new Error("Failed to sign message")
      }

      const keyIndices = response.map(sig => sig.keyId)
      const signatures = response.map(sig => sig.signature)

      const addressHexArray = Buffer.from(fcl.sansPrefix(from), "hex")

      const capabilityPath = "/public/evm"

      const rlpEncodedProof = rlp
        .encode([keyIndices, addressHexArray, capabilityPath, signatures])
        .toString("hex")

      return fcl.withPrefix(rlpEncodedProof)
    } catch (error) {
      throw error
    }
  }
}
