import React from "react"
import {useCurrentFlowUser} from "../hooks"
import {Button} from "@headlessui/react"

export const Connect: React.FC = () => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <Button
      onClick={user.loggedIn ? () => unauthenticate() : () => authenticate()}
    >
      {user.loggedIn ? "Disconnect" : "Connect"}
    </Button>
  )
}
