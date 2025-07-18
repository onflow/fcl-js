import {
  createFlowClientCore,
  SdkTransport,
  StorageProvider,
} from "@onflow/fcl-core"
import {LOCAL_STORAGE} from "./fcl"
import {execStrategyHook} from "./discovery/exec-hook"

const PLATFORM = "web"

export const discoveryOpts = {
  execStrategy: execStrategyHook,
}

export interface FlowClientConfig {
  // Core network configuration (most commonly used)
  accessNodeUrl: string // Required - must specify which network to connect to
  flowNetwork?: string
  flowJson?: any

  // Wallet/Discovery configuration
  discoveryWallet?: string
  discoveryWalletMethod?: string

  // WalletConnect configuration
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean

  // Storage configuration
  storage?: StorageProvider

  // Advanced/SDK configuration (least commonly used)
  transport?: SdkTransport
  computeLimit?: number
  customResolver?: any
  customDecoders?: any
}

export function createFlowClient(params: FlowClientConfig) {
  const fclCore = createFlowClientCore({
    flowNetwork: params.flowNetwork,
    flowJson: params.flowJson,
    accessNodeUrl: params.accessNodeUrl,
    computeLimit: params.computeLimit || 9999,
    transport: params.transport,
    platform: PLATFORM,
    storage: params.storage || LOCAL_STORAGE,
    discovery: discoveryOpts,
    discoveryWalletMethod: params.discoveryWalletMethod || "IFRAME/RPC",
    customResolver: params.customResolver,
    customDecoders: params.customDecoders,
    discoveryWallet: params.discoveryWallet,
    walletconnectProjectId: params.walletconnectProjectId,
    walletconnectDisableNotifications: params.walletconnectDisableNotifications,
  })

  return {
    ...fclCore,
  }
}
