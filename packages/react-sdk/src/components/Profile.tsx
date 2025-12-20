import React, {useState, useEffect, useMemo} from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react"
import {sansPrefix} from "@onflow/fcl"
import {useFlowCurrentUser, truncateAddress} from "@onflow/react-core"
import {
  useCrossVmTokenBalance,
  UseCrossVmTokenBalanceData,
} from "@onflow/react-core"
import {useFlowChainId} from "@onflow/react-core"
import {Button} from "./internal/Button"
import {StyleWrapper} from "./internal/StyleWrapper"
import {UserIcon} from "../icons/UserIcon"
import {CopyIcon} from "../icons/CopyIcon"
import {LogOutIcon} from "../icons/LogOutIcon"
import {ExternalLinkIcon} from "../icons/ExternalLink"
import {ScheduledTransactionList} from "./ScheduledTransactionList"
import {CONTRACT_ADDRESSES, getFlowscanAccountUrl} from "@onflow/react-core"
import {twMerge} from "tailwind-merge"
import type {TokenConfig, ConnectModalConfig} from "./Connect"
import {useTheme} from "../core/theme"

type BalanceType = keyof UseCrossVmTokenBalanceData

export interface ProfileConfig extends ConnectModalConfig {}

interface ProfileProps {
  onDisconnect?: () => void
  balanceType?: BalanceType
  balanceTokens?: TokenConfig[]
  profileConfig?: ProfileConfig
  className?: string
  style?: React.CSSProperties
}

