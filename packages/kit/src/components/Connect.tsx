import React from "react"
import {useCurrentFlowUser} from "../hooks"
import {Button, ButtonProps} from "./internal/Button"

interface ConnectProps {
  variant?: ButtonProps["variant"]
  onConnect?: () => void
  onDisconnect?: () => void
}

export const Connect: React.FC<ConnectProps> = ({
  variant = "primary",
  onConnect,
  onDisconnect,
}) => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  const handleConnect = async () => {
    await authenticate()
    onConnect?.()
  }

  const handleDisconnect = () => {
    unauthenticate()
    onDisconnect?.()
  }

  return (
    <Button
      variant={variant}
      onClick={user.loggedIn ? handleDisconnect : handleConnect}
    >
      {user.loggedIn ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  )
}
