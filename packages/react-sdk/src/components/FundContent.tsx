import React, {useState} from "react"
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

const tokens = [
  {id: 1, name: "USDC"},
  {id: 2, name: "FLOW"},
]

const chains = [
  {id: 1, name: "Flow"},
  {id: 2, name: "Ethereum"},
]

const PLACEHOLDER_ADDRESS = "0x1a2b3c4d5e6f7890abcdef1234567890"

export const FundContent: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState(tokens[0])
  const [selectedChain, setSelectedChain] = useState(chains[0])

  return (
    <div className="flow-space-y-5">
      <h2
        className="flow-text-xl flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100"
      >
        Fund Your Account
      </h2>

      <TabGroup>
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
                className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50
                  flow-border flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
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
                  <span
                    className="flow-text-base flow-font-semibold flow-text-slate-500 dark:flow-text-slate-400"
                  >
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
              <div className="flow-grid flow-grid-cols-2 flow-gap-3">
                <div className="flow-space-y-1.5">
                  <label
                    className="flow-text-xs flow-font-medium flow-text-slate-500 dark:flow-text-slate-400
                      flow-uppercase flow-tracking-wide"
                  >
                    Token
                  </label>
                  <Listbox value={selectedToken} onChange={setSelectedToken}>
                    {({open}) => (
                      <div className="flow-relative">
                        <ListboxButton>{selectedToken.name}</ListboxButton>
                        {open && (
                          <ListboxOptions>
                            {tokens.map(token => (
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
                    Chain
                  </label>
                  <Listbox value={selectedChain} onChange={setSelectedChain}>
                    {({open}) => (
                      <div className="flow-relative">
                        <ListboxButton>{selectedChain.name}</ListboxButton>
                        {open && (
                          <ListboxOptions>
                            {chains.map(chain => (
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

              <div
                className="flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50
                  flow-border flow-border-slate-200 dark:flow-border-slate-700 flow-p-4"
              >
                <QRCode value={PLACEHOLDER_ADDRESS} />
              </div>

              <Address address={PLACEHOLDER_ADDRESS} label="Deposit Address" />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
