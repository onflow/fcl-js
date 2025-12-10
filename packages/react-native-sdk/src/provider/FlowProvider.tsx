import React, {useState, PropsWithChildren, useMemo} from "react"
import {
  FlowConfig,
  FlowConfigContext,
  FlowClientContext,
} from "@onflow/react-core"
import {DefaultOptions, QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClientProvider"
import {createFlowClient, ConnectModalProvider} from "@onflow/fcl-react-native"
import {GlobalTransactionProvider} from "./GlobalTransactionProvider"

export interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowClient?: ReturnType<typeof createFlowClient>
  flowJson?: Record<string, unknown>
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
  children,
}: PropsWithChildren<FlowProviderProps>) {
  const [queryClient] = useState<QueryClient>(
    () => _queryClient ?? new QueryClient({defaultOptions: defaultQueryOptions})
  )

  const flowClient = useMemo(() => {
    if (_flowClient) return _flowClient
    return createFlowClient({
      accessNodeUrl: initialConfig.accessNodeUrl!,
      discoveryWallet: initialConfig.discoveryWallet,
      discoveryWalletMethod: initialConfig.discoveryWalletMethod,
      discoveryAuthnEndpoint: initialConfig.discoveryAuthnEndpoint,
      discoveryAuthnInclude: initialConfig.discoveryAuthnInclude,
      discoveryAuthnExclude: initialConfig.discoveryAuthnExclude,
      flowJson,
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

  return (
    <FlowQueryClientProvider queryClient={queryClient}>
      <FlowConfigContext.Provider value={initialConfig}>
        <FlowClientContext.Provider value={flowClient}>
          <GlobalTransactionProvider>
            <ConnectModalProvider>{children}</ConnectModalProvider>
          </GlobalTransactionProvider>
        </FlowClientContext.Provider>
      </FlowConfigContext.Provider>
    </FlowQueryClientProvider>
  )
}
