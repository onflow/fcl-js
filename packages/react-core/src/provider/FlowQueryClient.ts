import {createContext, useContext} from "react"
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
