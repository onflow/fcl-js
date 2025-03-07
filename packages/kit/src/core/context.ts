import {createContext} from "react"

export type FlowConfig = {
  accessNodeUrl?: string
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  challengeHandshake?: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  env?: "local" | "testnet" | "mainnet"
  fclLimit?: number
  flowNetwork?: "local" | "testnet" | "mainnet"
  serviceOpenIdScopes?: string[] // or string, depending on your usage
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

export const FlowConfigContext = createContext<FlowConfig>({})
