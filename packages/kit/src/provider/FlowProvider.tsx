import React, {useEffect, useState, PropsWithChildren} from "react"
import * as fcl from "@onflow/fcl"
import {FlowConfig, FlowConfigContext} from "../core/context"
import {QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClient"
import {deepEqual} from "../utils/deepEqual"

interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowJson?: Record<string, any>
}

const mappings: Array<{fcl: string; typed: keyof FlowConfig}> = [
  {fcl: "accessNode.api", typed: "accessNodeUrl"},
  {fcl: "app.detail.title", typed: "appDetailTitle"},
  {fcl: "app.detail.icon", typed: "appDetailIcon"},
  {fcl: "app.detail.description", typed: "appDetailDescription"},
  {fcl: "app.detail.url", typed: "appDetailUrl"},
  {fcl: "discovery.wallet", typed: "discoveryWallet"},
  {fcl: "discovery.wallet.method", typed: "discoveryWalletMethod"},
  {fcl: "fcl.limit", typed: "fclLimit"},
  {fcl: "flow.network", typed: "flowNetwork"},
  {fcl: "service.OpenID.scopes", typed: "serviceOpenIdScopes"},
  {fcl: "walletconnect.projectId", typed: "walletconnectProjectId"},
  {
    fcl: "walletconnect.disableNotifications",
    typed: "walletconnectDisableNotifications",
  },
]

// Generate mapping from typed keys to FCL keys.
const typedToFcl = mappings.reduce(
  (acc, mapping) => {
    acc[mapping.typed] = mapping.fcl
    return acc
  },
  {} as Record<keyof FlowConfig, string>
)

// Generate mapping from FCL keys to typed keys.
const fclToTyped = mappings.reduce(
  (acc, mapping) => {
    acc[mapping.fcl] = mapping.typed
    return acc
  },
  {} as Record<string, keyof FlowConfig>
)

/**
 * Converts the strictly typed config to FCL config keys.
 */
function convertTypedConfig(typedConfig: FlowConfig): Record<string, any> {
  const fclConfig: Record<string, any> = {}
  for (const key in typedConfig) {
    const value = typedConfig[key as keyof FlowConfig]
    if (value !== undefined) {
      const fclKey = typedToFcl[key as keyof FlowConfig]
      if (fclKey) {
        fclConfig[fclKey] = value
      }
    }
  }
  return fclConfig
}

/**
 * Converts the FCL configuration back to our strictly typed config.
 */
function mapConfig(original: Record<string, any>): FlowConfig {
  const mapped: FlowConfig = {}
  for (const [fclKey, value] of Object.entries(original)) {
    if (fclKey in fclToTyped) {
      mapped[fclToTyped[fclKey]] = value
    }
  }
  return mapped
}

export function FlowProvider({
  config: initialConfig = {},
  queryClient: _queryClient,
  flowJson,
  children,
}: PropsWithChildren<FlowProviderProps>) {
  const [queryClient, setQueryClient] = useState(
    _queryClient || new QueryClient()
  )
  const [flowConfig, setFlowConfig] = useState<FlowConfig | null>(null)
  const [isFlowJsonLoaded, setIsFlowJsonLoaded] = useState(false)

  useEffect(() => {
    const initializeFCL = async () => {
      try {
        if (Object.keys(initialConfig).length > 0) {
          const fclConfig = convertTypedConfig(initialConfig)
          if (flowJson) {
            await fcl.config(fclConfig).load({flowJSON: flowJson})
          } else {
            fcl.config(fclConfig)
          }
        } else if (flowJson) {
          await fcl.config().load({flowJSON: flowJson})
        }
        setIsFlowJsonLoaded(true)
      } catch (error) {
        setIsFlowJsonLoaded(true)
      }
    }

    initializeFCL()

    // Subscribe to FCL config changes and map them to our typed keys.
    const unsubscribe = fcl.config().subscribe(latest => {
      const newConfig = mapConfig(latest || {})
      setFlowConfig(prev => {
        if (prev && deepEqual(prev, newConfig)) {
          return prev
        }
        return newConfig
      })
    })

    return () => unsubscribe()
  }, [initialConfig, flowJson])

  useEffect(() => {
    setQueryClient(_queryClient || new QueryClient())
  }, [_queryClient])

  if (!flowConfig || !isFlowJsonLoaded) {
    return null
  }

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext.Provider value={flowConfig}>
        {children}
      </FlowConfigContext.Provider>
    </FlowQueryClientProvider>
  )
}
