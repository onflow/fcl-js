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
      iconUrl:
        "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg",
      iconBackground: "#FFFFFF",
      downloadUrls: {
        browserExtension:
          "https://chrome.google.com/webstore/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
        mobile: "https://core.flow.com",
      },
    },
  })
