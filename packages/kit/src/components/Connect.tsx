import React from "react"
import {useCurrentFlowUser} from "../hooks"

export const Connect: React.FC = () => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <button
      onClick={user.loggedIn ? () => unauthenticate() : () => authenticate()}
    >
      {user.loggedIn ? "Disconnect" : "Connect"}
    </button>
  )
}
