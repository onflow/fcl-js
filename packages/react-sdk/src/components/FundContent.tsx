import React, {useState, useEffect} from "react"
import {Tab, TabGroup, TabList, TabPanels} from "./internal/Tabs"
import {TabPanel} from "@headlessui/react"
import {Input} from "./internal/Input"
import {Button} from "./internal/Button"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "./internal/Listbox"
import {QRCode} from "./internal/QRCode"
import {Address} from "./internal/Address"
import {useFund} from "../hooks/useFund"
import {useFundingCapabilities} from "../hooks/useFundingCapabilities"
import {CryptoProviderCapability, CurrencyMetadata} from "@onflow/payments"
import {useFlowCurrentUser} from "../hooks/useFlowCurrentUser"
import {useFlowChainId} from "../hooks/useFlowChainId"
import {useQuery} from "@tanstack/react-query"
import {useFlowQueryClient} from "../provider/FlowQueryClient"
import * as viemChains from "viem/chains"

// Helper to get chain name from CAIP-2 ID
const getChainName = (caipId: string): string => {
  // Extract chain ID from CAIP-2 format (e.g., "eip155:1" -> 1)
  const parts = caipId.split(":")
  if (parts.length !== 2) return caipId

  const chainId = parseInt(parts[1])
  if (isNaN(chainId)) return caipId

  // Find matching chain in viem's chain definitions
  const chain = Object.values(viemChains).find(c => c?.id === chainId)
  return chain?.name || caipId
}

// Helper to convert Flow network name to Flow EVM chain ID
const getFlowEvmChainId = (network: string): number => {
  switch (network) {
    case "mainnet":
      return 747 // Flow EVM Mainnet
    case "testnet":
      return 545 // Flow EVM Testnet
    default:
      return 747 // Default to mainnet
  }
}

