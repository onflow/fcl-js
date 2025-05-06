import React from "react"
import {useCurrentFlowUser} from "../hooks"
import {Button, ButtonProps} from "./internal/Button"

interface ConnectProps {
  variant?: ButtonProps["variant"]
}

export const Connect: React.FC<ConnectProps> = ({variant = "primary"}) => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <Button
      variant={variant}
      onClick={user.loggedIn ? unauthenticate : authenticate}
    >
      {user.loggedIn ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  )
}
