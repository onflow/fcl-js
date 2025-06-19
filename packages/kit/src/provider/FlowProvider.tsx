import React, {useEffect, useState, PropsWithChildren, createContext, useContext} from "react"
import * as fcl from "@onflow/fcl"
import {FlowConfig, FlowConfigContext} from "../core/context"
import {DefaultOptions, QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClient"
import {deepEqual} from "../utils/deepEqual"
import {ThemeProvider, Theme} from "../core/theme"
import tailwindStyles from "../styles/tailwind.css"

// Constants
const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  },
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

interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowJson?: Record<string, any>
  theme?: Partial<Theme>
  enableDarkMode?: boolean
}

// Dark mode context
type DarkModeContextType = {
  isDark: boolean
  toggleDark: () => void
  setDark: (dark: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within a FlowProvider with enableDarkMode={true}")
  }
  return context
}

// Custom hook for dark mode logic
const useDarkModeState = (enabled: boolean) => {
  const [isDark, setIsDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize dark mode state
  useEffect(() => {
    if (!enabled || isInitialized) return
    
    const savedTheme = localStorage.getItem("flow-kit-theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    const shouldBeDark = savedTheme ? savedTheme === "dark" : systemPrefersDark
    setIsDark(shouldBeDark)
    setIsInitialized(true)
  }, [enabled, isInitialized])

  // Apply dark class and save preference when isDark changes
  useEffect(() => {
    if (!enabled || !isInitialized) return
    
    // Apply dark class to document
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    // Save preference
    localStorage.setItem("flow-kit-theme", isDark ? "dark" : "light")
  }, [isDark, enabled, isInitialized])

  const toggleDark = () => setIsDark(!isDark)
  const setDark = (dark: boolean) => setIsDark(dark)

  return {isDark, toggleDark, setDark}
}

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

// Custom hook for FCL configuration
const useFCLConfig = (initialConfig: FlowConfig, flowJson?: Record<string, any>) => {
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

  return {flowConfig, isFlowJsonLoaded}
}

export function FlowProvider({
  config: initialConfig = {},
  queryClient: _queryClient,
  flowJson,
  theme: customTheme,
  children,
  enableDarkMode,
}: PropsWithChildren<FlowProviderProps>) {
  const [queryClient] = useState<QueryClient>(
    () => _queryClient ?? new QueryClient({defaultOptions: defaultQueryOptions})
  )
  const {flowConfig, isFlowJsonLoaded} = useFCLConfig(initialConfig, flowJson)
  
  // Dark mode state
  const {isDark, toggleDark, setDark} = useDarkModeState(enableDarkMode ?? false)

  if (!flowConfig || !isFlowJsonLoaded) {
    return null
  }

  const darkModeValue = enableDarkMode ? {isDark, toggleDark, setDark} : undefined

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext.Provider value={flowConfig}>
        <style>{tailwindStyles}</style>
        <ThemeProvider theme={customTheme}>
          {darkModeValue ? (
            <DarkModeContext.Provider value={darkModeValue}>
              {children}
            </DarkModeContext.Provider>
          ) : (
            children
          )}
        </ThemeProvider>
      </FlowConfigContext.Provider>
    </FlowQueryClientProvider>
  )
}
