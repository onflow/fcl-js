import * as fcl from "@onflow/fcl"
import {Event} from "@onflow/typedefs"
import {useEffect} from "react"

interface UseFlowEventsOptions {
  onEvent: (event: Event) => void
  onError?: (error: Error) => void
  onLoading?: (isLoading: boolean) => void
}

/**
 * useFlowEvents hook
 *
 * Subscribes to a Flow event stream and calls the provided callback for each event received.
 *
 * @param eventName - The fully qualified event name (e.g. "A.0xDeaDBeef.SomeContract.SomeEvent")
 * @param options - Object containing callback functions:
 *    - onEvent: Called for each new event received
 *    - onError: Optional callback for error handling
 *    - onLoading: Optional callback for loading state changes
 */
export function useFlowEvents(
  eventName: string,
  {onEvent, onError, onLoading}: UseFlowEventsOptions
) {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      onLoading?.(true)
      unsubscribe = fcl
        .events(eventName)
        .subscribe((newEvent: Event | null) => {
          if (!newEvent) return
          onEvent(newEvent)
          onLoading?.(false)
        })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      onError?.(error)
      onLoading?.(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [eventName, onEvent, onError, onLoading])
}
