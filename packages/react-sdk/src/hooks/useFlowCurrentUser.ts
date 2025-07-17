import {useState, useEffect} from "react"
import {CurrentUser} from "@onflow/typedefs"
import {useClient} from "../provider/FlowProvider"

interface UseFlowCurrentUserArgs {
  client?: ReturnType<typeof useClient>
}

interface UseFlowCurrentUserResult {
  user: CurrentUser | null
  authenticate: () => Promise<CurrentUser>
  unauthenticate: () => void
}

export function useFlowCurrentUser(
  client?: ReturnType<typeof useClient>
): UseFlowCurrentUserResult {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const fcl = useClient({client})

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [fcl])

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
