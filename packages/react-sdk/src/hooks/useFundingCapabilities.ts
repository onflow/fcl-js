import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"
import {usePaymentsClient} from "./usePaymentsClient"
import {useFlowChainId} from "./useFlowChainId"
import {ProviderCapability, PaymentsClient} from "@onflow/payments"

/**
 * Arguments for the useFundingCapabilities hook.
 */
export interface UseFundingCapabilitiesArgs {
  /** Optional payments client (uses context if not provided) */
  paymentsClient?: PaymentsClient
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
 * @param args.paymentsClient - Optional payments client (uses context if not provided)
 * @param args.query - Optional React Query options
 * @param args.flowClient - Optional Flow client override
 *
 * @example
 * ```tsx
 * import { useFundingCapabilities } from "@onflow/react-sdk"
 *
 * function FundingOptions() {
 *   const { data: capabilities, isLoading } = useFundingCapabilities()
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
  paymentsClient: _paymentsClient,
  query: queryOptions = {},
  flowClient,
}: UseFundingCapabilitiesArgs = {}): UseQueryResult<
  ProviderCapability[],
  Error
> {
  const queryClient = useFlowQueryClient()
  const contextPaymentsClient = usePaymentsClient()
  const paymentsClient = _paymentsClient || contextPaymentsClient
  const {data: chainId} = useFlowChainId()

  // Use chainId in query key for proper cache invalidation when network switches
  const chainIdForKey = chainId || "unknown"

  const fetchCapabilities = useCallback(async () => {
    if (!paymentsClient) {
      throw new Error(
        "No payments client available. Configure fundingProviders in FlowProvider or pass paymentsClient to useFundingCapabilities."
      )
    }

    // Access providers from the payments client and get their capabilities
    const allCapabilities: ProviderCapability[] = []

    // TODO: Expose providers array from PaymentsClient in the spec
    // For now, we access them via type assertion
    const providers = (paymentsClient as any).providers || []

    for (const provider of providers) {
      const capabilities = await provider.getCapabilities()
      allCapabilities.push(...capabilities)
    }

    return allCapabilities
  }, [paymentsClient])

  return useQuery<ProviderCapability[], Error>(
    {
      queryKey: [
        "fundingCapabilities",
        paymentsClient ? "configured" : "none",
        chainIdForKey,
      ],
      queryFn: fetchCapabilities,
      enabled: !!paymentsClient,
      staleTime: 5 * 60 * 1000, // 5 minutes - capabilities don't change often
      ...queryOptions,
    },
    queryClient
  )
}
