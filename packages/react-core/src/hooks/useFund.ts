import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import {useFlowClient} from "./useFlowClient"
import {usePaymentsClient} from "./usePaymentsClient"
import {FundingIntent, FundingSession, PaymentsClient} from "@onflow/payments"

/**
 * Arguments for the useFund hook.
 */
export interface UseFundArgs {
  /** Optional payments client (uses context if not provided) */
  paymentsClient?: PaymentsClient
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
 * @param args.paymentsClient - Optional payments client (uses context if not provided)
 * @param args.mutation - Optional React Query mutation options
 * @param args.flowClient - Optional Flow client override
 *
 * @example
 * ```tsx
 * import { useFund } from "@onflow/react-sdk"
 *
 * function FundButton() {
 *   const { mutateAsync: fund, isPending } = useFund()
 *
 *   const handleFund = async () => {
 *     const session = await fund({
 *       kind: "crypto",
 *       destination: "eip155:747:0xRecipient",
 *       currency: "0xUSDC",
 *       amount: "100",
 *       sourceChain: "eip155:1",
 *       sourceCurrency: "0xUSDC",
 *     })
 *     console.log("Deposit to:", session.instructions.address)
 *   }
 *
 *   return <button onClick={handleFund} disabled={isPending}>Fund</button>
 * }
 * ```
 */
export function useFund({
  paymentsClient: _paymentsClient,
  mutation: mutationOptions = {},
  flowClient,
}: UseFundArgs = {}): UseMutationResult<FundingSession, Error, FundingIntent> {
  const queryClient = useFlowQueryClient()
  const contextPaymentsClient = usePaymentsClient()
  const paymentsClient = _paymentsClient || contextPaymentsClient

  const mutationFn = useCallback(
    async (intent: FundingIntent) => {
      if (!paymentsClient) {
        throw new Error(
          "No payments client available. Configure fundingProviders in FlowProvider or pass paymentsClient to useFund."
        )
      }
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
