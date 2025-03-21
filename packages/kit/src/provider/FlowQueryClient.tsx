import React, {createContext, useContext, FC, PropsWithChildren} from "react"
import {QueryClient} from "@tanstack/react-query"

const FlowQueryClientContext = createContext<QueryClient | undefined>(undefined)

export function FlowQueryClientProvider({
  queryClient,
  children,
}: PropsWithChildren<{queryClient: QueryClient}>) {
  return (
    <FlowQueryClientContext.Provider value={queryClient} children={children} />
  )
}

export function useFlowQueryClient() {
  const queryClient = useContext(FlowQueryClientContext)
  if (!queryClient) {
    throw new Error(
      "useFlowQueryClient must be used within a FlowQueryClientProvider"
    )
  }
  return queryClient
}
