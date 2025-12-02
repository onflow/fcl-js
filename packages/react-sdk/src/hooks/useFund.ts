import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query"
import {useCallback, useMemo} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"
import {
  createPaymentsClient,
  FundingIntent,
  FundingSession,
  FundingProvider,
} from "@onflow/payments"

/**
 * Arguments for the useFund hook.
 */
export interface UseFundArgs {
  /** Array of funding providers to use (in priority order) */
  providers: FundingProvider[]
  /** Optional React Query mutation settings (e.g., `onSuccess`, `onError`, `retry`) */
  mutation?: Omit<
    UseMutationOptions<FundingSession, Error, FundingIntent>,
    "mutationFn"
  >
  /** Optional Flow client override */
  flowClient?: ReturnType<typeof useFlowClient>
}

/**
 * useFund
 *
 * Creates a funding session via the payments client and returns a React Query mutation.
 * Use this hook to initiate crypto or fiat funding flows.
 *
 * @param args.providers - Array of funding providers (e.g., `[relayProvider()]`)
 * @param args.mutation - Optional React Query mutation options
 * @param args.flowClient - Optional Flow client override
 *
 * @example
 * ```tsx
 * import { useFund } from "@onflow/react-sdk"
 * import { relayProvider } from "@onflow/payments"
 *
 * function FundButton() {
 *   const { mutateAsync: fund, isPending } = useFund({
 *     providers: [relayProvider()],
 *   })
 *
 *   const handleFund = async () => {
 *     const session = await fund({
 *       kind: "crypto",
 *       destination: "eip155:747:0xRecipient",
 *       currency: "USDC",
 *       amount: "100",
 *       sourceChain: "eip155:1",
 *       sourceCurrency: "USDC",
 *     })
 *     console.log("Deposit to:", session.instructions.address)
 *   }
 *
 *   return <button onClick={handleFund} disabled={isPending}>Fund</button>
 * }
 * ```
 */
export function useFund({
  providers,
  mutation: mutationOptions = {},
  flowClient,
}: UseFundArgs): UseMutationResult<FundingSession, Error, FundingIntent> {
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

  const mutationFn = useCallback(
    async (intent: FundingIntent) => {
      return paymentsClient.createSession(intent)
    },
    [paymentsClient]
  )

  return useMutation<FundingSession, Error, FundingIntent>(
    {
      mutationFn,
      retry: false,
      ...mutationOptions,
    },
    queryClient
  )
}
