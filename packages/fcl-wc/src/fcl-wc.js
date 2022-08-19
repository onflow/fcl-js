import SignClient from "@walletconnect/sign-client"
import {makeServicePlugin} from "./service"
export {getSdkError} from "@walletconnect/utils"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"
const DEFAULT_APP_METADATA = {
  name: "FCL WalletConnect",
  description: "FCL DApp for WalletConnect",
  url: "https://flow.com/",
  icons: ["https://avatars.githubusercontent.com/u/62387156?s=280&v=4"],
}

const initClient = async ({projectId, metadata}) => {
  invariant(
    projectId != null,
    "FCL Wallet Connect Error: WalletConnect projectId is required"
  )
  try {
    return SignClient.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: metadata || DEFAULT_APP_METADATA,
    })
  } catch (error) {
    log({
      title: `${error.name} fcl-wc Init Client`,
      message: error.message,
      level: 1,
    })
    throw error
  }
}

export const initFclWc = async ({projectId, metadata} = {}) => {
  const client = await initClient({projectId, metadata})
  const FclWcServicePlugin = makeServicePlugin(client)
  return {
    FclWcServicePlugin,
    client,
  }
}