export const FundContent: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const {user} = useFlowCurrentUser()
  const {data: chainId} = useFlowChainId()

  // Fetch available funding capabilities
  const {
    data: capabilities,
    isLoading: isLoadingCapabilities,
    error: capabilitiesError,
  } = useFundingCapabilities()

  // Extract crypto capabilities
  const cryptoCapability = capabilities?.find(
    c => c.type === "crypto"
  ) as CryptoProviderCapability

  // Build SOURCE chains list (where user can send FROM)
  const sourceChains = (cryptoCapability?.sourceChains || []).map(
    (caipId, index) => ({
      id: index + 1,
      name: getChainName(caipId),
      caipId,
    })
  )

  const [selectedSourceChain, setSelectedSourceChain] = useState(
    sourceChains[0]
  )
  const [selectedSourceToken, setSelectedSourceToken] =
    useState<CurrencyMetadata | null>(null)

  // Update chain selection when capabilities load
  useEffect(() => {
    if (sourceChains.length > 0 && !selectedSourceChain) {
      setSelectedSourceChain(sourceChains[0])
    }
  }, [sourceChains])

  // Fetch currencies for the selected source chain
  const queryClient = useFlowQueryClient()
  const {data: chainCurrencies, isLoading: isLoadingCurrencies} = useQuery(
    {
      queryKey: ["chainCurrencies", selectedSourceChain?.caipId],
      queryFn: async () => {
        if (!selectedSourceChain || !cryptoCapability?.getCurrenciesForChain) {
          return []
        }
        const currencies = await cryptoCapability.getCurrenciesForChain(
          selectedSourceChain.caipId
        )

        // Whitelist of tokens that reliably support Relay deposit addresses
        // These have been tested and confirmed to work with Flow EVM as destination
        const SUPPORTED_TOKENS = new Set([
          // USDC (works on all chains)
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Ethereum
          "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // Base
          "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // Arbitrum
          "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", // Polygon
          // USDT (works on Base, Polygon)
          "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2", // Base
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // Polygon
        ])

        return currencies.filter(c =>
          SUPPORTED_TOKENS.has(c.address.toLowerCase())
        )
      },
      enabled: !!selectedSourceChain && !!cryptoCapability,
      staleTime: 5 * 60 * 1000,
    },
    queryClient
  )

  // Use currency metadata directly
  const sourceTokens = chainCurrencies || []

  // Fetch destination currencies for Flow EVM
  const {data: destinationCurrencies} = useQuery(
    {
      queryKey: ["destinationCurrencies", chainId],
      queryFn: async () => {
        if (!chainId || !cryptoCapability?.getCurrenciesForChain) {
          return []
        }
        // Fetch currencies available on Flow EVM (destination chain)
        const flowEvmChainId = getFlowEvmChainId(chainId)
        const currencies = await cryptoCapability.getCurrenciesForChain(
          `eip155:${flowEvmChainId}`
        )
        // Filter out native tokens (zero address) - Relay only supports ERC20 for deposit addresses
        return currencies.filter(
          c => c.address !== "0x0000000000000000000000000000000000000000"
        )
      },
      enabled: !!chainId && !!cryptoCapability,
      staleTime: 5 * 60 * 1000,
    },
    queryClient
  )

  // Update token selection when currencies load or chain changes
  useEffect(() => {
    if (sourceTokens.length > 0) {
      setSelectedSourceToken(sourceTokens[0])
    } else {
      setSelectedSourceToken(null)
    }
  }, [selectedSourceChain, chainCurrencies])

  // Initialize useFund hook with relay provider
  const {mutate: createSession, data: session, isPending, error} = useFund({})

  // Create funding session when crypto tab is selected and user is authenticated
  useEffect(() => {
    if (
      selectedTabIndex === 1 &&
      user?.addr &&
      chainId &&
      selectedSourceToken &&
      selectedSourceChain &&
      destinationCurrencies &&
      destinationCurrencies.length > 0
    ) {
      // User's Flow address as destination (in CAIP-10 format)
      const flowEvmChainId = getFlowEvmChainId(chainId)
      const destination = `eip155:${flowEvmChainId}:${user.addr}`

      createSession({
        kind: "crypto",
        destination,
        // Use first available destination currency (e.g., USDC on Flow EVM)
        // Relay will automatically bridge source token to this
        currency: destinationCurrencies[0].address,
        sourceChain: selectedSourceChain.caipId,
        sourceCurrency: selectedSourceToken.address,
        amount: amount || undefined,
      })
    }
  }, [
    selectedTabIndex,
    selectedSourceToken,
    selectedSourceChain,
    destinationCurrencies,
    amount,
    user?.addr,
    chainId,
    createSession,
  ])

  // Get the deposit address from the session
  const depositAddress =
    session && session.kind === "crypto"
      ? session.instructions.address
      : undefined

  return (
    <div className="flow-space-y-5">
      <h2 className="flow-text-xl flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100">
        Fund Your Account
      </h2>

      <TabGroup onChange={setSelectedTabIndex}>
        <TabList>
          <Tab>
            {({selected}) => (
              <>
                Credit Card
                {selected && (
                  <div
                    className="flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5
                      flow-bg-slate-900 dark:flow-bg-slate-100"
                  />
                )}
              </>
            )}
          </Tab>
          <Tab>
            {({selected}) => (
              <>
                Crypto Transfer
                {selected && (
                  <div
                    className="flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5
                      flow-bg-slate-900 dark:flow-bg-slate-100"
                  />
                )}
              </>
            )}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="flow-pt-6 focus:flow-outline-none">
            <div className="flow-space-y-5">
              <div
                className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                  flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
              >
                <label
                  className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                    flow-uppercase flow-tracking-wide"
                >
                  Amount
                </label>
                <div className="flow-flex flow-items-center flow-gap-3 flow-mt-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="flow-flex-1 flow-text-xl flow-font-medium"
                  />
                  <span className="flow-text-base flow-font-semibold flow-text-slate-500 dark:flow-text-slate-400">
                    USD
                  </span>
                </div>
                <div
                  className="flow-mt-3 flow-pt-3 flow-border-t flow-border-slate-200
                    dark:flow-border-slate-700"
                >
                  <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-400">
                    ≈{" "}
                    <span className="flow-font-medium flow-text-slate-700 dark:flow-text-slate-300">
                      0 FLOW
                    </span>
                  </p>
                </div>
              </div>
              <Button className="flow-w-full">Continue</Button>
            </div>
          </TabPanel>
          <TabPanel className="flow-pt-6 focus:flow-outline-none">
            <div className="flow-space-y-5">
              {!user?.addr && (
                <div
                  className="flow-rounded-lg flow-bg-yellow-50 dark:flow-bg-yellow-900/20 flow-border
                    flow-border-yellow-200 dark:flow-border-yellow-800 flow-p-4"
                >
                  <p className="flow-text-sm flow-text-yellow-800 dark:flow-text-yellow-200">
                    Please connect your wallet to generate a deposit address
                  </p>
                </div>
              )}

              {(isLoadingCapabilities || isLoadingCurrencies) && (
                <div
                  className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                    flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
                >
                  <p className="flow-text-sm flow-text-slate-600 dark:flow-text-slate-400">
                    {isLoadingCapabilities
                      ? "Loading available funding options..."
                      : "Loading available tokens..."}
                  </p>
                </div>
              )}

              {capabilitiesError && (
                <div
                  className="flow-rounded-lg flow-bg-red-50 dark:flow-bg-red-900/20 flow-border
                    flow-border-red-200 dark:flow-border-red-800 flow-p-4"
                >
                  <p className="flow-text-sm flow-text-red-800 dark:flow-text-red-200">
                    Failed to load funding options: {capabilitiesError.message}
                  </p>
                </div>
              )}

              {error && (
                <div
                  className="flow-rounded-lg flow-bg-red-50 dark:flow-bg-red-900/20 flow-border
                    flow-border-red-200 dark:flow-border-red-800 flow-p-4"
                >
                  <p className="flow-text-sm flow-text-red-800 dark:flow-text-red-200">
                    {error.message}
                  </p>
                </div>
              )}

              {!isLoadingCapabilities &&
                !isLoadingCurrencies &&
                sourceTokens.length > 0 &&
                sourceChains.length > 0 && (
                  <div className="flow-grid flow-grid-cols-2 flow-gap-3">
                    <div className="flow-space-y-1.5">
                      <label
                        className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                          flow-uppercase flow-tracking-wide"
                      >
                        Send Token
                      </label>
                      <Listbox
                        value={selectedSourceToken}
                        onChange={setSelectedSourceToken}
                        disabled={!user?.addr || isPending}
                      >
                        {({open}) => (
                          <div className="flow-relative">
                            <ListboxButton>
                              <div className="flow-flex flow-items-center flow-gap-2">
                                {selectedSourceToken?.logoURI && (
                                  <img
                                    src={selectedSourceToken.logoURI}
                                    alt={selectedSourceToken.symbol}
                                    className="flow-w-5 flow-h-5 flow-rounded-full"
                                  />
                                )}
                                <span>
                                  {selectedSourceToken?.symbol ||
                                    "Select token"}
                                </span>
                              </div>
                            </ListboxButton>
                            {open && (
                              <ListboxOptions>
                                {sourceTokens.map(token => (
                                  <ListboxOption
                                    key={token.address}
                                    value={token}
                                  >
                                    <div className="flow-flex flow-items-center flow-gap-2">
                                      {token.logoURI && (
                                        <img
                                          src={token.logoURI}
                                          alt={token.symbol}
                                          className="flow-w-5 flow-h-5 flow-rounded-full"
                                        />
                                      )}
                                      <div className="flow-flex flow-flex-col">
                                        <span className="flow-text-sm flow-font-medium">
                                          {token.symbol}
                                        </span>
                                        <span className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400">
                                          {token.name}
                                        </span>
                                      </div>
                                    </div>
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            )}
                          </div>
                        )}
                      </Listbox>
                    </div>
                    <div className="flow-space-y-1.5">
                      <label
                        className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                          flow-uppercase flow-tracking-wide"
                      >
                        From Chain
                      </label>
                      <Listbox
                        value={selectedSourceChain}
                        onChange={setSelectedSourceChain}
                        disabled={!user?.addr || isPending}
                      >
                        {({open}) => (
                          <div className="flow-relative">
                            <ListboxButton>
                              {selectedSourceChain?.name || "Select chain"}
                            </ListboxButton>
                            {open && (
                              <ListboxOptions>
                                {sourceChains.map(chain => (
                                  <ListboxOption key={chain.id} value={chain}>
                                    {chain.name}
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            )}
                          </div>
                        )}
                      </Listbox>
                    </div>
                  </div>
                )}

              {isPending && (
                <div
                  className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                    flow-border-slate-200 dark:flow-border-slate-700 flow-p-8 flow-text-center"
                >
                  <div
                    className="flow-animate-spin flow-rounded-full flow-h-8 flow-w-8 flow-border-b-2
                      flow-border-slate-900 dark:flow-border-slate-100 flow-mx-auto"
                  />
                  <p className="flow-mt-3 flow-text-sm flow-text-slate-600 dark:flow-text-slate-400">
                    Generating deposit address...
                  </p>
                </div>
              )}

              {depositAddress && !isPending && (
                <>
                  <div
                    className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                      flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
                  >
                    <QRCode value={depositAddress} />
                  </div>

                  <Address address={depositAddress} label="Deposit Address" />

                  <div
                    className="flow-rounded-lg flow-bg-blue-50 dark:flow-bg-blue-900/20 flow-border
                      flow-border-blue-200 dark:flow-border-blue-800 flow-p-4"
                  >
                    <p className="flow-text-xs flow-text-blue-800 dark:flow-text-blue-200">
                      Send {selectedSourceToken?.symbol || "tokens"} from{" "}
                      {selectedSourceChain?.name || "any chain"} to this
                      address. Funds will be automatically bridged to your Flow
                      account.
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
