import React, {useState} from "react"
import {useFlowCurrentUser} from "../hooks"
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

export interface TokenConfig {
  symbol: string
  name: string
  vaultIdentifier?: string
  erc20Address?: string
}

export interface ConnectModalConfig {
  balance?: {
    tokens?: TokenConfig[]
    defaultSymbol?: string
  }
}

interface ConnectProps {
  variant?: ButtonProps["variant"]
  onConnect?: () => void
  onDisconnect?: () => void
  balanceType?: BalanceType
  modalConfig?: ConnectModalConfig
}

export const Connect: React.FC<ConnectProps> = ({
  variant = "primary",
  onConnect,
  onDisconnect,
  balanceType = "cadence",
  modalConfig = {},
}) => {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const {data: chainId} = useFlowChainId()

  // Default token configuration for FlowToken
  const defaultTokens: TokenConfig[] = [
    {
      symbol: "FLOW",
      name: "Flow Token",
      vaultIdentifier: `A.${chainId === "testnet" ? "7e60df042a9c0868" : "1654653399040a61"}.FlowToken.Vault`,
    },
  ]

  // Read configuration from modalConfig.balance
  const balanceConfig = modalConfig.balance || {}
  const availableTokens = balanceConfig.tokens || defaultTokens
  const initialSymbol =
    balanceConfig.defaultSymbol || availableTokens[0]?.symbol || "FLOW"

  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)

  const selectedToken = availableTokens.find(
    (t: TokenConfig) => t.symbol === selectedSymbol
  )

  const {data: balanceData} = useCrossVmTokenBalance({
    owner: user?.addr,
    vaultIdentifier: selectedToken?.vaultIdentifier,
    erc20Address: selectedToken?.erc20Address,
    query: {
      enabled:
        !!user?.addr &&
        !!chainId &&
        !!selectedToken &&
        (!!selectedToken.vaultIdentifier || !!selectedToken.erc20Address),
    },
  })

  const displayAddress =
    user?.loggedIn && user.addr
      ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
      : ""

  const displayBalance =
    balanceData && typeof balanceData !== "string"
      ? `${Number(balanceData[balanceType].formatted).toLocaleString()} ${selectedToken?.symbol || "-"}`
      : `0.00 ${selectedToken?.symbol || "-"}`

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
      <StyleWrapper>
        <Button
          onClick={handleButtonClick}
          variant={user?.loggedIn ? "outline" : variant}
          className="flow-px-2 flow-text-sm"
        >
          {user?.loggedIn ? displayAddress : "Connect Wallet"}
        </Button>
      </StyleWrapper>
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

              {availableTokens.length > 1 && (
                <div className="flow-w-full flow-mt-3">
                  <label className="flow-block flow-text-xs flow-text-gray-500 flow-mb-1 flow-text-center">
                    Token
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={e => setSelectedSymbol(e.target.value)}
                    className="flow-w-full flow-px-3 flow-py-2 flow-text-sm flow-rounded-lg flow-border
                      flow-border-gray-300 dark:flow-border-gray-700 flow-bg-white
                      dark:flow-bg-gray-800 flow-text-gray-900 dark:flow-text-white
                      focus:flow-outline-none focus:flow-ring-2 focus:flow-ring-blue-500"
                  >
                    {availableTokens.map((token: TokenConfig) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flow-text-center flow-text-sm flow-text-gray-500 flow-mt-3">
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
    </>
  )
}
