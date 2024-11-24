import * as fclCore from "@onflow/fcl-core"
import SignClient from "@walletconnect/sign-client"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
export {getSdkError} from "@walletconnect/utils"
import {makeServicePlugin} from "./service"
import {CoreTypes} from "@walletconnect/types"

export interface FclWalletConnectConfig {
  projectId: string
  metadata?: CoreTypes.Metadata
  includeBaseWC?: boolean
  wcRequestHook?: any
  pairingModalOverride?: any
  wallets?: any[]
  disableNotifications?: boolean
}

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"
let clientPromise: Promise<SignClient | null> = Promise.resolve(null)

const initClient = async ({
  projectId,
  metadata,
}: {
  projectId: string
  metadata?: CoreTypes.Metadata
}) => {
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
    if (error instanceof Error) {
      log({
        title: `${error.name} fcl-wc Init Client`,
        message: error.message,
        level: LEVELS.error,
      })
    }
    throw error
  }
}

export const initLazy = (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, clientPromise} = initHelper(config)
  fclCore.discovery.authn.update()

  return {
    FclWcServicePlugin,
    clientPromise,
  }
}

export const init = async (config: FclWalletConnectConfig) => {
  const {FclWcServicePlugin, clientPromise} = initLazy(config)
  const client = await clientPromise
  fclCore.discovery.authn.update()

  return {
    FclWcServicePlugin,
    client,
  }
}

const initHelper = (config: FclWalletConnectConfig) => {
  if (typeof window === "undefined") {
    throw new Error(
      "FCL Wallet Connect Plugin can only be initialized in the browser"
    )
  }

  // Lazy load the SignClient
  //  - Initialize the client if it doesn't exist
  //  - If it does exist, return existing client
  //  - If existing client fails to initialize, reinitialize
  clientPromise = Promise.resolve(clientPromise)
    .catch(() => null)
    .then(_client => {
      if (_client) {
        return _client
      } else {
        return initClient({
          projectId: config.projectId,
          metadata: config.metadata,
        })
      }
    })
    .catch(e => {
      log({
        title: `WalletConnect Client Initialization Error`,
        message: e.message ? e.message : e,
        level: LEVELS.error,
      })
      throw e
    })

  const FclWcServicePlugin = makeServicePlugin(clientPromise, config)

  return {
    FclWcServicePlugin,
    clientPromise,
  }
}

// Returns the SignClient instance used by this plugin if it has been initialized
export async function getSignClient() {
  return clientPromise.then(client => {
    if (!client) {
      throw new Error("WalletConnect client not initialized")
    }

    return client
  })
}

export {SERVICE_PLUGIN_NAME} from "./constants"
