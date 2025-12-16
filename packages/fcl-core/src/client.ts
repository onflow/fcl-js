import {httpTransport} from "@onflow/transport-http"
import {createVerifyUserSignatures} from "./app-utils/verify-signatures"
import {createFCLContext} from "./context/index"
import {createMutate} from "./exec/mutate"
import {createQuery} from "./exec/query"
import {createQueryRaw} from "./exec/query-raw"
import {createTransaction} from "./transaction"
import {createEvents} from "./events"
import {createGetChainId} from "./utils"
import {createSerialize} from "./serialize"
import {SdkTransport} from "@onflow/typedefs"
import {StorageProvider} from "./fcl-core"

export interface FlowClientCoreConfig {
  // Core network configuration (most commonly used)
  accessNodeUrl: string
  flowNetwork?: string
  flowJson?: Record<string, any>

  // Wallet/Discovery configuration
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  discoveryAuthnInclude?: string[]
  discoveryAuthnExclude?: string[]

  // Compute limit for transactions
  computeLimit: number

  // Storage configuration
  storage: StorageProvider

  // Platform configuration
  platform: string

  // Discovery configuration
  discovery?: {
    execStrategy?: (opts: any) => Promise<any>
  }

  // App detail properties
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string

  // Service configuration
  serviceOpenIdScopes?: string[]

  // Advanced/SDK configuration (least commonly used)
  transport?: SdkTransport
  customResolver?: any
  customDecoders?: any
}

export function createFlowClientCore(params: FlowClientCoreConfig) {
  const context = createFCLContext({
    ...params,
    transport: params.transport || httpTransport,
  })

  return {
    // Global services
    currentUser: context.currentUser,

    // Execution methods
    mutate: createMutate(context),
    query: createQuery(context),
    queryRaw: createQueryRaw(context),
    verifyUserSignatures: createVerifyUserSignatures(context),
    getChainId: createGetChainId(context),

    // Streaming helpers
    tx: createTransaction(context),
    events: createEvents(context),

    // Authentication methods
    authenticate: context.currentUser.authenticate,
    unauthenticate: context.currentUser.unauthenticate,
    signUserMessage: context.currentUser.signUserMessage,

    // Utility methods
    serialize: createSerialize(context),

    // Re-export the SDK methods
    ...context.sdk,
  }
}

export type FlowClientCore = ReturnType<typeof createFlowClientCore>
