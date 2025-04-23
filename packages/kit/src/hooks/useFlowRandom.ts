import * as fcl from "@onflow/fcl"
import {UseQueryOptions} from "@tanstack/react-query"
import {useFlowBlock} from "@onflow/kit"
import {useFlowQuery} from "./useFlowQuery"

/**
 * Arguments for the `useFlowRandom` hook.
 *
 * @property min - The lower bound (inclusive) for the random UInt64. Defaults to "0".
 * @property max - The upper bound (inclusive) for the random UInt64. Defaults to UInt64 max ("18446744073709551615").
 * @property blockHeight - Optional: Pin randomness to a specific block height. If omitted, the hook will fetch the latest sealed block once.
 * @property query - React Query options (e.g., retry, onSuccess, staleTime).
 *   By default, `staleTime` is `Infinity` and `refetchOnWindowFocus` is `false` to prevent unintended refetches.
 */
export interface UseFlowRandomArgs {
  min?: string
  max?: string
  blockHeight?: number
  query?: Omit<UseQueryOptions<string, Error>, "queryKey" | "queryFn">
}

/**
 * useFlowRandom
 *
 * Fetches a pseudorandom UInt64 within [min, max] from a Cadence script.
 *
 * - By default, pins to the first sealed block fetched (using `sealed: true`),
 *   so that you get one random value per block.
 * - Override `blockHeight` to deterministically fetch randomness for a given block.
 *
 * @param args.min - Lower bound (inclusive) as string UInt64; default: "0".
 * @param args.max - Upper bound (inclusive) as string UInt64; default: "18446744073709551615".
 * @param args.blockHeight - Optional block height to pin; if undefined, fetched once (sealed block).
 * @param args.query - React Query options; default `staleTime: Infinity`, `refetchOnWindowFocus: false`.
 * @returns An object containing:
 *   - `data`: the random UInt64 as a string, or `null` before fetch.
 *   - `isLoading`, `error`, `refetch`, etc. from React Query.
 *   - `blockHeight`: the block height used for randomness.
 */
export function useFlowRandom({
  min = "0",
  max = "18446744073709551615",
  blockHeight: explicitHeight,
  query: queryOptions = {},
}: UseFlowRandomArgs) {
  const {data: latestBlock, isLoading: blockLoading} = explicitHeight
    ? {data: null, isLoading: false}
    : useFlowBlock({
        sealed: true,
        query: {staleTime: Infinity, refetchOnWindowFocus: false},
      })

  const height = explicitHeight ?? latestBlock?.height

  const mergedQuery = {
    enabled:
      (explicitHeight !== undefined
        ? true
        : !blockLoading && height !== undefined) &&
      (queryOptions.enabled ?? true),
    staleTime: queryOptions.staleTime ?? Infinity,
    refetchOnWindowFocus: queryOptions.refetchOnWindowFocus ?? false,
    ...queryOptions,
  }

  const result = useFlowQuery({
    cadence: `access(all) fun main(min: UInt64, max: UInt64): UInt64 {
        pre {
            min < max: "Max \(max) must be greater than min \(min)"
        }
        return revertibleRandom<UInt64>(modulo: max - min + 1)
    }`,
    args: (arg, t) => [
      arg(min, t.UInt64),
      arg(max, t.UInt64),
      arg(height!.toString(), t.UInt64),
    ],
    query: mergedQuery as Omit<
      UseQueryOptions<unknown, Error>,
      "queryKey" | "queryFn"
    >,
  })

  return {
    ...result,
    blockHeight: height,
  }
}
