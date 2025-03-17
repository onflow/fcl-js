import * as fcl from "@onflow/fcl"
import {Event} from "@onflow/typedefs"
import {useEffect} from "react"
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query"

const queryKey = (eventName: string) => ["flowEvents", eventName]

export function useEvent(eventName: string): UseQueryResult<Event[], Error> {
  const queryClient = useQueryClient()

  const queryResult = useQuery<Event[], Error>({
    queryKey: queryKey(eventName),
    queryFn: async () => {
      return []
    },
    initialData: [],
    staleTime: Infinity,
  })

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = fcl
        .events(eventName)
        .subscribe((newEvent: Event | null) => {
          if (!newEvent) return

          queryClient.setQueryData<Event[]>(
            queryKey(eventName),
            (oldEvents = []) => [...oldEvents, newEvent]
          )
        })
    } catch (err: unknown) {
      if (err instanceof Error) {
        queryClient.setQueryData<Event[]>(queryKey(eventName), () => {
          throw err
        })
      } else {
        queryClient.setQueryData<Event[]>(queryKey(eventName), () => {
          throw new Error(String(err))
        })
      }
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [eventName, queryClient])

  return queryResult
}
