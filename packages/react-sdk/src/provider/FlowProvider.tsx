import React, {
  useState,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react"
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

const mappings: Array<{fcl: string; typed: keyof FlowConfig}> = [
  {fcl: "accessNode.api", typed: "accessNodeUrl"},
  {fcl: "app.detail.title", typed: "appDetailTitle"},
  {fcl: "app.detail.icon", typed: "appDetailIcon"},
  {fcl: "app.detail.description", typed: "appDetailDescription"},
  {fcl: "app.detail.url", typed: "appDetailUrl"},
  {fcl: "discovery.wallet", typed: "discoveryWallet"},
  {fcl: "discovery.wallet.method", typed: "discoveryWalletMethod"},
  {fcl: "discovery.authn.endpoint", typed: "discoveryAuthnEndpoint"},
  {fcl: "fcl.limit", typed: "fclLimit"},
  {fcl: "flow.network", typed: "flowNetwork"},
  {fcl: "service.OpenID.scopes", typed: "serviceOpenIdScopes"},
  {fcl: "walletconnect.projectId", typed: "walletconnectProjectId"},
  {
    fcl: "walletconnect.disableNotifications",
    typed: "walletconnectDisableNotifications",
  },
]

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
        computeLimit: initialConfig.fclLimit!,
        flowNetwork: initialConfig.flowNetwork,
        //serviceOpenIdScopes: initialConfig.serviceOpenIdScopes,
        walletconnectProjectId: initialConfig.walletconnectProjectId,
        walletconnectDisableNotifications:
          initialConfig.walletconnectDisableNotifications,
      })
  }, [_flowClient, initialConfig])

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext value={initialConfig}>
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
      </FlowConfigContext>
    </FlowQueryClientProvider>
  )
}
