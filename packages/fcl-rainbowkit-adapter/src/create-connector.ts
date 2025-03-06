import {fclWagmiAdapter} from "@onflow/fcl-wagmi-adapter"
import {
  RainbowKitWalletConnectParameters,
  Wallet,
  WalletDetailsParams,
} from "@rainbow-me/rainbowkit"
import {createConnector} from "@wagmi/core"
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
          let currentDetails = walletDetails.rkDetails
          let isInstalled = false

          let installedConnector = {
            ...fclWagmiAdapter(options)(config),
            ...walletDetails,
            rkDetails: currentDetails,
          }
          let walletConnectConnector = getWalletConnectConnector({
            projectId,
            walletConnectParameters: options.walletConnectParams,
          })({
            ...walletDetails,
            rkDetails: currentDetails,
          })(config)

          updateConnectors()
          store.subscribe(updateConnectors)

          function getCurrent() {
            return isInstalled ? installedConnector : walletConnectConnector
          }

          // TODO: THIS IS A HACK
          return {
            ...installedConnector,
            async getProvider() {
              return getCurrent().getProvider()
            },
            async connect(params) {
              return getCurrent().connect(params)
            },
            async disconnect() {
              return getCurrent().disconnect()
            },
            async getAccounts() {
              return getCurrent().getAccounts()
            },
            async getChainId() {
              return getCurrent().getChainId()
            },
            async isAuthorized() {
              return getCurrent().isAuthorized()
            },
            /*async switchChain(params) {
              return getCurrent().switchChain?.(params)
            },
            async getClient(params) {
              return getCurrent().getClient?.(params)
            },*/
            async setup() {
              return getCurrent().setup!()
            },
            ...walletDetails,
          }

          // Flow Wallet currently has a race condition where MIPD
          function updateConnectors() {
            // TODO: logic when rdns is undefined
            isInstalled = rdns
              ? !!store.findProvider({
                  rdns: rdns,
                })
              : true

            // TODO? seems weird currying
            let rkDetails: WalletDetailsParams["rkDetails"]
            if (isInstalled) {
              rkDetails = {
                ...walletDetails.rkDetails,
                groupIndex: -1,
                groupName: "Installed",
                installed: true,
              }
            } else {
              const getUri = (uri: string) => {
                return uri
              }

              rkDetails = {
                ...walletDetails.rkDetails,
                qrCode: {getUri},
                mobile: {getUri},
                installed: undefined,
              }
            }

            // Remove all properties from target
            Object.keys(currentDetails).forEach(
              key => delete (currentDetails as any)[key]
            )

            // Copy properties from source to target
            Object.assign(currentDetails, rkDetails)
          }
        })
      },
    }

    return obj
  }
}
