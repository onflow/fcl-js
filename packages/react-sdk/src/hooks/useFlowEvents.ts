import {Event} from "@onflow/typedefs"
import {useEffect} from "react"
import {useFlowClient} from "./useFlowClient"

export interface EventFilter {
  startBlockId?: string
  startHeight?: number
  eventTypes?: string[]
  addresses?: string[]
  contracts?: string[]
  opts?: {
    heartbeatInterval?: number
  }
}

export interface UseFlowEventsArgs extends EventFilter {
  /** Called for each new event received */
  onEvent: (event: Event) => void
  /** Optional error callback */
  onError?: (error: Error) => void
  flowClient?: ReturnType<typeof useFlowClient>
}

/**
 * useFlowEvents hook
 *
 * Subscribes to a Flow event stream and calls the provided callbacks.
 */
export function useFlowEvents({
  startBlockId,
  startHeight,
  eventTypes,
  addresses,
  contracts,
  opts,
  onEvent,
  onError,
  flowClient,
}: UseFlowEventsArgs) {
  const fcl = useFlowClient({flowClient})

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      const filter: EventFilter = {
        startBlockId,
        startHeight,
        eventTypes,
        addresses,
        contracts,
        opts,
      }

      unsubscribe = fcl.events(filter).subscribe((newEvent: Event | null) => {
        if (newEvent) {
          onEvent(newEvent)
        }
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      onError?.(error)
    }

    return () => {
      unsubscribe?.()
    }
  }, [
    startBlockId,
    startHeight,
    JSON.stringify(eventTypes),
    JSON.stringify(addresses),
    JSON.stringify(contracts),
    JSON.stringify(opts),
    onEvent,
    onError,
  ])
}
