import {
  type RainbowKitWalletConnectParameters,
  type Wallet,
} from "@rainbow-me/rainbowkit"
import {getWalletConnectConnector} from "./get-wc-connector"

export interface WalletConnectWalletOptions {
  projectId: string
  options?: RainbowKitWalletConnectParameters
}

export const walletConnectWallet = ({
  projectId,
  options,
}: WalletConnectWalletOptions): Wallet => {
  const getUri = (uri: string) => {
    console.log("uri", uri)
    return uri
  }

  return {
    id: "walletConnect",
    name: "WalletConnect",
    installed: undefined,
    iconUrl: async () => "",
    iconBackground: "#3b99fc",
    qrCode: {getUri},
    createConnector: getWalletConnectConnector({
      projectId,
      walletConnectParameters: options,
    }),
  }
}
