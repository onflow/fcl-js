import React from "react"
import {useCurrentFlowUser} from "../hooks"
import {Button} from "./internal/Button"

export const Connect: React.FC = () => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <Button
      variant="primary"
      onClick={user.loggedIn ? () => unauthenticate() : () => authenticate()}
    >
      {user.loggedIn ? "Disconnect" : "Connect"}
    </Button>
  )
}
