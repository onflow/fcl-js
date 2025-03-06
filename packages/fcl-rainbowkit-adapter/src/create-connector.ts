import {fclWagmiAdapter} from "@onflow/fcl-wagmi-adapter"
import {
  RainbowKitWalletConnectParameters,
  Wallet,
  WalletDetailsParams,
} from "@rainbow-me/rainbowkit"
import {createConnector, CreateConnectorFn} from "@wagmi/core"
import * as mipd from "mipd"
import {getWalletConnectConnector} from "./get-wc-connector"

const store = mipd.createStore()

type FclConnectorOptions = Parameters<typeof fclWagmiAdapter>[0] & {
  supportsWc?: boolean
  walletConnectParams?: RainbowKitWalletConnectParameters
}

type DefaultWalletOptions = {
  projectId: string
}

const FALLBACK_ICON =
  "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"

export const createFclConnector = (options: FclConnectorOptions) => {
  const uid = options.service?.uid
  const name = options.service?.provider?.name
  const iconUrl = options.service?.provider?.icon ?? ""
  const rdns = (options.service?.provider as any)?.rdns as string | undefined

  return ({projectId}: DefaultWalletOptions): Wallet => {
    const obj: Wallet = {
      id: uid ? `fcl-${uid}` : "fcl",
      name: name || "Cadence Wallet",
      iconUrl: iconUrl || FALLBACK_ICON,
      iconBackground: "#FFFFFF",
      downloadUrls: {
        browserExtension:
          "https://chrome.google.com/webstore/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
        mobile: "https://core.flow.com",
      },
      // Do not list RDNS here since Rainbowkit will discard the wallet
      // when conflicting with an injected wallet
      rdns: undefined,
      createConnector: walletDetails => {
        return createConnector(config => {
          const originalDetails = {...walletDetails.rkDetails}
          let currentHandlers
          let currentDetails = walletDetails.rkDetails
          let isInstalled = false

          let installedConnector = {
            ...fclWagmiAdapter(options)(config),
            ...walletDetails,
          }
          installedConnector.setup?.().catch(e => {
            console.error("Failed to setup installed connector", e)
          })

          let walletConnectConnector = getWalletConnectConnector({
            projectId,
            walletConnectParameters: options.walletConnectParams,
          })({
            ...walletDetails,
          })(config)
          walletConnectConnector.setup?.().catch(e => {
            console.error("Failed to setup installed connector", e)
          })

          function getCurrentConnector() {
            return isInstalled ? installedConnector : walletConnectConnector
          }

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
            ...installedConnector,
            ...walletDetails,
            async getProvider(params) {
              return getCurrentConnector().getProvider(params)
            },
            async connect(params) {
              return getCurrentConnector().connect(params)
            },
            async disconnect() {
              return getCurrentConnector().disconnect()
            },
            async getAccounts() {
              return getCurrentConnector().getAccounts()
            },
            async getChainId() {
              return getCurrentConnector().getChainId()
            },
            async isAuthorized() {
              return getCurrentConnector().isAuthorized()
            },
            async switchChain(params) {
              return getCurrentConnector().switchChain?.(params)
            },
            async getClient() {
              return getCurrentConnector().getClient?.()
            },
            rkDetails: currentDetails,
          } as ReturnType<CreateConnectorFn>

          function getCurrentHandlers(test?: boolean) {
            const currentConnector =
              isInstalled && !test ? installedConnector : walletConnectConnector

            return {
              // Do not include setup() since we call it manually
              getProvider: currentConnector.getProvider.bind(currentConnector),
              connect: currentConnector.connect.bind(currentConnector),
              disconnect: currentConnector.disconnect.bind(currentConnector),
              getAccounts: currentConnector.getAccounts.bind(currentConnector),
              getChainId: currentConnector.getChainId.bind(currentConnector),
              isAuthorized:
                currentConnector.isAuthorized.bind(currentConnector),
              switchChain: currentConnector.switchChain?.bind(currentConnector),
              getClient: currentConnector.getClient?.bind(currentConnector),
            } as Pick<
              ReturnType<CreateConnectorFn>,
              | "getProvider"
              | "connect"
              | "disconnect"
              | "getAccounts"
              | "getChainId"
              | "isAuthorized"
              | "switchChain"
              | "getClient"
            >
          }

          // Flow Wallet currently has a race condition where MIPD
          function updateConnectors() {
            // TODO: logic when rdns is undefined
            isInstalled = rdns
              ? !!store.findProvider({
                  rdns: rdns,
                })
              : true

            let rkDetails: WalletDetailsParams["rkDetails"]
            if (isInstalled) {
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

            // Update the connector
            currentHandlers = getCurrentHandlers()
          }
        })
      },
    }

    return obj
  }
}
