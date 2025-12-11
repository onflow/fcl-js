import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useCallback, useMemo} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"
import {
  createPaymentsClient,
  FundingProviderFactory,
  ProviderCapability,
} from "@onflow/payments"

/**
 * Arguments for the useFundingCapabilities hook.
 */
export interface UseFundingCapabilitiesArgs {
  /** Array of funding provider factories to query */
  providers: FundingProviderFactory[]
  /** Optional React Query options */
  query?: Omit<
    UseQueryOptions<ProviderCapability[], Error>,
    "queryKey" | "queryFn"
  >
  /** Optional Flow client override */
  flowClient?: ReturnType<typeof useFlowClient>
}

/**
 * useFundingCapabilities
 *
 * Fetches the capabilities (supported chains, currencies, etc.) from funding providers.
 * Use this to dynamically populate UI with available funding options.
 *
 * @param args.providers - Array of funding provider factories
 * @param args.query - Optional React Query options
 * @param args.flowClient - Optional Flow client override
 *
 * @example
 * ```tsx
 * import { useFundingCapabilities } from "@onflow/react-sdk"
 * import { relayProvider } from "@onflow/payments"
 *
 * function FundingOptions() {
 *   const { data: capabilities, isLoading } = useFundingCapabilities({
 *     providers: [relayProvider()],
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   const cryptoCapability = capabilities?.find(c => c.type === "crypto")
 *   const chains = cryptoCapability?.sourceChains || []
 *   const currencies = cryptoCapability?.currencies || []
 *
 *   return (
 *     <div>
 *       <h3>Supported Chains:</h3>
 *       <ul>{chains.map(chain => <li key={chain}>{chain}</li>)}</ul>
 *       <h3>Supported Currencies:</h3>
 *       <ul>{currencies.map(currency => <li key={currency}>{currency}</li>)}</ul>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFundingCapabilities({
  providers,
  query: queryOptions = {},
  flowClient,
}: UseFundingCapabilitiesArgs): UseQueryResult<ProviderCapability[], Error> {
  const queryClient = useFlowQueryClient()
  const fcl = useFlowClient({flowClient})

  const paymentsClient = useMemo(
    () =>
      createPaymentsClient({
        providers,
        flowClient: fcl,
      }),
    [providers, fcl]
  )

  const fetchCapabilities = useCallback(async () => {
    // Get all provider instances from the client
    // We need to access the internal providers array
    // Since it's not exposed, we'll need to call getCapabilities on the first provider
    // This is a limitation - we should enhance the payments client to expose providers or aggregated capabilities

    const allCapabilities: ProviderCapability[] = []

    // Create provider instances manually to call getCapabilities
    for (const factory of providers) {
      const provider = factory({flowClient: fcl})
      const capabilities = await provider.getCapabilities()
      allCapabilities.push(...capabilities)
    }

    return allCapabilities
  }, [providers, fcl])

  return useQuery<ProviderCapability[], Error>(
    {
      queryKey: ["fundingCapabilities", providers.length],
      queryFn: fetchCapabilities,
      staleTime: 5 * 60 * 1000, // 5 minutes - capabilities don't change often
      ...queryOptions,
    },
    queryClient
  )
}
