import {useState} from "react"
import {useFlowBlock} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowBlock } from "@onflow/react-sdk"

const { 
  data: block, 
  isLoading, 
  error, 
  refetch 
} = useFlowBlock({
  query: { enabled: true }
})`

export function UseFlowBlockCard() {
  const {darkMode} = useDarkMode()
  const [blockHeight, setBlockHeight] = useState<string>("")
  const [blockId, setBlockId] = useState<string>("")
  const [useLatest, setUseLatest] = useState(true)

  const {
    data: block,
    isLoading,
    error,
    refetch,
  } = useFlowBlock({
    height: useLatest
      ? undefined
      : blockHeight
        ? parseInt(blockHeight)
        : undefined,
    id: useLatest ? undefined : blockId || undefined,
    query: {enabled: false, staleTime: 30000},
  })

  return (
    <DemoCard
      id="hook-flow-block"
      title="useFlowBlock"
      description="Get blockchain block information including height, timestamp, and block ID."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#useflowblock"
    >
      <div className="space-y-6">
        {!block && !isLoading && !error && (
          <div
            className={`text-center py-12 rounded-lg border ${
            darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
            }`}
          >
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p
              className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              {useLatest
                ? "Click to fetch latest block"
                : "Configure and fetch block data"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <label
            className={`flex items-center cursor-pointer select-none ${
              darkMode ? "text-white" : "text-black" }`}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={useLatest}
                onChange={e => setUseLatest(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
                  useLatest
                    ? "bg-flow-primary"
                    : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform
                  duration-200 ${useLatest ? "transform translate-x-6" : ""}`}
              ></div>
            </div>
            <span className="ml-3 font-medium">Fetch Latest Block</span>
          </label>

          {!useLatest && (
            <div className="space-y-3">
              <div>
                <input
                  type="number"
                  value={blockHeight}
                  onChange={e => setBlockHeight(e.target.value)}
                  placeholder="Block height (e.g., 12345)"
                  className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
                  duration-200 ${
                  darkMode
                      ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                        placeholder-gray-600`
                      : `bg-white text-black border-black/10 focus:border-flow-primary
                        placeholder-gray-400`
                  }`}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={blockId}
                  onChange={e => setBlockId(e.target.value)}
                  placeholder="Block ID (optional)"
                  className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
                  duration-200 ${
                  darkMode
                      ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                        placeholder-gray-600`
                      : `bg-white text-black border-black/10 focus:border-flow-primary
                        placeholder-gray-400`
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className={`py-3 px-6 font-medium rounded-lg transition-all duration-200 ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
                }`}
            >
              {isLoading
                ? "Loading..."
                : useLatest
                  ? "Fetch Latest Block"
                  : "Fetch Block"}
            </button>
          </div>
        </div>

        {error ? (
          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-red-900/20 border-red-800/50"
                : "bg-red-50 border-red-200"
              }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <p
              className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
            >
              {error.message}
            </p>
          </div>
        ) : block ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  Height
                </p>
                <p
                  className={`text-xl font-bold font-mono ${darkMode ? "text-white" : "text-black"}`}
                >
                  {block.height}
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
                  Timestamp
                </p>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-white" : "text-black"}`}
                >
                  {new Date(block.timestamp).toLocaleDateString()}
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  {new Date(block.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
                }`}
            >
              <p
                className={`text-xs mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Block ID
              </p>
              <p
                className={`text-xs font-mono break-all ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {block.id}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
                }`}
            >
              <p
                className={`text-xs mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Parent Block ID
              </p>
              <p
                className={`text-xs font-mono break-all ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {block.parentId}
              </p>
            </div>
          </div>
        ) : null}

        <ResultsSection
          data={block || error}
          darkMode={darkMode}
          show={!!(block || error)}
          title="Block Response"
        />
      </div>
    </DemoCard>
  )
}
