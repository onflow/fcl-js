import {createContext} from "react"

export type FlowConfig = {
  accessNodeUrl?: string
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  fclLimit?: number
  flowNetwork?: "emulator" | "testnet" | "mainnet"
  serviceOpenIdScopes?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

export const FlowConfigContext = createContext<FlowConfig>({})
