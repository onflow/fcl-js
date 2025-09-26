import {useFlowChainId} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"
import {
  getNetworkName,
  getEVMChainId,
  normalizeChainId,
  isProductionNetwork,
} from "../../utils/chain-helpers"

const IMPLEMENTATION_CODE = `import { useFlowChainId } from "@onflow/react-sdk"

const { 
  data: chainId, 
  isLoading 
} = useFlowChainId()`

export function UseFlowChainIdCard() {
  const {darkMode} = useDarkMode()
  const {
    data: chainId,
    isLoading,
    error,
    refetch,
  } = useFlowChainId({
    query: {enabled: false, staleTime: 300000}, // 5 minutes cache
  })

  const getChainColor = (id: string) => {
    const normalized = normalizeChainId(id)
    switch (normalized) {
      case "mainnet":
        return "bg-[#00EF8B]"
      case "testnet":
        return "bg-[#FFB800]"
      case "emulator":
        return "bg-[#9945FF]"
      default:
        // Handle legacy canarynet or other unknown formats
        if (id === "flow-canarynet") return "bg-[#FF6B6B]"
        return "bg-gray-500"
    }
  }

  return (
    <DemoCard
      id="flow-chain-id"
      title="useFlowChainId"
      description="Get the current Flow network chain identifier. Determine which network your app is connected to."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#useflowchainid"
    >
      <div className="space-y-6">
        <div
          className={`relative p-6 rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <h4
            className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Chain Information
          </h4>

          {isLoading && (
            <div className="flex items-center space-x-2">
              <div
                className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                darkMode ? "border-white" : "border-black" }`}
              ></div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Loading chain ID...
              </p>
            </div>
          )}

          {error && (
            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-red-900/20 border-red-800/50"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <PlusGridIcon placement="top right" className="absolute" />
              <p
                className={`text-sm font-medium ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                Error: {error.message}
              </p>
            </div>
          )}

          {chainId && !isLoading && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getChainColor(chainId)}`}
                  />
                  <span
                    className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {getNetworkName(chainId)}
                  </span>
                  {isProductionNetwork(chainId) && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                      PROD
                    </span>
                  )}
                </div>
                <div
                  className={`py-2 px-4 rounded border font-mono text-sm ${
                  darkMode
                      ? "bg-gray-800 border-white/10 text-white"
                      : "bg-white border-flow-primary/20 text-black"
                  }`}
                >
                  {chainId}
                </div>
              </div>

              {getEVMChainId(chainId) && (
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    EVM Chain ID:
                  </span>
                  <span
                    className={`font-mono ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {getEVMChainId(chainId)}
                  </span>
                </div>
              )}
            </div>
          )}

          {!chainId && !isLoading && !error && (
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Click "Fetch Chain ID" to load current chain information
            </p>
          )}
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
            {isLoading ? "Loading..." : "Fetch Chain ID"}
          </button>
        </div>

        <ResultsSection
          data={{chainId, isLoading, error}}
          darkMode={darkMode}
          show={!!chainId && !isLoading && !error}
          title="Chain ID Data"
        />
      </div>
    </DemoCard>
  )
}
