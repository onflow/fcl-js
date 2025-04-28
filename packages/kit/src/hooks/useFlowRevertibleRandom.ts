import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQuery} from "./useFlowQuery"

export interface RevertibleRandomResult {
  /** The block height at which the random value was generated */
  blockHeight: string
  /** The random value (UInt256) as a string */
  value: string
}

export interface UseFlowRevertibleRandomArgs {
  min?: string
  max: string
  count?: number
  query?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">
}

export function useFlowRevertibleRandom({
  min = "0",
  max,
  count = 1,
  query: queryOptions = {},
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
          for i in InclusiveRange(1, count) {
              results.append(RevertibleRandomResult(
                  blockHeight: currentHeight,
                  value: revertibleRandom<UInt256>(modulo: max - min + 1)
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
  })

  return result as UseQueryResult<RevertibleRandomResult[], Error>
}
