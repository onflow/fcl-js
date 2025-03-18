import * as fcl from "@onflow/fcl"
import {Event} from "@onflow/typedefs"
import {useEffect, useState} from "react"

interface UseEventResult {
  events: Event[]
  error: Error | null
  isLoading: boolean
}

/**
 * useEvent hook
 *
 * Subscribes to a Flow event stream and accumulates all events received.
 *
 * @param eventName - The fully qualified event name (e.g. "A.0xDeaDBeef.SomeContract.SomeEvent").
 * @returns {UseEventResult} An object with:
 *    - events: an array of all received events
 *    - error: any error encountered during subscription
 *    - isLoading: true until the first event arrives or an error occurs
 */
export function useEvent(eventName: string): UseEventResult {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = fcl
        .events(eventName)
        .subscribe((newEvent: Event | null) => {
          if (!newEvent) return
          setEvents(prevEvents => [...prevEvents, newEvent])
          setIsLoading(false)
        })
      setIsLoading(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error(String(err)))
      }
      setIsLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [eventName])

  return {events, error, isLoading}
}
