import {
  useFlowQuery,
  useFlowConfig,
  useFlowCurrentUser,
} from "@onflow/react-sdk"
import {useState} from "react"
import {getContractAddress} from "../../constants"
import * as fcl from "@onflow/fcl"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `const { 
  data, 
  isLoading, 
  error, 
  refetch 
} = useFlowQuery({
  cadence: \`
    pub fun main(): String {
      return "Hello, Flow!"
    }
  \`,
  args: [],
})`

export function UseFlowQueryCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const {user: currentUser} = useFlowCurrentUser()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceScript, setCadenceScript] = useState(
    `access(all) fun main(): String {
    return "Hello, World!"
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
  } = useFlowQuery({
    cadence: cadenceScript,
    args,
    query: {enabled: false, staleTime: 10000},
  })

  const presetScripts = [
    {
      name: "Hello World",
      script: `access(all) fun main(): String {
    return "Hello, World!"
}`,
      args: () => () => [],
    },
    {
      name: "Current Block Height",
      script: `access(all) fun main(): UInt64 {
    return getCurrentBlock().height
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
      id="flow-query"
      title="useFlowQuery"
      description="Execute Cadence scripts on Flow blockchain with automatic result parsing and caching support."
      code={IMPLEMENTATION_CODE}
    >
      <div className="space-y-6">
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
          <textarea
            value={cadenceScript}
            onChange={e => setCadenceScript(e.target.value)}
            placeholder="Enter your Cadence script here..."
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 min-h-[150px] resize-y ${
              darkMode
                  ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                    placeholder-gray-600`
                  : `bg-white text-black border-black/10 focus:border-flow-primary
                    placeholder-gray-400`
              }`}
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
            {isLoading ? "Executing..." : "Execute Script"}
          </button>
        </div>

        <ResultsSection
          data={result !== null && result !== undefined ? result : error}
          darkMode={darkMode}
          show={(result !== null && result !== undefined) || !!error}
        />
      </div>
    </DemoCard>
  )
}
