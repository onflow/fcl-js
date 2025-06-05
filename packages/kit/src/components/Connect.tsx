import React, {useState} from "react"
import {useCurrentFlowUser} from "../hooks"
import {Button, ButtonProps} from "./internal/Button"
import {Dialog} from "./internal/Dialog"
import {CircleUserRoundIcon} from "../icons/CircleUserRoundIcon"
import {CopyIcon} from "../icons/CopyIcon"
import {LogOutIcon} from "../icons/LogOutIcon"

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
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayAddress =
    user?.loggedIn && user.addr
      ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
      : ""

  const handleButtonClick = async () => {
    if (user?.loggedIn) {
      setOpen(true)
    } else {
      await authenticate()
      onConnect?.()
    }
  }

  const handleCopy = async () => {
    if (
      user?.addr &&
      typeof window !== "undefined" &&
      window.navigator.clipboard
    ) {
      await window.navigator.clipboard.writeText(user.addr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleDisconnect = () => {
    unauthenticate()
    setOpen(false)
    onDisconnect?.()
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
        variant={user?.loggedIn ? "outline" : variant}
        className="px-2"
      >
        {user?.loggedIn ? displayAddress : "Connect Wallet"}
      </Button>
      {user?.loggedIn && (
        <Dialog isOpen={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col items-center gap-4 min-w-[320px]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <CircleUserRoundIcon className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-center text-lg font-semibold mb-0">
                {displayAddress}
              </div>
              <div className="text-center text-sm text-gray-500 -mt-1">
                1,416.00 FLOW
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <span className="mr-2 h-4 w-4">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy Address
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center"
                onClick={handleDisconnect}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
