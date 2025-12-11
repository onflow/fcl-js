import React, {useState, PropsWithChildren, useMemo, useEffect} from "react"
import {
  FlowConfig,
  FlowConfigContext,
  FlowClientContext,
} from "@onflow/react-core"
import {DefaultOptions, QueryClient} from "@tanstack/react-query"
import {FlowQueryClientProvider} from "./FlowQueryClientProvider"
import {
  createFlowClient,
  ConnectModalProvider,
  config,
} from "@onflow/fcl-react-native"
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

  // Set discovery.authn.endpoint in global FCL config for ServiceDiscovery
  // This is needed for the ConnectModal to work correctly and retrieve the endpoint to load wallets
  useEffect(() => {
    if (initialConfig.discoveryAuthnEndpoint) {
      config().put(
        "discovery.authn.endpoint",
        initialConfig.discoveryAuthnEndpoint
      )
    }
  }, [initialConfig.discoveryAuthnEndpoint])

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
