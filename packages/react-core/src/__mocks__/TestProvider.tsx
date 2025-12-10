import React, {PropsWithChildren} from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {FlowClientContext} from "../core/context"
import {FlowQueryClientContext} from "../provider"
import {createMockFclInstance} from "./flow-client"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
  },
})

// Shared mock instance that tests can control
let sharedMockInstance: any = null

/**
 * Set the mock FlowClient instance to be used by TestProvider
 * Call this in your test's beforeEach to inject your configured mock
 */
export function setMockFlowClient(mockInstance: any) {
  sharedMockInstance = mockInstance
}

/**
 * Get the current mock FlowClient instance
 */
export function getMockFlowClient() {
  return sharedMockInstance
}

/**
 * Test-only Provider for react-core hooks
 * Provides both QueryClient and FlowClient context for testing
 */
export function TestProvider({children}: PropsWithChildren<{}>) {
  // Use shared instance if available, otherwise create a new one
  const mockFclInstance =
    sharedMockInstance || createMockFclInstance().mockFclInstance

  return (
    <QueryClientProvider client={queryClient}>
      <FlowQueryClientContext.Provider value={queryClient}>
        <FlowClientContext.Provider value={mockFclInstance}>
          {children}
        </FlowClientContext.Provider>
      </FlowQueryClientContext.Provider>
    </QueryClientProvider>
  )
}
