import * as fcl from "@onflow/fcl"
import {
  useFlowConfig,
  useFlowCurrentUser,
  useFlowQueryRaw,
} from "@onflow/react-sdk"
import {useState} from "react"
import {getContractAddress} from "../../constants"
import {useDarkMode} from "../flow-provider-wrapper"
import {CodeEditor} from "../ui/code-editor"
import {DemoCard} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowQueryRaw } from "@onflow/react-sdk"

const { 
  data, 
  isLoading, 
  error, 
  refetch 
} = useFlowQueryRaw({
  cadence: \`
    access(all) fun main(): String {
      return "Hello, Flow!"
    }
  \`,
  args: [],
})`

export function UseFlowQueryRawCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const {user: currentUser} = useFlowCurrentUser()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceScript, setCadenceScript] = useState(
    `access(all) fun main(): String {
    return "Hello from Raw Query!"
}`.trim()
  )
  const [args, setArgs] = useState<
    (arg: typeof fcl.arg, t: typeof fcl.t) => any[]
  >(() => () => [])

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useFlowQueryRaw({
    cadence: cadenceScript,
    args,
    query: {enabled: false, staleTime: 10000},
  })

  const presetScripts = [
    {
      name: "Hello World",
      script: `access(all) fun main(): String {
    return "Hello from Raw Query!"
}`,
      args: () => () => [],
    },
    {
      name: "Current Block Info",
      script: `access(all) fun main(): [AnyStruct] {
    let block = getCurrentBlock()
    return [block.height, block.id, block.timestamp]
}`,
      args: () => () => [],
    },
    {
      name: "Get Account Balance",
      script: `import FlowToken from ${getContractAddress(
        "FlowToken",
        currentNetwork
      )}

access(all) fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
    
    return vaultRef?.balance ?? 0.0
}`,
      args: () => {
        if (!currentUser?.addr) {
          alert("Please connect your wallet to run this script.")
          return null
        }
        return () => [fcl.arg(currentUser.addr, fcl.t.Address)]
      },
    },
  ]

  const onSelectPreset = (preset: (typeof presetScripts)[number]) => {
    const newArgs = preset.args()
    if (newArgs) {
      setCadenceScript(preset.script)
      setArgs(() => newArgs)
    }
  }

  return (
    <DemoCard
      id="useflowqueryraw"
      title="useFlowQueryRaw"
      description="Execute Cadence scripts and receive the complete FCL response including status, events, and raw data without automatic parsing."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#useflowqueryraw"
    >
      <div className="space-y-6">
        <div
          className={`relative p-4 rounded-lg border ${
            darkMode
              ? "bg-amber-900/20 border-amber-800/50"
              : "bg-amber-50 border-amber-200"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-amber-400" : "text-amber-700"}`}
              >
                Raw Query Hook
              </p>
              <p
                className={`text-xs mt-1 ${darkMode ? "text-amber-400/70" : "text-amber-600/70"}`}
              >
                Returns the complete FCL response without automatic parsing,
                giving you access to status, events, and raw data.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Preset Scripts
          </label>
          <div className="flex flex-wrap gap-2">
            {presetScripts.map(preset => (
              <button
                key={preset.name}
                onClick={() => onSelectPreset(preset)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                darkMode
                    ? "bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700"
                    : "bg-white text-gray-700 border-black/10 hover:bg-gray-50"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Cadence Script
          </label>
          <CodeEditor
            value={cadenceScript}
            onChange={setCadenceScript}
            language="javascript"
            placeholder="Enter your Cadence script here..."
            minHeight="150px"
          />
        </div>

        <div className="flex justify-start">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isLoading ? "Executing..." : "Execute Script (Raw)"}
          </button>
        </div>

        <ResultsSection
          data={result || error}
          darkMode={darkMode}
          show={!!result || !!error}
        />
      </div>
    </DemoCard>
  )
}
