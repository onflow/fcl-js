import React, { useEffect, useState, PropsWithChildren } from "react"
import * as fcl from "@onflow/fcl"
import { FlowConfig, FlowConfigContext } from "../core/context"

interface FlowProviderProps {
  config?: Record<string, any>
  flowJson?: Record<string, any>
}

const keyMapping: Record<string, keyof FlowConfig> = {
  "accessNode.api": "accesNodeApi",
  "app.detail.title": "appDetailTitle",
  "app.detail.icon": "appDetailIcon",
  "app.detail.description": "appDetailDescription",
  "app.detail.url": "appDetailUrl",
  "challenge.handshake": "challengeHandshake",
  "discovery.wallet": "discoveryWallet",
  "discovery.wallet.method": "discoveryWalletMethod",
  "env": "env",
  "fcl.limit": "fclLimit",
  "flow.network": "flowNetwork",
  "service.OpenID.scopes": "serviceOpenIdScopes",
  "walletconnect.projectId": "walletconnectProjectId",
  "walletconnect.disableNotifications": "walletconnectDisableNotifications",
}

function mapConfig(original: Record<string, any>): FlowConfig {
  const mapped: FlowConfig = {}
  for (const [key, value] of Object.entries(original)) {
    if (keyMapping[key]) {
      mapped[keyMapping[key]] = value
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
    // Set initial FCL config
    if (Object.keys(initialConfig).length > 0) {
      fcl.config(initialConfig)
    }
    // Load flow.json if provided
    if (flowJson) {
      fcl.config().load({ flowJSON: flowJson })
    }
    // Subscribe to changes
    const unsubscribe = fcl.config().subscribe(latest => {
      setFlowConfig(mapConfig(latest))
    })
    return () => unsubscribe()
  }, [initialConfig, flowJson])

  return (
    <FlowConfigContext.Provider value={flowConfig}>
      {children}
    </FlowConfigContext.Provider>
  )
}
