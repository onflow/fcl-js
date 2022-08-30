import SignClient from "@walletconnect/sign-client"
import {makeServicePlugin} from "./service"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import * as fcl from "@onflow/fcl"
export {getSdkError} from "@walletconnect/utils"
import {config} from "@onflow/config"

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"
const DEFAULT_APP_METADATA = {
  name: "FCL WalletConnect",
  description: "FCL App with WalletConnect",
  url: "https://flow.com",
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

const updateFcl = async projectId => {
  await config().put("fcl.wc.projectId", projectId)
  fcl.discovery.authn.update()
}

export const init = async ({
  projectId,
  metadata,
  includeBaseWC = false,
  sessionRequestHook = null,
  wallets = [],
} = {}) => {
  const client = await initClient({projectId, metadata})
  const FclWcServicePlugin = await makeServicePlugin(client, {
    includeBaseWC,
    sessionRequestHook,
    wallets,
  })
  await updateFcl(projectId)
  return {
    FclWcServicePlugin,
    client,
  }
}
