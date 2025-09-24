import {useState} from "react"
import {useFlowAccount} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

export function UseFlowAccountCard() {
  const {darkMode} = useDarkMode()
  const [address, setAddress] = useState("")
  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useFlowAccount({
    address,
    query: {enabled: !!address},
  })

  return (
    <DemoCard
      id="flow-account"
      title="useFlowAccount"
      description="Fetch Flow account information including balance, keys, and storage capacity."
    >
      <div className="space-y-6 overflow-hidden">
        <div className="space-y-4">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter Flow address (e.g., 0x55ad22f01ef568a1)"
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 ${
              darkMode
                  ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                    placeholder-gray-600`
                  : `bg-white text-black border-black/10 focus:border-flow-primary
                    placeholder-gray-400`
              }`}
          />

          <div className="flex justify-start">
            <button
              onClick={() => refetch()}
              disabled={isLoading || !address}
              className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                isLoading || !address
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
                }`}
            >
              {isLoading ? "Fetching Account..." : "Fetch Account"}
            </button>
          </div>
        </div>

        {account && !error && (
          <div className="space-y-4">
            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
            >
              <PlusGridIcon placement="top left" className="absolute" />
              <p
                className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Balance
              </p>
              <p
                className={`text-2xl font-bold font-mono break-all ${darkMode ? "text-white" : "text-black"}`}
              >
                {(Number(account.balance) / 1e8).toFixed(8)}
              </p>
              <p
                className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                FLOW
              </p>
            </div>

            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
            >
              <p
                className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Account Keys
              </p>
              <p
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}
              >
                {account.keys.length}
              </p>
              <p
                className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                {account.keys.length === 1 ? "key" : "keys"}
              </p>
            </div>
          </div>
        )}

        <ResultsSection
          data={account || error}
          darkMode={darkMode}
          show={!!(account || error) && !!address}
          title="Account Response"
        />
      </div>
    </DemoCard>
  )
}
