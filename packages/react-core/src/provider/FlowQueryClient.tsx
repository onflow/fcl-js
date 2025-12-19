import React, {createContext, useContext, PropsWithChildren} from "react"
import {QueryClient} from "@tanstack/react-query"

export const FlowQueryClientContext = createContext<QueryClient | undefined>(
  undefined
)

export function useFlowQueryClient() {
  const queryClient = useContext(FlowQueryClientContext)
  if (!queryClient) {
    throw new Error(
      "useFlowQueryClient must be used within a FlowQueryClientProvider"
    )
  }
  return queryClient
}

export function FlowQueryClientProvider({
  queryClient,
  children,
}: PropsWithChildren<{queryClient: QueryClient}>) {
  return (
    <FlowQueryClientContext.Provider value={queryClient} children={children} />
  )
}
