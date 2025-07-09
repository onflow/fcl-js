import {useFlowChainId} from "@onflow/kit"

export function FlowChainIdCard() {
  const {
    data: chainId,
    isLoading,
    error,
    refetch,
  } = useFlowChainId({
    query: {enabled: false, staleTime: 300000}, // 5 minutes cache
  })

  const getChainName = (id: string) => {
    switch (id) {
      case "flow-mainnet":
        return "Flow Mainnet"
      case "flow-testnet":
        return "Flow Testnet"
      case "flow-emulator":
        return "Flow Emulator"
      case "flow-canarynet":
        return "Flow Canarynet"
      default:
        return "Unknown Chain"
    }
  }

  const getChainColor = (id: string) => {
    switch (id) {
      case "flow-mainnet":
        return "bg-[#00EF8B]"
      case "flow-testnet":
        return "bg-[#FFB800]"
      case "flow-emulator":
        return "bg-[#9945FF]"
      case "flow-canarynet":
        return "bg-[#FF6B6B]"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowChainId</h2>
      <div className="mb-6">
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
          {isLoading ? "Loading..." : "Fetch Chain ID"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Chain Information:</h4>

        {isLoading && <p className="text-gray-500 m-0">Loading chain ID...</p>}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {chainId && !isLoading && !error && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${getChainColor(chainId)}`}
              />
              <span className="text-lg font-semibold text-black">
                {getChainName(chainId)}
              </span>
            </div>
            <div className="bg-white py-2 px-4 rounded border border-[#00EF8B] font-mono text-sm text-black">
              {chainId}
            </div>
          </div>
        )}

        {!chainId && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Fetch Chain ID" to load current chain information
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-[#fff8e1] rounded-md border border-[#FFB800]">
        <h5 className="text-black m-0 mb-2">Chain Types:</h5>
        <ul className="text-gray-700 m-0 pl-6 list-disc">
          <li>
            <strong>flow-mainnet:</strong> Production network
          </li>
          <li>
            <strong>flow-testnet:</strong> Testing network
          </li>
          <li>
            <strong>flow-emulator:</strong> Local development
          </li>
          <li>
            <strong>flow-canarynet:</strong> Canary releases
          </li>
        </ul>
      </div>
    </div>
  )
}
