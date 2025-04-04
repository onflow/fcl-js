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

// Map typed keys to FCL config keys
const typedToFcl = mappings.reduce(
  (acc, mapping) => {
    acc[mapping.typed] = mapping.fcl
    return acc
  },
  {} as Record<keyof FlowConfig, string>
)

// Map FCL config keys to typed keys
const fclToTyped = mappings.reduce(
  (acc, mapping) => {
    acc[mapping.fcl] = mapping.typed
    return acc
  },
  {} as Record<string, keyof FlowConfig>
)

/**
 * Converts typed config into FCL-style config.
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
 * Converts FCL-style config into typed config.
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

/**
 * Resolves once any `system.contracts.*` key exists in FCL config.
 * This is because flow.json needs to be set before any hooks are usable if addresses are required.
 */
function waitForSystemContractsViaSubscribe(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe()
      reject(new Error("Timed out waiting for system.contracts in config"))
    }, timeoutMs)

    const unsubscribe = fcl.config().subscribe(latest => {
      if (
        latest &&
        Object.keys(latest).some(k => k.startsWith("system.contracts."))
      ) {
        clearTimeout(timeout)
        unsubscribe()
        resolve()
      }
    })
  })
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
            await waitForSystemContractsViaSubscribe()
          } else {
            fcl.config(fclConfig)
          }
        } else if (flowJson) {
          await fcl.config().load({flowJSON: flowJson})
          await waitForSystemContractsViaSubscribe()
        }

        setIsFlowJsonLoaded(true)
      } catch (error) {
        setIsFlowJsonLoaded(true)
      }
    }

    initializeFCL()

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
