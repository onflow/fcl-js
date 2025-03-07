import {Service} from "@onflow/typedefs"
import {createFclConnector} from "../create-connector"
import * as fcl from "@onflow/fcl"

/**
 * Create a connector for the Flow Wallet (currently only supports the extension)
 * @param params
 * @returns
 */
export const flowWallet = (params: {
  user: typeof fcl.currentUser
  config: typeof fcl.config
}) =>
  createFclConnector({
    user: params.user || fcl.currentUser,
    config: params.config || fcl.config,
    services: [
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        uid: "fcw#authn",
        endpoint:
          "chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html",
        method: "EXT/RPC",
        provider: {},
        params: {},
      },
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: "https://fcw-link.lilico.app/wc",
        endpoint: "flow_authn",
        provider: {},
        params: {},
      },
    ],
    walletDetails: {
      id: "flow-wallet",
      name: "Flow Wallet",
      iconUrl: "https://lilico.app/logo_mobile.png",
      iconBackground: "#FFFFFF",
      downloadUrls: {
        android:
          "https://play.google.com/store/apps/details?id=com.flowfoundation.wallet",
        ios: "https://apps.apple.com/ca/app/flow-wallet-nfts-and-crypto/id6478996750",
        chrome:
          "https://chromewebstore.google.com/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
        qrCode: "https://link.lilico.app",
      },
      mobile: {
        getUri: (uri: string) => `fcw://${uri}`,
      },
      qrCode: {
        getUri: (uri: string) => uri,
        instructions: {
          learnMoreUrl: "https://wallet.flow.com",
          steps: [
            {
              description:
                "We recommend putting Flow Wallet on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open the Flow Wallet app",
            },
            {
              description:
                "You can find the scan button on the home page. A connection prompt will appear, allowing you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
      extension: {
        instructions: {
          learnMoreUrl: "https://wallet.flow.com",
          steps: [
            {
              description:
                "We recommend pinning Flow Wallet to your taskbar for quicker access to your wallet.",
              step: "install",
              title: "Install the Flow Wallet extension",
            },
            {
              description:
                "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
              step: "create",
              title: "Create or Import a Wallet",
            },
            {
              description:
                "Once you set up your wallet, click below to refresh the browser and load up the extension.",
              step: "refresh",
              title: "Refresh your browser",
            },
          ],
        },
      },
      rdns: "com.flowfoundation.wallet",
    },
  })
