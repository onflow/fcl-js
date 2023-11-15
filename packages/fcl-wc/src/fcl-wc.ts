import * as fcl from "@onflow/fcl-core"
import SignClient from "@walletconnect/sign-client"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
export {getSdkError} from "@walletconnect/utils"
import {makeServicePlugin} from "./service"
import {setConfiguredNetwork} from "./utils"
import { CoreTypes } from "@walletconnect/types"

const DEFAULT_RELAY_URL = "wss://relay.walletconnect.com"
const DEFAULT_LOGGER = "debug"
let client: SignClient

interface IInitClientParams {
  projectId?: string,
  metadata?: CoreTypes.Metadata
}

const initClient = async ({projectId, metadata}: IInitClientParams) => {
  invariant(
    projectId != null,
    "FCL Wallet Connect Error: WalletConnect projectId is required"
  )
  try {
    client = await SignClient.init({
      logger: DEFAULT_LOGGER,
      relayUrl: DEFAULT_RELAY_URL,
      projectId: projectId,
      metadata: metadata,
    })
    return client
  } catch (error: any) {
    log({
      title: `${error.name} fcl-wc Init Client`,
      message: error.message,
      level: LEVELS.error,
    })
    throw error
  }
}

interface IInitParams {
  projectId?: string
  includeBaseWC?: boolean,
  wallets?: any[],
  pairingModalOverride?: any
  metadata?: CoreTypes.Metadata
  wcRequestHook?: any,
}

export const init = async ({
  projectId,
  metadata,
  includeBaseWC = false,
  wcRequestHook = null,
  pairingModalOverride = null,
  wallets = [],
}: IInitParams = {}) => {
  await setConfiguredNetwork()
  const _client = client ?? (await initClient({projectId, metadata}))
  const FclWcServicePlugin = await makeServicePlugin(_client, {
    projectId,
    includeBaseWC,
    wcRequestHook,
    pairingModalOverride,
    wallets,
  })
  fcl.discovery.authn.update()

  return {
    FclWcServicePlugin,
    client,
  }
}
