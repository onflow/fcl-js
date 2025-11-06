import React, {useState} from "react"
import {useFlowCurrentUser} from "../hooks"
import {UseCrossVmTokenBalanceData} from "../hooks/useCrossVmTokenBalance"
import {Button, ButtonProps} from "./internal/Button"
import {Dialog} from "./internal/Dialog"
import {StyleWrapper} from "./internal/StyleWrapper"
import {Profile} from "./Profile"

type BalanceType = keyof UseCrossVmTokenBalanceData

export type TokenConfig = {
  symbol: string
  name: string
} & (
  | {vaultIdentifier: string; erc20Address?: never}
  | {vaultIdentifier?: never; erc20Address: string}
)

export interface ConnectModalConfig {
  scheduledTransactions?: {
    show?: boolean
    filterHandlerTypes?: string[]
  }
}

interface ConnectProps {
  variant?: ButtonProps["variant"]
  onConnect?: () => void
  onDisconnect?: () => void
  balanceType?: BalanceType
  balanceTokens?: TokenConfig[]
  modalConfig?: ConnectModalConfig
  modalEnabled?: boolean
}

export const Connect: React.FC<ConnectProps> = ({
  variant = "primary",
  onConnect,
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
  modalConfig = {},
  modalEnabled = true,
}) => {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [open, setOpen] = useState(false)

  const showScheduledTransactions =
    modalConfig.scheduledTransactions?.show ?? false
  const modalWidth = showScheduledTransactions
    ? "flow-max-w-xl"
    : "flow-max-w-md"

  const displayAddress =
    user?.loggedIn && user.addr
      ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
      : ""

  const handleButtonClick = async () => {
    if (user?.loggedIn) {
      if (modalEnabled) {
        setOpen(true)
      } else {
        // Disconnect when modal is disabled
        handleDisconnect()
      }
    } else {
      await authenticate()
      onConnect?.()
    }
  }

  const handleDisconnect = () => {
    unauthenticate()
    setOpen(false)
    onDisconnect?.()
  }

  return (
    <>
      <StyleWrapper>
        <Button
          onClick={handleButtonClick}
          variant={user?.loggedIn ? "outline" : variant}
          className="flow-px-2 flow-text-sm"
        >
          {user?.loggedIn ? displayAddress : "Connect Wallet"}
        </Button>
      </StyleWrapper>
      {user?.loggedIn && modalEnabled && (
        <Dialog
          isOpen={open}
          onClose={() => setOpen(false)}
          className={modalWidth}
        >
          <Profile
            onDisconnect={handleDisconnect}
            balanceType={balanceType}
            balanceTokens={balanceTokens}
            profileConfig={modalConfig}
          />
        </Dialog>
      )}
    </>
  )
}
