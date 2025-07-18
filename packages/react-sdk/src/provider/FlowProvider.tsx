import React, {useState, PropsWithChildren, useMemo} from "react"
import {FlowClientContext, FlowConfig, FlowConfigContext} from "../core/context"
import {DefaultOptions, QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClient"
import {createFlowClient} from "@onflow/fcl"
import {ThemeProvider, Theme} from "../core/theme"
import {GlobalTransactionProvider} from "./GlobalTransactionProvider"
import tailwindStyles from "../styles/tailwind.css"
import {DarkModeProvider} from "./DarkModeProvider"

interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowClient?: ReturnType<typeof createFlowClient>
  flowJson?: Record<string, any>
  theme?: Partial<Theme>
  darkMode?: boolean
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
  darkMode = false,
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
  }, [_flowClient, initialConfig])

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext.Provider value={initialConfig}>
        <FlowClientContext.Provider value={flowClient}>
          <GlobalTransactionProvider>
            <style>{tailwindStyles}</style>
            <ThemeProvider theme={customTheme}>
              <DarkModeProvider darkMode={darkMode}>
                {children}
              </DarkModeProvider>
            </ThemeProvider>
          </GlobalTransactionProvider>
        </FlowClientContext.Provider>
      </FlowConfigContext.Provider>
    </FlowQueryClientProvider>
  )
}
