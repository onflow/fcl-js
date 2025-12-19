import {useState, useEffect} from "react"
import type {CurrentUser} from "@onflow/typedefs"
import type {FlowClientCore} from "@onflow/fcl-core"
import {useFlowClient} from "./useFlowClient"

interface UseFlowCurrentUserArgs {
  flowClient?: FlowClientCore
}

interface UseFlowCurrentUserResult {
  user: CurrentUser | null
  authenticate: () => Promise<CurrentUser>
  unauthenticate: () => void
}

export function useFlowCurrentUser({
  flowClient,
}: UseFlowCurrentUserArgs = {}): UseFlowCurrentUserResult {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const fcl = useFlowClient({flowClient})

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
