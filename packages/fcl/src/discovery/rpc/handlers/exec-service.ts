import {execStrategy, normalizePollingResponse} from "@onflow/fcl-core"
import {Service} from "@onflow/typedefs"

const APPROVED = "APPROVED"

// RPC handler for handling service execution requests (e.g extension service)
export const execServiceHandlerFactory =
  ({
    onExecResult,
    execStrategyOpts,
    execStrategyArgs,
    abortSignal,
  }: {
    onExecResult: (result: any) => void
    execStrategyOpts: any
    execStrategyArgs: any
    abortSignal: AbortSignal
  }) =>
  async ({service}: {service: Service}) => {
    try {
      const result = await (execStrategy as any)(
        {
          ...execStrategyOpts,
          service,
          config: execStrategyOpts.config,
          abortSignal,
        },
        // Pass the rest of the arguments (protect against future changes)
        ...execStrategyArgs.slice(1)
      )

      const status = normalizePollingResponse(result)?.status || APPROVED
      if (status === APPROVED) {
        // Propogrates the result to the execStrategy hook
        onExecResult(result)

        // Notify Discovery that the service was approved
        return null
      } else {
        // Notify Discovery that the service was rejected
        throw new Error(result?.reason || "Service was declined")
      }
    } catch (e: any) {
      throw new Error(e?.message || "Service execution failed")
    }
  }
