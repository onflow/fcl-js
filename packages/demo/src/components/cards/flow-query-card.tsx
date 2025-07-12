import {useFlowQuery, useFlowConfig, useFlowCurrentUser} from "@onflow/kit"
import {useState} from "react"
import {getContractAddress} from "../../constants"
import * as fcl from "@onflow/fcl"

export function FlowQueryCard() {
  const config = useFlowConfig()
  const {user: currentUser} = useFlowCurrentUser()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceScript, setCadenceScript] = useState(
    `
access(all) fun main(): String {
    return "Hello, World!"
}
`.trim()
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
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowQuery</h2>
      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Preset Scripts:
        </label>
        <div className="mb-4">
          {presetScripts.map(preset => (
            <button
              key={preset.name}
              onClick={() => onSelectPreset(preset)}
              className="py-3 px-6 bg-[#f8f9fa] text-black border border-[#00EF8B] rounded-md
                cursor-pointer font-semibold text-base transition-all duration-200 ease-in-out
                mb-2 mr-2"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label className="block mb-2 text-black font-medium">
          Cadence Script:
        </label>
        <textarea
          value={cadenceScript}
          onChange={e => setCadenceScript(e.target.value)}
          placeholder="Enter your Cadence script here..."
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full min-h-[120px]
            font-mono resize-y mb-4"
        />

        <button
          onClick={() => refetch()}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out mr-4 ${
            isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
          disabled={isLoading}
        >
          {isLoading ? "Executing..." : "Execute Script"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Script Result:</h4>

        {isLoading && <p className="text-gray-500 m-0">Executing script...</p>}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {result !== null && result !== undefined && !isLoading && !error && (
          <pre
            className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-sm text-black
              m-0 whitespace-pre-wrap"
          >
            {typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2)}
          </pre>
        )}

        {result === null && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Execute Script" to run the Cadence script
          </p>
        )}
      </div>
    </div>
  )
}
