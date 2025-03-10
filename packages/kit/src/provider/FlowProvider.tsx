"use client"

import React, {useEffect, useState, PropsWithChildren} from "react"
import * as fcl from "@onflow/fcl"
import {FlowConfig, FlowConfigContext} from "../core/context"

interface FlowProviderProps {
  config?: FlowConfig
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
  flowJson,
  children,
}: PropsWithChildren<FlowProviderProps>) {
  const [flowConfig, setFlowConfig] = useState<FlowConfig>({})

  useEffect(() => {
    // If a typed config is provided, convert it to FCL config keys and initialize FCL config.
    if (Object.keys(initialConfig).length > 0) {
      const fclConfig = convertTypedConfig(initialConfig)
      fcl.config(fclConfig)
    }
    // Load flow.json if provided.
    if (flowJson) {
      fcl.config().load({flowJSON: flowJson})
    }
    // Subscribe to FCL config changes and map them to our typed keys.
    const unsubscribe = fcl.config().subscribe(latest => {
      setFlowConfig(mapConfig(latest || {}))
    })
    return () => unsubscribe()
  }, [initialConfig, flowJson])

  return (
    <FlowConfigContext.Provider value={flowConfig}>
      {children}
    </FlowConfigContext.Provider>
  )
}
