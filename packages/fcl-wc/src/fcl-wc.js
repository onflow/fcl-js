import SignClient from "@walletconnect/sign-client"
import {makeServicePlugin} from "./service"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import * as fcl from "@onflow/fcl"
export {getSdkError} from "@walletconnect/utils"
import {setConfiguredNetwork} from "./utils"

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"

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
      metadata: metadata,
    })
  } catch (error) {
    log({
      title: `${error.name} fcl-wc Init Client`,
      message: error.message,
      level: LEVELS.error,
    })
    throw error
  }
}

export const init = async ({
  projectId,
  metadata,
  includeBaseWC = false,
  sessionRequestHook = null,
  wallets = [],
} = {}) => {
  const client = await initClient({projectId, metadata})
  await setConfiguredNetwork()
  const FclWcServicePlugin = await makeServicePlugin(client, {
    includeBaseWC,
    sessionRequestHook,
    wallets,
  })
  fcl.discovery.authn.update()

  return {
    FclWcServicePlugin,
    client,
  }
}
