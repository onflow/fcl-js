import React, {useState, PropsWithChildren, useMemo, useEffect} from "react"
import {
  FlowClientContext,
  FlowConfig,
  FlowConfigContext,
  PaymentsClientContext,
} from "../core/context"
import {DefaultOptions, QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClient"
import {createFlowClient} from "@onflow/fcl"
import {createPaymentsClient, FundingProviderFactory} from "@onflow/payments"
import {ThemeProvider, Theme} from "../core/theme"
import {GlobalTransactionProvider} from "./GlobalTransactionProvider"
import tailwindStyles from "../styles/tailwind.css"
import {DarkModeProvider} from "./DarkModeProvider"

export type ColorMode = "light" | "dark" | "system"

interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowClient?: ReturnType<typeof createFlowClient>
  flowJson?: Record<string, any>
  theme?: Partial<Theme>
  colorMode?: ColorMode
  fundingProviders?: FundingProviderFactory[]
}

const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  },
}

export function FlowProvider({
  config: initialConfig = {},
  queryClient: _queryClient,
  flowClient: _flowClient,
  flowJson,
  theme: customTheme,
  children,
  colorMode = "system",
  fundingProviders = [],
}: PropsWithChildren<FlowProviderProps>) {
  const [queryClient] = useState<QueryClient>(
    () => _queryClient ?? new QueryClient({defaultOptions: defaultQueryOptions})
  )
  const flowClient = useMemo(() => {
    if (_flowClient) return _flowClient
    else
      return createFlowClient({
        accessNodeUrl: initialConfig.accessNodeUrl!,
        discoveryWallet: initialConfig.discoveryWallet,
        discoveryWalletMethod: initialConfig.discoveryWalletMethod,
        discoveryAuthnEndpoint: initialConfig.discoveryAuthnEndpoint,
        discoveryAuthnInclude: initialConfig.discoveryAuthnInclude,
        discoveryAuthnExclude: initialConfig.discoveryAuthnExclude,
        flowJson: flowJson,
        flowNetwork: initialConfig.flowNetwork,
        computeLimit: initialConfig.computeLimit,
        walletconnectProjectId: initialConfig.walletconnectProjectId,
        walletconnectDisableNotifications:
          initialConfig.walletconnectDisableNotifications,
        appDetailTitle: initialConfig.appDetailTitle,
        appDetailIcon: initialConfig.appDetailIcon,
        appDetailDescription: initialConfig.appDetailDescription,
        appDetailUrl: initialConfig.appDetailUrl,
        serviceOpenIdScopes: initialConfig.serviceOpenIdScopes,
      })
  }, [_flowClient, initialConfig, flowJson])

  const paymentsClient = useMemo(() => {
    if (fundingProviders.length === 0) return undefined
    return createPaymentsClient({
      providers: fundingProviders,
      flowClient,
    })
  }, [fundingProviders, flowClient])

  // Helper function to get initial dark mode value
  const getInitialDarkMode = (colorMode: ColorMode): boolean => {
    if (colorMode === "dark") return true
    if (colorMode === "light") return false
    // For system mode, check if window exists (SSR safety) and get system preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    // Fallback to light mode during SSR
    return false
  }
  // Initialize with the correct value to prevent flashing
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    getInitialDarkMode(colorMode)
  )

  // Update dark mode when color mode changes
  useEffect(() => {
    if (colorMode === "system") {
      // Only proceed if we're in the browser
      if (typeof window === "undefined") return

      // Set initial value (might be different from useState fallback)
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setDarkMode(mediaQuery.matches)

      const handleChange = (event: MediaQueryListEvent) => {
        setDarkMode(event.matches)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      setDarkMode(colorMode === "dark")
    }
  }, [colorMode])

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext.Provider value={initialConfig}>
        <FlowClientContext.Provider value={flowClient}>
          <PaymentsClientContext.Provider value={paymentsClient}>
            <GlobalTransactionProvider>
              <style>{tailwindStyles}</style>
              <ThemeProvider theme={customTheme}>
                <DarkModeProvider darkMode={darkMode}>
                  {children}
                </DarkModeProvider>
              </ThemeProvider>
            </GlobalTransactionProvider>
          </PaymentsClientContext.Provider>
        </FlowClientContext.Provider>
      </FlowConfigContext.Provider>
    </FlowQueryClientProvider>
  )
}
