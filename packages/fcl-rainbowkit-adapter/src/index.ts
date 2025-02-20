import {fclWagmiAdapter} from "@onflow/fcl-wagmi-adapter"
import {Wallet} from "@rainbow-me/rainbowkit"
import {createConnector} from "@wagmi/core"

type FclConnectorOptions = Parameters<typeof fclWagmiAdapter>[0]

type DefaultWalletOptions = {
  projectId: string
}

const FALLBACK_ICON =
  "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg"

export const createFclConnector = (options: FclConnectorOptions) => {
  const uid = options.service?.uid
  const name = options.service?.provider?.name
  const iconUrl = options.service?.provider?.icon!

  return ({projectId}: DefaultWalletOptions): Wallet => ({
    id: uid ? `fcl-${uid}` : "fcl",
    name: name || "Cadence Wallet",
    iconUrl: iconUrl || FALLBACK_ICON,
    iconBackground: "#FFFFFF",
    createConnector: walletDetails => {
      const connector = fclWagmiAdapter(options)
      return createConnector(config => ({
        ...connector(config),
        ...walletDetails,
      }))
    },
  })
}

export * from "./wallets/wc-wallet"
export {flowWallet} from "./wallets/flow-wallet"
