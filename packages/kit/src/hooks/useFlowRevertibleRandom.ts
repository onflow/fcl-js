import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQuery} from "./useFlowQuery"
import {useClient} from "../provider/FlowProvider"

/**
 * A single random result, paired with the block height from which it was generated.
 */
export interface RevertibleRandomResult {
  /** The block height at which the random value was generated */
  blockHeight: string
  /** The random UInt256 value, returned as a decimal string */
  value: string
}

/**
 * Arguments for `useFlowRevertibleRandom` hook.
 *
 * - `min`: Minimum (inclusive) bound for random generation, expressed as a UInt256 decimal string.
 * - `max`: Maximum (inclusive) bound for random generation, expressed as a UInt256 decimal string.
 * - `count`: Number of random values to fetch (must be >= 1). Defaults to 1.
 * - `query`: Optional TanStack Query settings (e.g. staleTime, retry, enabled, select, placeholderData, etc.).
 */
export interface UseFlowRevertibleRandomArgs {
  /** Decimal string for minimum UInt256 (inclusive). Defaults to "0". */
  min?: string
  /** Decimal string for maximum UInt256 (inclusive). */
  max: string
  /** How many results to generate; must be at least 1. Defaults to 1. */
  count?: number
  /**
   * TanStack Query options for an array of RevertibleRandomResult.
   */
  query?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">
  client?: ReturnType<typeof useClient>
}

/**
 * Hook: Fetch one or more pseudorandom UInt256 values from the Flow blockchain
 * in a revertible fashion (i.e. they can be re-generated if the transaction reverts).
 *
 * @param params.min   Minimum bound as UInt256 decimal string (default: "0").
 * @param params.max   Maximum bound as UInt256 decimal string.
 * @param params.count Number of values to generate (default: 1).
 * @param params.query React-Query options (staleTime, retry, enabled, etc.).
 *
 * @returns A React-Query `UseQueryResult` wrapping an array of results.
 */
export function useFlowRevertibleRandom({
  min = "0",
  max,
  count = 1,
  query: queryOptions = {},
  client,
}: UseFlowRevertibleRandomArgs): UseQueryResult<
  RevertibleRandomResult[],
  Error
> {
  const mergedQuery: Omit<
    UseQueryOptions<any, Error>,
    "queryKey" | "queryFn"
  > = {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...queryOptions,
  }

  const result = useFlowQuery({
    cadence: `
      access(all) struct RevertibleRandomResult {
          access(all) let blockHeight: UInt64
          access(all) let value: UInt256

          init(blockHeight: UInt64, value: UInt256) {
              self.blockHeight = blockHeight
              self.value = value
          }
      }

      access(all) fun main(min: UInt256, max: UInt256, count: Int): [RevertibleRandomResult] {
          pre {
              min < max: "Invalid random range - max must be greater than min"
              0 < count: "Invalid count - must request at least one random value at a time"
          }
          let currentHeight = getCurrentBlock().height
          let results: [RevertibleRandomResult] = []
          for i in InclusiveRange(0, count - 1) {
              results.append(RevertibleRandomResult(
                  blockHeight: currentHeight,
                  value: min + revertibleRandom<UInt256>(modulo: max - min + 1)
              ))
          }
          return results
      }
    `,
    args: (arg, t) => [
      arg(min, t.UInt256),
      arg(max, t.UInt256),
      arg(count, t.Int),
    ],
    query: mergedQuery,
    client,
  })

  return result as UseQueryResult<RevertibleRandomResult[], Error>
}
