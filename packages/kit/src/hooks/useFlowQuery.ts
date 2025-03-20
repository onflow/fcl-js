import * as fcl from "@onflow/fcl"
import {useQuery, UseQueryResult} from "@tanstack/react-query"
import {useCallback} from "react"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

/** Basic argument types for simple usage */
type BasicArgType = "Int" | "UInt64" | "Address" | "String" | "Bool"

interface FlowArg {
  value: unknown
  type: BasicArgType
}

/**
 * Arguments can be either:
 *  - A function returning a list of FCL arguments
 *  - An array of { value, type }
 */
type FlowArgs =
  | FlowArg[]
  | ((arg: typeof fcl.arg, t: typeof fcl.t) => unknown[])

interface FlowQueryOptions {
  cadence: string
  args?: FlowArgs
}

/** Build FCL arguments from either a function or an array of {value, type} */
function buildFclArgs(args: FlowArgs = []) {
  if (typeof args === "function") {
    // For more complex usage
    return args
  }
  // For simple usage
  return (arg: typeof fcl.arg, t: typeof fcl.t) =>
    args.map(item => arg(item.value, t[item.type]))
}

/**
 * useFlowQuery
 *
 * Executes a Cadence script and returns a result.
 * Supports both simple and more complex argument definitions.
 */
export function useFlowQuery({
  cadence,
  args = [],
}: FlowQueryOptions): UseQueryResult<unknown, Error> {
  const queryClient = useFlowQueryClient()

  const fetchQuery = useCallback(async () => {
    if (!cadence) return null
    return fcl.query({
      cadence,
      args: buildFclArgs(args),
    })
  }, [cadence, args])

  return useQuery<unknown, Error>(
    {
      queryKey: ["flowQuery", cadence, args],
      queryFn: fetchQuery,
      enabled: Boolean(cadence),
      retry: false,
      initialData: null,
    },
    queryClient
  )
}
