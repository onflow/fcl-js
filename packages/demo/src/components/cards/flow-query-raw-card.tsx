import {useFlowConfig, useFlowCurrentUser, useFlowQueryRaw} from "@onflow/kit"
import {useState} from "react"
import * as fcl from "@onflow/fcl"
import {getContractAddress} from "../../constants"

export function FlowQueryRawCard() {
  const config = useFlowConfig()
  const {user: currentUser} = useFlowCurrentUser()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceScript, setCadenceScript] = useState(
    `
access(all) fun main(): String {
    return "Hello from Raw Query!"
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
    {
      name: "Multiple Values",
      script: `access(all) fun main(): {String: AnyStruct} {
    return {
        "timestamp": getCurrentBlock().timestamp,
        "height": getCurrentBlock().height,
        "random": revertibleRandom()
    }
}`,
      args: () => () => [],
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
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useFlowQueryRaw
      </h2>
      <div className="mb-6 p-4 bg-yellow-100 rounded-md border border-yellow-300">
        <p className="text-black m-0 text-sm">
          <strong>Note:</strong> useFlowQueryRaw returns the raw FCL response
          without automatic parsing. This gives you access to the complete
          response structure including status, events, and raw data.
        </p>
      </div>

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
          {isLoading ? "Executing..." : "Execute Script (Raw)"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Raw Response:</h4>

        {isLoading && <p className="text-gray-500 m-0">Executing script...</p>}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {result && !isLoading && !error && (
          <div>
            {(result as any).status && (
              <div className="mb-4">
                <h5 className="text-black m-0 mb-2">Status:</h5>
                <div
                  className={`inline-block py-1 px-3 rounded text-xs font-semibold ${
                  (result as any).status === "success"
                      ? "bg-green-100 border border-green-200 text-green-800"
                      : "bg-red-100 border border-red-200 text-red-800"
                  }`}
                >
                  {(result as any).status}
                </div>
              </div>
            )}
            <details>
              <summary className="text-black cursor-pointer font-medium mb-2">
                Full Raw Response
              </summary>
              <pre
                className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-xs text-black
                  m-0 whitespace-pre-wrap"
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!result && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Execute Script (Raw)" to run the Cadence script
          </p>
        )}
      </div>
    </div>
  )
}