export const Profile: React.FC<ProfileProps> = ({
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
  profileConfig = {},
  className,
  style,
}) => {
  const {user, unauthenticate} = useFlowCurrentUser()
  const [copied, setCopied] = useState(false)
  const {data: chainId} = useFlowChainId()
  const {colors} = useTheme()

  // Default token configuration for FlowToken - memoized to avoid recreation
  const defaultTokens: TokenConfig[] = useMemo(() => {
    if (!chainId) return []

    const getFlowTokenAddress = () => {
      if (chainId === "emulator" || chainId === "local")
        return CONTRACT_ADDRESSES.local.FlowToken
      return chainId === "testnet"
        ? CONTRACT_ADDRESSES.testnet.FlowToken
        : CONTRACT_ADDRESSES.mainnet.FlowToken
    }

    const address = sansPrefix(getFlowTokenAddress())
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
    setSelectedToken((prev: any) => {
      // If no tokens available yet, return undefined
      if (!availableTokens || availableTokens.length === 0) return undefined
      // If prev is undefined (first load), return first available token
      if (!prev) return availableTokens[0]

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

  const showScheduledTransactions =
    profileConfig.scheduledTransactions?.show ?? false

  const {data: balanceData} = useCrossVmTokenBalance({
    owner: user?.addr,
    vaultIdentifier: selectedToken?.vaultIdentifier,
    erc20Address: selectedToken?.erc20Address,
    query: {
      enabled:
        !!user?.addr &&
        !!chainId &&
        !!selectedToken &&
        (!!selectedToken?.vaultIdentifier || !!selectedToken?.erc20Address),
    },
  })

  const displayAddress =
    user?.loggedIn && user.addr ? truncateAddress(user.addr) : ""

  const flowscanUrl = getFlowscanAccountUrl(user?.addr || "", chainId)

  // Get balance for the selected type
  const displayBalance =
    balanceData &&
    typeof balanceData !== "string" &&
    balanceData[balanceType]?.formatted
      ? Number(balanceData[balanceType].formatted).toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 0,
        })
      : "0"

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
    onDisconnect?.()
  }

  // Not connected state - compact design
  if (!user?.loggedIn) {
    return (
      <StyleWrapper>
        <div
          className={twMerge(
            "flow-w-full flow-h-full flow-flex flow-flex-col",
            className
          )}
          style={style}
        >
          <div
            className="flow-flex flow-flex-col flow-items-center flow-justify-center flow-gap-3
              flow-py-12"
          >
            <div
              className={twMerge(
                `flow-w-16 flow-h-16 flow-rounded-full flow-flex flow-items-center
                flow-justify-center`,
                colors.muted
              )}
            >
              <UserIcon
                className={twMerge("flow-w-8 flow-h-8", colors.mutedForeground)}
              />
            </div>
            <p
              className={twMerge(
                "flow-text-sm flow-font-medium",
                colors.mutedForeground
              )}
            >
              No connected wallet
            </p>
          </div>
        </div>
      </StyleWrapper>
    )
  }

  // Connected state - full profile
  return (
    <StyleWrapper>
      <div
        className={twMerge(
          "flow-w-full flow-h-full flow-flex flow-flex-col",
          className
        )}
        style={style}
      >
        <div className="flow-flex flow-flex-col flow-gap-4">
          <div className="flow-flex flow-flex-col flow-items-center">
            <div
              className={twMerge(
                `flow-w-16 flow-h-16 flow-rounded-full flow-flex flow-items-center
                flow-justify-center flow-mb-3`,
                colors.muted
              )}
            >
              <UserIcon
                className={twMerge("flow-w-8 flow-h-8", colors.foreground)}
              />
            </div>
            <div className="flow-flex flow-items-center flow-gap-2">
              <div
                className={twMerge(
                  "flow-text-base flow-font-medium",
                  colors.foreground
                )}
              >
                {displayAddress}
              </div>
              {flowscanUrl && (
                <a
                  href={flowscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={twMerge(
                    "flow-transition-colors hover:flow-opacity-80",
                    colors.mutedForeground
                  )}
                  title="View on Flowscan"
                >
                  <ExternalLinkIcon className="flow-w-4 flow-h-4" />
                </a>
              )}
            </div>
          </div>

          {showScheduledTransactions ? (
            <TabGroup>
              <TabList
                className={twMerge(
                  "flow-flex flow-gap-6 flow-border-b",
                  colors.border
                )}
              >
                <Tab
                  className={twMerge(
                    "flow-relative flow-py-3 flow-px-1 flow-text-sm flow-font-medium",
                    "hover:flow-opacity-80 focus:flow-outline-none flow-transition-colors",
                    colors.mutedForeground
                  )}
                >
                  {({selected}) => (
                    <>
                      <span className={selected ? colors.foreground : ""}>
                        Home
                      </span>
                      {selected && (
                        <div
                          className={twMerge(
                            "flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5",
                            colors.primary
                          )}
                        />
                      )}
                    </>
                  )}
                </Tab>
                <Tab
                  className={twMerge(
                    "flow-relative flow-py-3 flow-px-1 flow-text-sm flow-font-medium",
                    "hover:flow-opacity-80 focus:flow-outline-none flow-transition-colors",
                    colors.mutedForeground
                  )}
                >
                  {({selected}) => (
                    <>
                      <span className={selected ? colors.foreground : ""}>
                        Scheduled Transactions
                      </span>
                      {selected && (
                        <div
                          className={twMerge(
                            "flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5",
                            colors.primary
                          )}
                        />
                      )}
                    </>
                  )}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel className="flow-pt-4 focus:flow-outline-none">
                  <div className="flow-w-full flow-space-y-3">
                    <div className="flow-flex flow-items-stretch flow-gap-3">
                      {availableTokens.length > 1 && (
                        <div
                          className="flow-flex-shrink-0"
                          style={{minWidth: "140px"}}
                        >
                          <Listbox
                            value={selectedToken}
                            onChange={setSelectedToken}
                          >
                            {({open}) => (
                              <div className="flow-relative flow-h-full">
                                <ListboxButton
                                  className={twMerge(
                                    "flow-relative flow-w-full flow-h-full flow-cursor-pointer flow-rounded-md",
                                    "flow-py-2.5 flow-px-3 flow-text-left flow-border",
                                    "hover:flow-opacity-80 focus:flow-outline-none flow-transition-colors",
                                    colors.background,
                                    colors.border
                                  )}
                                >
                                  <div className="flow-flex flow-flex-col flow-justify-center flow-h-full">
                                    <span
                                      className={twMerge(
                                        "flow-text-xs flow-font-medium flow-mb-1",
                                        colors.mutedForeground
                                      )}
                                    >
                                      Token
                                    </span>
                                    <div className="flow-flex flow-items-center flow-justify-between flow-gap-2">
                                      <span
                                        className={twMerge(
                                          "flow-text-sm flow-font-semibold flow-truncate",
                                          colors.foreground
                                        )}
                                      >
                                        {selectedToken?.symbol}
                                      </span>
                                      <svg
                                        className={twMerge(
                                          "flow-h-4 flow-w-4 flow-flex-shrink-0",
                                          colors.mutedForeground
                                        )}
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
                                    className={twMerge(
                                      "flow-absolute flow-z-10 flow-mt-2 flow-w-48 flow-overflow-auto flow-rounded-md",
                                      "flow-py-2 flow-border focus:flow-outline-none flow-max-h-64",
                                      colors.background,
                                      colors.border
                                    )}
                                  >
                                    {availableTokens.map(
                                      (token: TokenConfig) => (
                                        <ListboxOption
                                          key={token.symbol}
                                          value={token}
                                          className={twMerge(
                                            "flow-relative flow-cursor-pointer flow-select-none flow-py-2.5 flow-px-4",
                                            "data-[focus]:flow-opacity-80 flow-transition-colors",
                                            colors.foreground
                                          )}
                                        >
                                          {({selected}) => (
                                            <div className="flow-flex flow-items-center flow-justify-between">
                                              <div>
                                                <div
                                                  className={`flow-text-sm ${selected ? "flow-font-semibold" : "flow-font-medium"}`}
                                                >
                                                  {token.name}
                                                </div>
                                                <div
                                                  className={twMerge(
                                                    "flow-text-xs flow-mt-0.5",
                                                    colors.mutedForeground
                                                  )}
                                                >
                                                  {token.symbol}
                                                </div>
                                              </div>
                                              {selected && (
                                                <svg
                                                  className={twMerge(
                                                    "flow-h-5 flow-w-5",
                                                    colors.foreground
                                                  )}
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
                                      )
                                    )}
                                  </ListboxOptions>
                                )}
                              </div>
                            )}
                          </Listbox>
                        </div>
                      )}

                      <div
                        className={twMerge(
                          "flow-flex-1 flow-rounded-md flow-border flow-px-4 flow-py-2.5",
                          colors.muted,
                          colors.border
                        )}
                      >
                        <div
                          className={twMerge(
                            "flow-text-xs flow-font-medium flow-mb-1",
                            colors.mutedForeground
                          )}
                        >
                          Balance
                        </div>
                        <div
                          className={twMerge(
                            "flow-text-xl flow-font-semibold flow-leading-tight",
                            colors.foreground
                          )}
                        >
                          {displayBalance}{" "}
                          <span
                            className={twMerge(
                              "flow-text-sm flow-font-medium",
                              colors.mutedForeground
                            )}
                          >
                            {selectedToken?.symbol}
                          </span>
                        </div>
                      </div>
                    </div>
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
                </TabPanel>

                <TabPanel className="flow-pt-4 focus:flow-outline-none">
                  <div
                    className="flow-overflow-y-auto flow-pr-2"
                    style={{maxHeight: "250px", minHeight: "100px"}}
                  >
                    <ScheduledTransactionList
                      address={user.addr || ""}
                      filterHandlerTypes={
                        profileConfig.scheduledTransactions?.filterHandlerTypes
                      }
                    />
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          ) : (
            <>
              <div className="flow-w-full flow-space-y-3">
                <div className="flow-flex flow-items-stretch flow-gap-3">
                  {availableTokens.length > 1 && (
                    <div
                      className="flow-flex-shrink-0"
                      style={{minWidth: "140px"}}
                    >
                      <Listbox
                        value={selectedToken}
                        onChange={setSelectedToken}
                      >
                        {({open}) => (
                          <div className="flow-relative flow-h-full">
                            <ListboxButton
                              className={twMerge(
                                "flow-relative flow-w-full flow-h-full flow-cursor-pointer flow-rounded-md",
                                "flow-py-2.5 flow-px-3 flow-text-left flow-border",
                                "hover:flow-opacity-80 focus:flow-outline-none flow-transition-colors",
                                colors.background,
                                colors.border
                              )}
                            >
                              <div className="flow-flex flow-flex-col flow-justify-center flow-h-full">
                                <span
                                  className={twMerge(
                                    "flow-text-xs flow-font-medium flow-mb-1",
                                    colors.mutedForeground
                                  )}
                                >
                                  Token
                                </span>
                                <div className="flow-flex flow-items-center flow-justify-between flow-gap-2">
                                  <span
                                    className={twMerge(
                                      "flow-text-sm flow-font-semibold flow-truncate",
                                      colors.foreground
                                    )}
                                  >
                                    {selectedToken?.symbol}
                                  </span>
                                  <svg
                                    className={twMerge(
                                      "flow-h-4 flow-w-4 flow-flex-shrink-0",
                                      colors.mutedForeground
                                    )}
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
                                className={twMerge(
                                  "flow-absolute flow-z-10 flow-mt-2 flow-w-48 flow-overflow-auto flow-rounded-md",
                                  "flow-py-2 flow-border focus:flow-outline-none flow-max-h-64",
                                  colors.background,
                                  colors.border
                                )}
                              >
                                {availableTokens.map((token: TokenConfig) => (
                                  <ListboxOption
                                    key={token.symbol}
                                    value={token}
                                    className={twMerge(
                                      "flow-relative flow-cursor-pointer flow-select-none flow-py-2.5 flow-px-4",
                                      "data-[focus]:flow-opacity-80 flow-transition-colors",
                                      colors.foreground
                                    )}
                                  >
                                    {({selected}) => (
                                      <div className="flow-flex flow-items-center flow-justify-between">
                                        <div>
                                          <div
                                            className={`flow-text-sm ${selected ? "flow-font-semibold" : "flow-font-medium"}`}
                                          >
                                            {token.name}
                                          </div>
                                          <div
                                            className={twMerge(
                                              "flow-text-xs flow-mt-0.5",
                                              colors.mutedForeground
                                            )}
                                          >
                                            {token.symbol}
                                          </div>
                                        </div>
                                        {selected && (
                                          <svg
                                            className={twMerge(
                                              "flow-h-5 flow-w-5",
                                              colors.foreground
                                            )}
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
                    className={twMerge(
                      "flow-flex-1 flow-rounded-md flow-border flow-px-4 flow-py-2.5",
                      colors.muted,
                      colors.border
                    )}
                  >
                    <div
                      className={twMerge(
                        "flow-text-xs flow-font-medium flow-mb-1",
                        colors.mutedForeground
                      )}
                    >
                      Balance
                    </div>
                    <div
                      className={twMerge(
                        "flow-text-xl flow-font-semibold flow-leading-tight",
                        colors.foreground
                      )}
                    >
                      {displayBalance}{" "}
                      <span
                        className={twMerge(
                          "flow-text-sm flow-font-medium",
                          colors.mutedForeground
                        )}
                      >
                        {selectedToken?.symbol}
                      </span>
                    </div>
                  </div>
                </div>
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
            </>
          )}
        </div>
      </div>
    </StyleWrapper>
  )
}
