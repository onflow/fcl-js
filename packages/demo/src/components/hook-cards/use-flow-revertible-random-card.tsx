import {useFlowRevertibleRandom} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowRevertibleRandom } from "@onflow/react-sdk"

const { 
  data: randomNumber, 
  isLoading, 
  error, 
  refetch 
} = useFlowRevertibleRandom({
  query: { enabled: true }
})`

export function UseFlowRevertibleRandomCard() {
  const {darkMode} = useDarkMode()
  const {
    data: randomResults,
    isLoading,
    error,
    refetch,
  } = useFlowRevertibleRandom({
    max: "1000000000",
    count: 1,
  })

  return (
    <DemoCard
      id="hook-flow-revertible-random"
      title="useFlowRevertibleRandom"
      description="Generate cryptographically secure random numbers on the Flow blockchain that are deterministic and safe for smart contracts."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#useflowrevertiblerandom"
    >
      <div className="space-y-6">
        {randomResults && randomResults.length > 0 && !isLoading && !error && (
          <div
            className={`relative p-6 rounded-lg border ${
            darkMode
                ? "bg-gray-800 border-white/10"
                : "bg-white border-black/5"
            }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <div className="text-center">
              <p
                className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Generated Random Value
              </p>
              <div
                className={`text-4xl font-bold font-mono tracking-wider p-6 rounded mb-4 ${
                darkMode
                    ? "bg-gray-900 text-green-400 border border-white/5"
                    : "bg-gray-100 text-gray-900 border border-black/5"
                }`}
              >
                {randomResults[0].value}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-3 rounded border ${
                  darkMode
                      ? "bg-gray-900/50 border-white/5"
                      : "bg-gray-50 border-black/5"
                  }`}
                >
                  <h6
                    className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Hexadecimal
                  </h6>
                  <div
                    className={`font-mono text-xs break-all ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    0x
                    {BigInt(randomResults[0].value).toString(16).toUpperCase()}
                  </div>
                </div>
                <div
                  className={`p-3 rounded border ${
                  darkMode
                      ? "bg-gray-900/50 border-white/5"
                      : "bg-gray-50 border-black/5"
                  }`}
                >
                  <h6
                    className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Block Height
                  </h6>
                  <div
                    className={`font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {randomResults[0].blockHeight}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
            {isLoading ? "Generating..." : "Generate Random Value"}
          </button>
        </div>

        {error && (
          <div
            className={`relative p-4 rounded-lg border ${
            darkMode
                ? "bg-red-900/20 border-red-800/50"
                : "bg-red-50 border-red-200"
            }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <div>
              <p
                className={`text-sm font-medium mb-1 ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                Generation Failed
              </p>
              <p
                className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                {error.message}
              </p>
            </div>
          </div>
        )}

        <ResultsSection
          data={randomResults}
          darkMode={darkMode}
          show={!!randomResults && randomResults.length > 0 && !error}
        />
      </div>
    </DemoCard>
  )
}
