import React, { useEffect, useState, PropsWithChildren } from "react"
import * as fcl from "@onflow/fcl"
import { FlowConfig, FlowConfigContext } from "../core/context"

interface FlowProviderProps {
  config?: Record<string, any>
  flowJson?: Record<string, any>
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
      setFlowConfig(latest)
    })
    return () => unsubscribe()
  }, [initialConfig, flowJson])

  return (
    <FlowConfigContext.Provider value={flowConfig}>
      {children}
    </FlowConfigContext.Provider>
  )
}
