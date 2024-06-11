import * as fclCore from "@onflow/fcl-core"
import SignClient from "@walletconnect/sign-client"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
export {getSdkError} from "@walletconnect/utils"
import {SERVICE_PLUGIN_NAME, makeServicePlugin} from "./service"
import {CoreTypes} from "@walletconnect/types"

export interface FclWalletConnectConfig {
  projectId: string
  metadata?: CoreTypes.Metadata
  includeBaseWC?: boolean
  wcRequestHook?: any
  pairingModalOverride?: any
  wallets?: any[]
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

const initHelper = ({
  projectId,
  metadata,
  includeBaseWC = false,
  wcRequestHook = null,
  pairingModalOverride = null,
  wallets = [],
}: FclWalletConnectConfig) => {
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
        return initClient({projectId, metadata})
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

  const FclWcServicePlugin = makeServicePlugin(clientPromise, {
    projectId,
    includeBaseWC,
    wcRequestHook,
    pairingModalOverride,
    wallets,
  })

  return {
    FclWcServicePlugin,
    clientPromise,
  }
}

export {SERVICE_PLUGIN_NAME}
