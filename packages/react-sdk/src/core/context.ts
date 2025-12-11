import {createContext} from "react"
import {FlowNetwork} from "./types"
import {createFlowClient} from "@onflow/fcl"
import type {PaymentsClient} from "@onflow/payments"

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
  discoveryAuthnInclude?: string[]
  discoveryAuthnExclude?: string[]
  flowNetwork?: FlowNetwork
  serviceOpenIdScopes?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
}

export const FlowConfigContext = createContext<FlowConfig>({})

export const FlowClientContext = createContext<ReturnType<
  typeof createFlowClient
> | null>(null)

export const PaymentsClientContext = createContext<PaymentsClient | undefined>(
  undefined
)
