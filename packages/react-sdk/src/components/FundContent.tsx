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
import {relayProvider, CryptoProviderCapability} from "@onflow/payments"
import {useFlowCurrentUser} from "../hooks/useFlowCurrentUser"
import {useFlowChainId} from "../hooks/useFlowChainId"
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

export const FundContent: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const {user} = useFlowCurrentUser()
  const {data: chainId} = useFlowChainId()

  const providers = [relayProvider()]

  // Fetch available funding capabilities
  const {
    data: capabilities,
    isLoading: isLoadingCapabilities,
    error: capabilitiesError,
  } = useFundingCapabilities({
    providers,
  })

  // Extract crypto capabilities
  const cryptoCapability = capabilities?.find(
    c => c.type === "crypto"
  ) as CryptoProviderCapability

  // Build SOURCE tokens list (what user can send FROM)
  const sourceTokens = (cryptoCapability?.sourceCurrencies || []).map(
    (currency, index) => ({
      id: index + 1,
      name: currency,
      address: currency,
    })
  )

  // Build SOURCE chains list (where user can send FROM)
  const sourceChains = (cryptoCapability?.sourceChains || []).map(
    (caipId, index) => ({
      id: index + 1,
      name: getChainName(caipId),
      caipId,
    })
  )

  const [selectedSourceToken, setSelectedSourceToken] = useState(
    sourceTokens[0]
  )
  const [selectedSourceChain, setSelectedSourceChain] = useState(
    sourceChains[0]
  )

  // Update selections when capabilities load
  useEffect(() => {
    if (sourceTokens.length > 0 && !selectedSourceToken) {
      setSelectedSourceToken(sourceTokens[0])
    }
    if (sourceChains.length > 0 && !selectedSourceChain) {
      setSelectedSourceChain(sourceChains[0])
    }
  }, [sourceTokens, sourceChains])

  // Initialize useFund hook with relay provider
  const {
    mutate: createSession,
    data: session,
    isPending,
    error,
  } = useFund({
    providers,
  })

  // Create funding session when crypto tab is selected and user is authenticated
  useEffect(() => {
    if (
      selectedTabIndex === 1 &&
      user?.addr &&
      chainId &&
      selectedSourceToken &&
      selectedSourceChain
    ) {
      // User's Flow address as destination (in CAIP-10 format)
      const destination = `eip155:${chainId}:${user.addr}`

      createSession({
        kind: "crypto",
        destination,
        currency: selectedSourceToken.address, // Destination currency (will be same token on Flow)
        sourceChain: selectedSourceChain.caipId,
        sourceCurrency: selectedSourceToken.address,
        amount: amount || undefined,
      })
    }
  }, [
    selectedTabIndex,
    selectedSourceToken,
    selectedSourceChain,
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

              {isLoadingCapabilities && (
                <div
                  className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50 flow-border
                    flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
                >
                  <p className="flow-text-sm flow-text-slate-600 dark:flow-text-slate-400">
                    Loading available funding options...
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
                              {selectedSourceToken?.name || "Select token"}
                            </ListboxButton>
                            {open && (
                              <ListboxOptions>
                                {sourceTokens.map(token => (
                                  <ListboxOption key={token.id} value={token}>
                                    {token.name}
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
                      Send {selectedSourceToken?.name || "tokens"} from{" "}
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
