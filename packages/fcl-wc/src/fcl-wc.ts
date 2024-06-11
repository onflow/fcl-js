import * as fclCore from "@onflow/fcl-core"
import SignClient from "@walletconnect/sign-client"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
export {getSdkError} from "@walletconnect/utils"
import {makeServicePlugin} from "./service"
import {setConfiguredNetwork} from "./utils"
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
let client: SignClient | null = null

const getDefaultMetadata = async (): Promise<CoreTypes.Metadata> => {
  const appTitle = await fclCore.config().get<string>("app.detail.title")
  const appIcon = await fclCore.config().get<string>("app.detail.icon")

  return {
    name: appTitle ?? "A Flow dApp",
    description: "",
    url: window.location.origin,
    icons: appIcon ? [appIcon] : [],
  }
}

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
    // Assign default values to any missing metadata fields
    const resolvedMetadata = await getDefaultMetadata()
    Object.assign(resolvedMetadata, metadata)

    client = await SignClient.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: resolvedMetadata,
    })
    return client
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

export const init = async ({
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

  await setConfiguredNetwork()
  const _client = client ?? (await initClient({projectId, metadata}))
  const FclWcServicePlugin = await makeServicePlugin(_client, {
    projectId,
    includeBaseWC,
    wcRequestHook,
    pairingModalOverride,
    wallets,
  })
  fclCore.discovery.authn.update()

  return {
    FclWcServicePlugin,
    client,
  }
}
