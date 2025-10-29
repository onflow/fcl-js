import React, {useState, useEffect, useMemo} from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
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
import {ExternalLinkIcon} from "../icons/ExternalLink"

type BalanceType = keyof UseCrossVmTokenBalanceData

export interface TokenConfig {
  symbol: string
  name: string
  vaultIdentifier?: string
  erc20Address?: string
}

interface ConnectProps {
  variant?: ButtonProps["variant"]
  onConnect?: () => void
  onDisconnect?: () => void
  balanceType?: BalanceType
  balanceTokens?: TokenConfig[]
}

export const Connect: React.FC<ConnectProps> = ({
  variant = "primary",
  onConnect,
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
}) => {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const {data: chainId} = useFlowChainId()

  // Default token configuration for FlowToken - memoized to avoid recreation
  const defaultTokens: TokenConfig[] = useMemo(() => {
    if (!chainId) return [{symbol: "FLOW", name: "Flow Token"}]

    const address =
      chainId === "testnet" ? "7e60df042a9c0868" : "1654653399040a61"
    return [
      {
        symbol: "FLOW",
        name: "Flow Token",
        vaultIdentifier: `A.${address}.FlowToken.Vault`,
      },
    ]
  }, [chainId])

  // Use provided tokens or default to FLOW - memoized to avoid recreation
  const availableTokens = useMemo(
    () =>
      balanceTokens && balanceTokens.length > 0 ? balanceTokens : defaultTokens,
    [balanceTokens, defaultTokens]
  )

  // Initialize with first token, but will update when availableTokens changes
  const [selectedToken, setSelectedToken] = useState<TokenConfig>(
    availableTokens[0] || defaultTokens[0]
  )

  // Update selectedToken when availableTokens changes (when chainId loads or balanceTokens prop changes)
  useEffect(() => {
    setSelectedToken(prev => {
      // Find the same token in the new list (match by symbol)
      const updatedToken = availableTokens.find(t => t.symbol === prev.symbol)

      // If the token is no longer in the list, switch to first token
      if (!updatedToken) {
        return availableTokens[0]
      }

      // If we found the same token but it now has more data (chainId loaded), use the updated version
      if (
        (!prev.vaultIdentifier && updatedToken.vaultIdentifier) ||
        (!prev.erc20Address && updatedToken.erc20Address)
      ) {
        return updatedToken
      }

      // Keep the current selection if nothing changed
      return prev
    })
  }, [availableTokens])

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

  // Get Flowscan URL based on network
  const getFlowscanUrl = () => {
    if (!user?.addr || !chainId) return null
    if (chainId === "emulator" || chainId === "local") return null

    const baseUrl =
      chainId === "testnet"
        ? "https://testnet.flowscan.io"
        : "https://flowscan.io"

    return `${baseUrl}/account/${user.addr}`
  }

  const flowscanUrl = getFlowscanUrl()

  const hasData = balanceData && typeof balanceData !== "string"

  // Helper to format balance with max 4 decimals, removing trailing zeros
  const formatBalance = (value: string) => {
    const num = parseFloat(value)
    return num.toFixed(4).replace(/\.?0+$/, "")
  }

  const cadenceBalance =
    hasData && selectedToken?.vaultIdentifier && balanceData.cadence
      ? formatBalance(balanceData.cadence.formatted)
      : null

  const evmBalance =
    hasData && selectedToken?.erc20Address && balanceData.evm
      ? formatBalance(balanceData.evm.formatted)
      : null

  const showBreakdown = cadenceBalance !== null && evmBalance !== null

  // Get balance for the selected type
  const displayBalance =
    hasData && balanceData[balanceType]
      ? formatBalance(balanceData[balanceType].formatted)
      : "0"

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
          <div className="flow-flex flow-flex-col flow-items-center flow-w-full flow-min-w-[320px]">
            <div className="flow-flex flow-flex-col flow-items-center flow-w-full flow-mb-6">
              <div
                className="flow-w-16 flow-h-16 flow-rounded-full flow-bg-slate-100 dark:flow-bg-slate-800
                  flow-flex flow-items-center flow-justify-center flow-mb-3"
              >
                <UserIcon className="flow-w-8 flow-h-8 flow-text-slate-900 dark:flow-text-slate-100" />
              </div>
              <div className="flow-flex flow-items-center flow-gap-2">
                <div className="flow-text-base flow-font-medium flow-text-slate-900 dark:flow-text-slate-100">
                  {displayAddress}
                </div>
                {flowscanUrl && (
                  <a
                    href={flowscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flow-text-slate-500 hover:flow-text-slate-700 dark:flow-text-slate-400
                      dark:hover:flow-text-slate-200 flow-transition-colors"
                    title="View on Flowscan"
                  >
                    <ExternalLinkIcon className="flow-w-4 flow-h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="flow-w-full flow-space-y-3">
              <div className="flow-flex flow-items-stretch flow-gap-3">
                {availableTokens.length > 1 && (
                  <div
                    className="flow-flex-shrink-0"
                    style={{minWidth: "140px"}}
                  >
                    <Listbox value={selectedToken} onChange={setSelectedToken}>
                      {({open}) => (
                        <div className="flow-relative flow-h-full">
                          <ListboxButton
                            className="flow-relative flow-w-full flow-h-full flow-cursor-pointer flow-rounded-md
                              flow-bg-white dark:flow-bg-slate-800 flow-py-2.5 flow-px-3 flow-text-left
                              flow-border flow-border-slate-300 dark:flow-border-slate-600
                              hover:flow-border-slate-400 dark:hover:flow-border-slate-500
                              focus:flow-outline-none focus:flow-border-slate-400
                              dark:focus:flow-border-slate-500 flow-transition-colors"
                          >
                            <div className="flow-flex flow-flex-col flow-justify-center flow-h-full">
                              <span
                                className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                                  flow-mb-1"
                              >
                                Token
                              </span>
                              <div className="flow-flex flow-items-center flow-justify-between flow-gap-2">
                                <span
                                  className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100
                                    flow-truncate"
                                >
                                  {selectedToken?.symbol}
                                </span>
                                <svg
                                  className="flow-h-4 flow-w-4 flow-text-slate-400 dark:flow-text-slate-500
                                    flow-flex-shrink-0"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </ListboxButton>
                          {open && (
                            <ListboxOptions
                              static
                              className="flow-absolute flow-z-10 flow-mt-2 flow-w-48 flow-overflow-auto flow-rounded-md
                                flow-bg-white dark:flow-bg-slate-800 flow-py-2 flow-border flow-border-slate-300
                                dark:flow-border-slate-600 focus:flow-outline-none flow-max-h-64"
                            >
                              {availableTokens.map((token: TokenConfig) => (
                                <ListboxOption
                                  key={token.symbol}
                                  value={token}
                                  className="flow-relative flow-cursor-pointer flow-select-none flow-py-2.5 flow-px-4
                                    data-[focus]:flow-bg-slate-100 data-[focus]:dark:flow-bg-slate-700
                                    flow-text-slate-900 dark:flow-text-slate-100 flow-transition-colors"
                                >
                                  {({selected}) => (
                                    <div className="flow-flex flow-items-center flow-justify-between">
                                      <div>
                                        <div
                                          className={`flow-text-sm ${selected ? "flow-font-semibold" : "flow-font-medium"}`}
                                        >
                                          {token.name}
                                        </div>
                                        <div className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-mt-0.5">
                                          {token.symbol}
                                        </div>
                                      </div>
                                      {selected && (
                                        <svg
                                          className="flow-h-5 flow-w-5 flow-text-slate-900 dark:flow-text-slate-100"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                  )}
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                )}

                <div
                  className="flow-flex-1 flow-rounded-md flow-bg-slate-50 dark:flow-bg-slate-800/50
                    flow-border flow-border-slate-200 dark:flow-border-slate-700 flow-px-4
                    flow-py-2.5"
                >
                  <div
                    className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                      flow-mb-1"
                  >
                    Balance
                  </div>
                  <div
                    className="flow-text-xl flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100
                      flow-leading-tight"
                  >
                    {displayBalance}{" "}
                    <span className="flow-text-sm flow-font-medium flow-text-slate-600 dark:flow-text-slate-400">
                      {selectedToken?.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {showBreakdown && balanceType !== "combined" && (
                <div className="flow-grid flow-grid-cols-2 flow-gap-3">
                  <div
                    className="flow-rounded-md flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                      flow-border-slate-200 dark:flow-border-slate-700 flow-px-3 flow-py-2 flow-flex
                      flow-items-center flow-justify-between"
                  >
                    <div className="flow-flex flow-items-center flow-gap-1.5">
                      <svg
                        className="flow-w-3.5 flow-h-3.5 flow-text-slate-600 dark:flow-text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 13.24a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 00.22-.53v-4.77z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="flow-text-xs flow-font-medium flow-text-slate-600 dark:flow-text-slate-400">
                        Cadence
                      </span>
                    </div>
                    <div className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100">
                      {cadenceBalance}
                    </div>
                  </div>
                  <div
                    className="flow-rounded-md flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                      flow-border-slate-200 dark:flow-border-slate-700 flow-px-3 flow-py-2 flow-flex
                      flow-items-center flow-justify-between"
                  >
                    <div className="flow-flex flow-items-center flow-gap-1.5">
                      <svg
                        className="flow-w-3.5 flow-h-3.5 flow-text-slate-600 dark:flow-text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span className="flow-text-xs flow-font-medium flow-text-slate-600 dark:flow-text-slate-400">
                        EVM
                      </span>
                    </div>
                    <div className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100">
                      {evmBalance}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flow-flex flow-gap-3 flow-w-full flow-mt-6">
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
