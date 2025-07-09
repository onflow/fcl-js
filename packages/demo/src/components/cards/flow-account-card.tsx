import {useFlowAccount, useFlowConfig} from "@onflow/kit"
import {useState} from "react"
import {CONTRACT_ADDRESSES} from "../../constants"

export function FlowAccountCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  // Use network-specific Flow Token contract address as default
  const [address, setAddress] = useState<string>(
    CONTRACT_ADDRESSES.FlowToken[currentNetwork]
  )

  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useFlowAccount({
    address,
    query: {enabled: false, staleTime: 30000},
  })

  // Generate preset addresses based on current network
  const presetAddresses = [
    {
      name: "Flow Token Contract",
      address: CONTRACT_ADDRESSES.FlowToken[currentNetwork],
    },
  ]

  return (
    <div className="p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowAccount</h2>
      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Preset Addresses:
        </label>
        <div className="mb-4">
          {presetAddresses.map(preset => (
            <button
              key={preset.address}
              onClick={() => setAddress(preset.address)}
              className="py-3 px-6 bg-[#f8f9fa] text-black border border-[#00EF8B] rounded-md
                cursor-pointer font-semibold text-base transition-all duration-200 ease-in-out
                mb-2 mr-2"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label className="block mb-2 text-black font-medium">
          Account Address:
        </label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter Flow account address"
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
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
          {isLoading ? "Loading..." : "Fetch Account"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Account Data:</h4>

        {isLoading && (
          <p className="text-gray-500 m-0">Loading account data...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {account && !isLoading && !error && (
          <pre
            className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-xs text-black
              m-0 whitespace-pre-wrap"
          >
            {JSON.stringify(account, null, 2)}
          </pre>
        )}

        {!account && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Fetch Account" to load account data
          </p>
        )}
      </div>
    </div>
  )
}
