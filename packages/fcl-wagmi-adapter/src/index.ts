import {
  ChainNotConfiguredError,
  type Connector,
  createConnector,
} from "@wagmi/core"
import {
  type AddEthereumChainParameter,
  type Address,
  type Hex,
  type ProviderConnectInfo,
  ProviderDisconnectedError,
  type ProviderRpcError,
  type RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getAddress,
  hexToNumber,
  numberToHex,
  withRetry,
} from "viem"
import {createProvider} from "@onflow/fcl-ethereum-provider"

type FclWagmiAdapterParams = Parameters<typeof createProvider>[0]

export function fclWagmiAdapter(params: FclWagmiAdapterParams) {
  type Provider = ReturnType<typeof createProvider>
  type Properties = {
    onConnect(connectInfo: ProviderConnectInfo): void
    onDisplayUri(uri: string): void
  }
  let provider: Provider | undefined

  let accountsChanged: Connector["onAccountsChanged"] | undefined
  let chainChanged: Connector["onChainChanged"] | undefined
  let connect: Connector["onConnect"] | undefined
  let displayUri: ((uri: string) => void) | undefined
  let disconnect: (({reason}: {reason: string}) => void) | undefined

  // Parse and validate service parameters
  const id = params.service?.uid || "fcl"
  const name = params.service?.provider?.name || "Cadence Wallet"

  return createConnector<Provider, Properties>(config => ({
    id: id,
    name: name,
    type: "fcl-wagmi-adapter",
    async setup() {
      const provider = await this.getProvider()

      if (provider?.on) {
        if (!connect) {
          connect = this.onConnect.bind(this)
          provider.on("connect", connect)
        }

        // We shouldn't need to listen for `'accountsChanged'` here since the `'connect'` event should suffice (and wallet shouldn't be connected yet).
        // Some wallets, like MetaMask, do not implement the `'connect'` event and overload `'accountsChanged'` instead.
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on("accountsChanged", accountsChanged)
        }
      }
    },
    async connect({chainId, isReconnecting}: any = {}) {
      const provider = await this.getProvider()
      if (!displayUri) {
        displayUri = this.onDisplayUri
        provider.on("display_uri", displayUri)
      }

      let accounts: readonly Address[] = await provider.request({
        method: "eth_requestAccounts",
      })

      if (isReconnecting) accounts = await this.getAccounts()

      // Manage EIP-1193 event listeners
      // https://eips.ethereum.org/EIPS/eip-1193#events
      if (connect) {
        provider.removeListener("connect", connect)
        connect = undefined
      }
      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this)
        provider.on("accountsChanged", accountsChanged)
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this)
        provider.on("chainChanged", chainChanged)
      }
      if (!disconnect) {
        disconnect = (({reason}) => {
          throw new ProviderDisconnectedError(new Error(reason))
        }) as ({reason}: {reason: string}) => void
        provider.on("disconnect", disconnect)
      }

      return {accounts, chainId}
    },
    async disconnect() {
      const provider = await this.getProvider()

      // Manage EIP-1193 event listeners
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged)
        chainChanged = undefined
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect)
        disconnect = undefined
      }
      if (!connect) {
        connect = this.onConnect.bind(this)
        provider.on("connect", connect)
      }

      await provider.disconnect()
    },
    async getAccounts() {
      const provider = await this.getProvider()
      const accounts = (await provider.request({
        method: "eth_accounts",
      })) as string[]
      return accounts.map(x => getAddress(x))
    },
    async getChainId() {
      const provider = await this.getProvider()
      const chainId = await provider?.request({method: "eth_chainId"})
      return Number(chainId)
    },
    async getProvider() {
      return provider ?? (provider = createProvider(params))
    },
    async isAuthorized() {
      // TODO: There may be an issue here if a user without a COA refreshes the page
      // We should instead be checking whether FCL itself is authorized
      const accounts = await this.getAccounts()
      return accounts.length > 0
    },
    async switchChain({addEthereumChainParameter, chainId}: any) {
      const provider = await this.getProvider()

      const chain = config.chains.find(x => x.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId: numberToHex(chainId)}],
        })

        // During `'wallet_switchEthereumChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
        // If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
        // To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
        // this callback or an externally emitted `'chainChanged'` event.
        // https://github.com/MetaMask/metamask-extension/issues/24247
        await waitForChainIdToSync()
        await sendAndWaitForChangeEvent(chainId)

        return chain
      } catch (err) {
        const error = err as RpcError

        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error)

        // Indicates chain is not added to provider
        if (
          error.code === 4902 ||
          // Unwrapping for MetaMask Mobile
          // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
          (error as ProviderRpcError<{originalError?: {code: number}}>)?.data
            ?.originalError?.code === 4902
        ) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  blockExplorerUrls: (() => {
                    const {default: blockExplorer, ...blockExplorers} =
                      chain.blockExplorers ?? {}
                    if (addEthereumChainParameter?.blockExplorerUrls)
                      return addEthereumChainParameter.blockExplorerUrls
                    if (blockExplorer)
                      return [
                        blockExplorer.url,
                        ...Object.values(blockExplorers).map(x => x.url),
                      ]
                    return
                  })(),
                  chainId: numberToHex(chainId),
                  chainName: addEthereumChainParameter?.chainName ?? chain.name,
                  iconUrls: addEthereumChainParameter?.iconUrls,
                  nativeCurrency:
                    addEthereumChainParameter?.nativeCurrency ??
                    chain.nativeCurrency,
                  rpcUrls: (() => {
                    if (addEthereumChainParameter?.rpcUrls?.length)
                      return addEthereumChainParameter.rpcUrls
                    return [chain.rpcUrls.default?.http[0] ?? ""]
                  })(),
                } satisfies AddEthereumChainParameter,
              ],
            })

            await waitForChainIdToSync()
            await sendAndWaitForChangeEvent(chainId)

            return chain
          } catch (err) {
            const error = err as RpcError
            if (error.code === UserRejectedRequestError.code)
              throw new UserRejectedRequestError(error)
            throw new SwitchChainError(error)
          }
        }

        throw new SwitchChainError(error)
      }

      async function waitForChainIdToSync() {
        // On mobile, there is a race condition between the result of `'wallet_addEthereumChain'` and `'eth_chainId'`.
        // To avoid this, we wait for `'eth_chainId'` to return the expected chain ID with a retry loop.
        await withRetry(
          async () => {
            const value = hexToNumber(
              // `'eth_chainId'` is cached by the MetaMask SDK side to avoid unnecessary deeplinks
              (await provider.request({method: "eth_chainId"})) as Hex
            )
            // `value` doesn't match expected `chainId`, throw to trigger retry
            if (value !== chainId)
              throw new Error("User rejected switch after adding network.")
            return value
          },
          {
            delay: 50,
            retryCount: 20, // android device encryption is slower
          }
        )
      }

      async function sendAndWaitForChangeEvent(chainId: number) {
        await new Promise<void>(resolve => {
          const listener = (data => {
            if ("chainId" in data && data.chainId === chainId) {
              config.emitter.off("change", listener)
              resolve()
            }
          }) satisfies Parameters<typeof config.emitter.on>[1]
          config.emitter.on("change", listener)
          config.emitter.emit("change", {chainId})
        })
      }
    },
    onAccountsChanged(accounts: any) {
      if (accounts.length === 0) this.onDisconnect()
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x: any) => getAddress(x)),
        })
    },
    onChainChanged(chain: any) {
      const chainId = Number(chain)
      config.emitter.emit("change", {chainId})
    },
    async onConnect(connectInfo: any) {
      const accounts = await this.getAccounts()

      // TODO: What to do if accounts is empty? not sure this is accurate
      if (accounts.length === 0) return

      const chainId = Number(connectInfo.chainId)
      config.emitter.emit("connect", {accounts, chainId})

      const provider = await this.getProvider()
      if (connect) {
        provider.removeListener("connect", connect)
        connect = undefined
      }
      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this)
        provider.on("accountsChanged", accountsChanged)
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this)
        provider.on("chainChanged", chainChanged)
      }
      if (!disconnect) {
        disconnect = (({reason}) => {
          throw new ProviderDisconnectedError(new Error(reason))
        }) as ({reason}: {reason: string}) => void
        provider.on("disconnect", disconnect)
      }
    },
    // TODO: waht to do with error?
    async onDisconnect(error: any) {
      const provider = await this.getProvider()

      config.emitter.emit("disconnect")

      // Manage EIP-1193 event listeners
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged)
        chainChanged = undefined
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect)
        disconnect = undefined
      }
      if (!connect) {
        connect = this.onConnect.bind(this)
        provider.on("connect", connect)
      }
    },
    onDisplayUri(uri: string) {
      config.emitter.emit("message", {type: "display_uri", data: uri})
    },
  }))
}
