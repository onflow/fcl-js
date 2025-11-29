import React, {useState, PropsWithChildren, useMemo} from "react"
import {QueryClient} from "@tanstack/react-query"
import {
  FlowQueryClientProvider,
  FlowClientContext,
  FlowConfig,
  FlowConfigContext,
  GlobalTransactionProvider,
  defaultQueryOptions,
} from "@onflow/react-sdk"
import {createFlowClient, ConnectModalProvider} from "@onflow/fcl-react-native"

interface FlowProviderProps {
  config?: FlowConfig
  queryClient?: QueryClient
  flowClient?: ReturnType<typeof createFlowClient>
  flowJson?: Record<string, any>
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
