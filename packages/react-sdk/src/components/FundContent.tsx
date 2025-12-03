import React, {useState} from "react"
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "./internal/Tabs"
import {Input} from "./internal/Input"
import {Button} from "./internal/Button"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "./internal/Listbox"

const tokens = [
  {id: 1, name: "USDC"},
  {id: 2, name: "FLOW"},
]

export const FundContent: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  return (
    <div>
      <h2
        className="flow-text-lg flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100
          flow-mb-4"
      >
        Fund
      </h2>
      <TabGroup>
        <TabList>
          <Tab>
            {({selected}) => (
              <>
                Tab 1
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
                Tab 2
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
          <TabPanel>
            <div className="flow-space-y-4">
              <div className="flow-space-y-2">
                <label className="flow-text-sm flow-font-medium flow-text-slate-700 dark:flow-text-slate-300">
                  Amount
                </label>
                <div className="flow-flex flow-items-center flow-gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="flow-flex-1"
                  />
                  <span
                    className="flow-text-sm flow-font-medium flow-text-slate-600 dark:flow-text-slate-400
                      flow-whitespace-nowrap"
                  >
                    USD
                  </span>
                </div>
                <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-400">
                  ≈ 0 FLOW
                </p>
              </div>
              <Button className="flow-w-full">Continue</Button>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="flow-space-y-4">
              <div className="flow-space-y-2">
                <label className="flow-text-sm flow-font-medium flow-text-slate-700 dark:flow-text-slate-300">
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
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
