import {fclWagmiAdapter} from "@onflow/fcl-wagmi-adapter"
import {
  RainbowKitWalletConnectParameters,
  Wallet,
  WalletDetailsParams,
} from "@rainbow-me/rainbowkit"
import {createConnector, CreateConnectorFn} from "@wagmi/core"
import * as mipd from "mipd"
import {getWalletConnectConnector} from "./get-wc-connector"
import {Service} from "@onflow/typedefs"
import * as fcl from "@onflow/fcl"

const store = mipd.createStore()

type FclConnectorOptions = {
  user?: typeof fcl.currentUser
  config?: typeof fcl.config
  rpcUrls?: {[chainId: number]: string}
  walletConnectParams?: RainbowKitWalletConnectParameters
  walletDetails: Omit<Wallet, "createConnector">
  services?: Service[]
}

type DefaultWalletOptions = {
  projectId: string
}

const FALLBACK_ICON =
  "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"

export const createFclConnector = (options: FclConnectorOptions) => {
  return ({projectId}: DefaultWalletOptions): Wallet => {
    const rdns = options.walletDetails.rdns

    const obj: Wallet = {
      ...options.walletDetails,
      // Do not list RDNS here since Rainbowkit will discard the wallet
      // when conflicting with an injected wallet
      rdns: undefined,
      createConnector: walletDetails => {
        return createConnector(config => {
          const originalDetails = {...walletDetails.rkDetails}
          let currentHandler: any
          let currentDetails = walletDetails.rkDetails
          let isInstalled = false

          // Initialize the primary connector (e.g. anything other than WalletConnect)
          const primaryService = options.services?.find(
            service => service.method !== "WC/RPC"
          )
          let primaryConnector = {
            ...fclWagmiAdapter({
              user: options.user || fcl.currentUser,
              config: options.config || fcl.config,
              service: primaryService,
              rdns: rdns,
              rpcUrls: options.rpcUrls,
            })(config),
            ...walletDetails,
          }
          primaryConnector.setup?.().catch(e => {
            console.error("Failed to setup installed connector", e)
          })

          // Initialize the WalletConnect connector
          let supportsWc = options.services?.some(
            service => service.method === "WC/RPC"
          )
          let walletConnectConnector = supportsWc
            ? getWalletConnectConnector({
                projectId,
                walletConnectParameters: options.walletConnectParams,
              })({
                ...walletDetails,
              })(config)
            : null
          walletConnectConnector?.setup?.().catch(e => {
            console.error("Failed to setup installed connector", e)
          })

          // Update connectors and subscribe to changes (used for dynamic switching)
          updateConnectors()
          store.subscribe(() => {
            updateConnectors()
          })

          /**
           * This is a workaround for Flow Wallet which has a race condition where the MIPD
           * provider is not immediately available.  We instead proxy the Wagmi connector
           * such that we can dynmaically switch between the installed and WalletConnect
           * connectors.
           *
           * It's pretty brittle and should be removed ASAP once Flow Wallet is fixed.
           * (e.g. there's no teardown logic when switching between connectors)
           */
          return {
            ...primaryConnector,
            ...walletDetails,
            async getProvider(params) {
              return currentHandler.getProvider(params)
            },
            async connect(params) {
              return currentHandler.connect(params)
            },
            async disconnect() {
              return currentHandler.disconnect()
            },
            async getAccounts() {
              return currentHandler.getAccounts()
            },
            async getChainId() {
              return currentHandler.getChainId()
            },
            async isAuthorized() {
              return currentHandler.isAuthorized()
            },
            async switchChain(params) {
              return currentHandler.switchChain?.(params)
            },
            async getClient() {
              return currentHandler.getClient?.()
            },
            rkDetails: currentDetails,
          } as ReturnType<CreateConnectorFn>

          // Update the connectors based on the current state
          function updateConnectors() {
            isInstalled =
              (rdns &&
                !!store.findProvider({
                  rdns: rdns,
                })) ||
              false

            let rkDetails: WalletDetailsParams["rkDetails"]
            if (isInstalled || !walletConnectConnector) {
              rkDetails = {
                ...originalDetails,
                groupIndex: -1,
                groupName: "Installed",
                installed: true,
              }
            } else {
              const getUri = (uri: string) => {
                return uri
              }

              rkDetails = {
                ...originalDetails,
                qrCode: {getUri},
                mobile: {getUri},
                installed: undefined,
              }
            }

            // Reset the rainbowkit details (used for UI config specific to connector)
            Object.keys(currentDetails).forEach(
              key => delete (currentDetails as any)[key]
            )
            Object.assign(currentDetails, rkDetails)

            // Update the current handler (i.e. the proxied connector which is actually active)
            const _currentHandler = isInstalled
              ? primaryConnector
              : walletConnectConnector

            if (!_currentHandler) {
              throw new Error("No handler found")
            }

            currentHandler = {
              getProvider: _currentHandler.getProvider.bind(_currentHandler),
              connect: _currentHandler.connect.bind(_currentHandler),
              disconnect: _currentHandler.disconnect.bind(_currentHandler),
              getAccounts: _currentHandler.getAccounts.bind(_currentHandler),
              getChainId: _currentHandler.getChainId.bind(_currentHandler),
              isAuthorized: _currentHandler.isAuthorized.bind(_currentHandler),
              switchChain: _currentHandler.switchChain?.bind(_currentHandler),
              getClient: _currentHandler.getClient?.bind(_currentHandler),
            }
          }
        })
      },
    }

    return obj
  }
}
