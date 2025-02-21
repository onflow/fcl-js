import {fclWagmiAdapter} from "@onflow/fcl-wagmi-adapter"
import {RainbowKitWalletConnectParameters, Wallet} from "@rainbow-me/rainbowkit"
import {createConnector} from "@wagmi/core"
import {getWalletConnectConnector} from "./get-wc-connector"
import {createStore} from "mipd"

const store = createStore()

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

  const getUri = (uri: string) => {
    return uri
  }

  return ({projectId}: DefaultWalletOptions): Wallet => ({
    id: uid ? `fcl-${uid}` : "fcl",
    name: name || "Cadence Wallet",
    iconUrl: iconUrl || FALLBACK_ICON,
    iconBackground: "#FFFFFF",
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
      mobile: "https://core.flow.com",
    },
    // Do not list RDNS here since Rainbowkit will discard the wallet
    // when conflicting with an injected wallet
    rdns: undefined,
    qrCode: {getUri},
    mobile: {getUri},
    createConnector: walletDetails => {
      const isFlowWalletInjected = rdns
        ? !!store.findProvider({rdns: rdns!})
        : false

      const newDetails = {
        ...walletDetails,
        ...((isFlowWalletInjected && {
          // This is a workaround due to an internal bug in RainbowKit where
          // wallets do not appear in the installed group.
          //
          // Only wallets that are derived from EIP-6963 injected providers will
          // formall appear in this group, however, this is not possible in our case
          // because we need a custom injected connector implementation.
          rkDetails: {
            ...walletDetails.rkDetails,
            groupIndex: -1,
            groupName: "Installed",
          },
        }) ??
          {}),
      }

      if (isMobile()) {
        return getWalletConnectConnector({
          projectId,
          walletConnectParameters: options.walletConnectParams,
        })(newDetails)
      } else {
        if (isFlowWalletInjected) {
          const connector = fclWagmiAdapter(options)
          return createConnector(config => {
            return {
              ...connector(config),
              ...newDetails,
            }
          })
        } else {
          return getWalletConnectConnector({
            projectId,
            walletConnectParameters: options.walletConnectParams,
          })(newDetails)
        }
      }
    },
  })
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
