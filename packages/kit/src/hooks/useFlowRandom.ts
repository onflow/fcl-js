import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQuery} from "./useFlowQuery"

export interface RevertibleRandomResult {
  blockHeight: string
  value: string
}

export interface UseFlowRandomArgs {
  min?: string
  max: string
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
}

export function useFlowRandom({
  min = "0",
  max,
  query: queryOptions = {},
}: UseFlowRandomArgs): UseQueryResult<RevertibleRandomResult, Error> {
  const mergedQuery = {
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

      access(all) fun main(min: UInt256, max: UInt256): RevertibleRandomResult {
        pre {
          min < max: "Invalid random range - max must be greater than min"
        }
        return RevertibleRandomResult(
          blockHeight: getCurrentBlock().height,
          value: revertibleRandom<UInt256>(modulo: max - min + 1)
        )
      }
    `,
    args: (arg, t) => [arg(min, t.UInt256), arg(max, t.UInt256)],
    query: mergedQuery,
  })

  return result as UseQueryResult<RevertibleRandomResult, Error>
}
