import {useFlowBlock} from "@onflow/kit"
import {useState} from "react"

export function FlowBlockCard() {
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
    <div className="p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowBlock</h2>
      <div className="mb-6">
        <div className="mb-4">
          <label className="flex items-center text-black font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={useLatest}
              onChange={e => setUseLatest(e.target.checked)}
              className="mr-2 transform scale-125"
            />
            Fetch Latest Block
          </label>
        </div>

        {!useLatest && (
          <div>
            <label className="block mb-2 text-black font-medium">
              Block Height (optional):
            </label>
            <input
              type="number"
              value={blockHeight}
              onChange={e => setBlockHeight(e.target.value)}
              placeholder="Enter block height (e.g., 12345)"
              className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
                outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
            />

            <label className="block mb-2 text-black font-medium">
              Block ID (optional):
            </label>
            <input
              type="text"
              value={blockId}
              onChange={e => setBlockId(e.target.value)}
              placeholder="Enter block ID"
              className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
                outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
            />
          </div>
        )}

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
          {isLoading
            ? "Loading..."
            : useLatest
              ? "Fetch Latest Block"
              : "Fetch Block"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Block Data:</h4>

        {isLoading && (
          <p className="text-gray-500 m-0">Loading block data...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {block && !isLoading && !error && (
          <div>
            <div className="mb-4">
              <p className="text-black my-1">
                <strong>Height:</strong> {block.height}
              </p>
              <p className="text-black my-1">
                <strong>ID:</strong> {block.id}
              </p>
              <p className="text-black my-1">
                <strong>Parent ID:</strong> {block.parentId}
              </p>
              <p className="text-black my-1">
                <strong>Timestamp:</strong>{" "}
                {new Date(block.timestamp).toLocaleString()}
              </p>
            </div>
            <details>
              <summary className="text-black cursor-pointer font-medium mb-2">
                Full Block Data
              </summary>
              <pre
                className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-xs text-black
                  m-0 whitespace-pre-wrap"
              >
                {JSON.stringify(block, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!block && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Fetch Block" to load block data
          </p>
        )}
      </div>
    </div>
  )
}
