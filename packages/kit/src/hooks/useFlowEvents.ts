import * as fcl from "@onflow/fcl"
import {Event} from "@onflow/typedefs"
import {useEffect} from "react"

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

export interface UseFlowEventsArgs {
  /** Fully‑qualified event name (e.g. "A.0xDeaDBeef.SomeContract.SomeEvent") or an EventFilter object */
  event: string | EventFilter
  /** Called for each new event received */
  onEvent: (event: Event) => void
  /** Optional error callback */
  onError?: (error: Error) => void
  /** Whether to subscribe (default: true) */
  enabled?: boolean
}

/**
 * useFlowEvents hook
 *
 * Subscribes to a Flow event stream and calls the provided callbacks.
 */
export function useFlowEvents({
  event,
  onEvent,
  onError,
  enabled = true,
}: UseFlowEventsArgs) {
  useEffect(() => {
    if (!enabled) return

    let unsubscribe: (() => void) | undefined

    try {
      const filter: EventFilter =
        typeof event === "string" ? {eventTypes: [event]} : event

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
  }, [event, onEvent, onError, enabled])
}
