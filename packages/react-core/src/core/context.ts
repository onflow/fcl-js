import {createContext} from "react"
import type {FlowClient} from "../types"

// FlowConfig based on @onflow/fcl-core's FlowClientCoreConfig
// This matches the config structure used by both @onflow/fcl and @onflow/fcl-react-native
// All fields are optional since not all config is required for every use case
export type FlowConfig = {
  // Core network configuration
  accessNodeUrl?: string
  flowNetwork?: string
  flowJson?: Record<string, any>

  // Wallet/Discovery configuration
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  discoveryAuthnInclude?: string[]
  discoveryAuthnExclude?: string[]

  // Compute limit for transactions
  computeLimit?: number

  // App detail properties
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string

  // Service configuration
  serviceOpenIdScopes?: string[]

  // WalletConnect configuration (web-specific)
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

export const FlowConfigContext = createContext<FlowConfig>({})

export const FlowClientContext = createContext<FlowClient | null>(null)
