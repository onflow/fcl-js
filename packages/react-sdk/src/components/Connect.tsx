import React, {useState} from "react"
import {useCurrentFlowUser} from "../hooks"
import {
  useCrossVmTokenBalance,
  UseCrossVmTokenBalanceData,
} from "../hooks/useCrossVmTokenBalance"
import {useFlowChainId} from "../hooks/useFlowChainId"
import {Button, ButtonProps} from "./internal/Button"
import {Dialog} from "./internal/Dialog"
import {StyleWrapper} from "./internal/StyleWrapper"
import {UserIcon} from "../icons/UserIcon"
import {CopyIcon} from "../icons/CopyIcon"
import {LogOutIcon} from "../icons/LogOutIcon"

type BalanceType = keyof UseCrossVmTokenBalanceData

interface ConnectProps {
  variant?: ButtonProps["variant"]
  onConnect?: () => void
  onDisconnect?: () => void
  balanceType?: BalanceType
}

export const Connect: React.FC<ConnectProps> = ({
  variant = "primary",
  onConnect,
  onDisconnect,
  balanceType = "cadence",
}) => {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const {data: chainId} = useFlowChainId()

  const {data: balanceData} = useCrossVmTokenBalance({
    owner: user?.addr,
    vaultIdentifier: `A.${chainId === "testnet" ? "7e60df042a9c0868" : "1654653399040a61"}.FlowToken.Vault`,
    query: {
      enabled: !!user?.addr && !!chainId,
    },
  })

  const displayAddress =
    user?.loggedIn && user.addr
      ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
      : ""

  const displayBalance =
    balanceData && typeof balanceData !== "string"
      ? `${Number(balanceData[balanceType].formatted).toLocaleString()} FLOW`
      : "0.00 FLOW"

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
    <StyleWrapper>
      <Button
        onClick={handleButtonClick}
        variant={user?.loggedIn ? "outline" : variant}
        className="flow-px-2 flow-text-sm"
      >
        {user?.loggedIn ? displayAddress : "Connect Wallet"}
      </Button>
      {user?.loggedIn && (
        <Dialog isOpen={open} onClose={() => setOpen(false)}>
          <div className="flow-flex flow-flex-col flow-items-center flow-gap-4 flow-min-w-[320px]">
            <div className="flow-flex flow-flex-col flow-items-center">
              <div
                className={`flow-w-16 flow-h-16 flow-rounded-full flow-bg-slate-100 flow-flex
                flow-items-center flow-justify-center flow-mb-2`}
              >
                <UserIcon className="flow-w-8 flow-h-8 flow-text-black" />
              </div>
              <div className="flow-text-center flow-text-lg flow-font-semibold flow-mb-0">
                {displayAddress}
              </div>
              <div className="flow-text-center flow-text-sm flow-text-gray-500 flow-mt-2">
                {displayBalance}
              </div>
            </div>
            <div className="flow-flex flow-gap-2 flow-w-full">
              <Button
                variant="outline"
                className="flow-flex-1 flow-flex flow-items-center flow-justify-center flow-text-sm"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <span className="flow-mr-2 flow-h-4 flow-w-4">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="flow-mr-2 flow-h-4 flow-w-4" />
                    Copy Address
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flow-flex-1 flow-flex flow-items-center flow-justify-center flow-text-sm"
                onClick={handleDisconnect}
              >
                <LogOutIcon className="flow-mr-2 flow-h-4 flow-w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </StyleWrapper>
  )
}
