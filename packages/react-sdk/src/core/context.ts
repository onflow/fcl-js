import {createContext} from "react"
import {FlowNetwork} from "./types"
import {createFlowClient} from "@onflow/fcl"

export type FlowConfig = {
  accessNodeUrl?: string
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  computeLimit?: number
  flowNetwork?: FlowNetwork
  serviceOpenIdScopes?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

export const FlowConfigContext = createContext<FlowConfig>({})

export const FlowClientContext = createContext<ReturnType<
  typeof createFlowClient
> | null>(null)
