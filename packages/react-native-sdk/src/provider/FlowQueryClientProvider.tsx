import React, {PropsWithChildren} from "react"
import {QueryClient} from "@tanstack/react-query"
import {FlowQueryClientContext} from "@onflow/react-core"

export function FlowQueryClientProvider({
  queryClient,
  children,
}: PropsWithChildren<{queryClient: QueryClient}>) {
  return (
    <FlowQueryClientContext.Provider value={queryClient} children={children} />
  )
}

// Re-export the hook from react-core for convenience
export {useFlowQueryClient} from "@onflow/react-core"
