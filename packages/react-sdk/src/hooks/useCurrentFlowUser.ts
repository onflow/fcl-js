import {useState, useEffect} from "react"
import {CurrentUser} from "@onflow/typedefs"
import {useClient} from "../provider/FlowProvider"

interface UseCurrentFlowUserArgs {
  client?: ReturnType<typeof useClient>
}

interface UseCurrentFlowUserResult {
  user: CurrentUser | null
  authenticate: () => Promise<CurrentUser>
  unauthenticate: () => void
}

/**
 * @deprecated Use useFlowCurrentUser instead. This hook will be removed in a future version.
 */
export function useCurrentFlowUser({
  client,
}: UseCurrentFlowUserArgs = {}): UseCurrentFlowUserResult {
  console.warn(
    "useCurrentFlowUser is deprecated and will be removed in a future version. Use useFlowCurrentUser instead."
  )

  const [user, setUser] = useState<CurrentUser | null>(null)
  const _fcl = useClient()
  const fcl = client ?? _fcl

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const authenticate = async (): Promise<CurrentUser> => {
    try {
      return await fcl.authenticate()
    } catch (error) {
      throw error
    }
  }

  const unauthenticate = (): void => {
    fcl.unauthenticate()
  }

  return {
    user,
    authenticate,
    unauthenticate,
  }
}
