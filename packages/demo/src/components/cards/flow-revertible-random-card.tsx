import {useFlowRevertibleRandom} from "@onflow/react-sdk"

export function FlowRevertibleRandomCard() {
  const {
    data: randomResults,
    isLoading,
    error,
    refetch,
  } = useFlowRevertibleRandom({
    max: "1000000000",
    count: 3,
  })

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useFlowRevertibleRandom
      </h2>
      <div className="mb-6 p-4 bg-yellow-100 rounded-md border border-yellow-300">
        <p className="text-black m-0 text-sm">
          <strong>Note:</strong> revertibleRandom() generates cryptographically
          secure random numbers on the Flow blockchain. These values are
          deterministic and can be used safely in smart contracts.
        </p>
      </div>

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
          {isLoading ? "Generating..." : "Generate Random Values"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Random Values:</h4>

        {isLoading && (
          <p className="text-gray-500 m-0">Generating random values...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {randomResults && randomResults.length > 0 && !isLoading && !error && (
          <div>
            {randomResults.map((result, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-2 border-[#00EF8B] rounded-lg mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-black m-0 text-base font-semibold">
                    Random Value #{idx + 1}
                  </h5>
                  <span className="text-xs text-gray-500 font-mono">
                    Block: {result.blockHeight}
                  </span>
                </div>

                <div
                  className="text-2xl font-bold text-black font-mono tracking-wider text-center p-2
                    bg-gray-100 rounded mb-4"
                >
                  {result.value}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-100 border border-[#00EF8B] rounded">
                    <h6 className="text-black m-0 mb-1 text-xs">
                      Hexadecimal:
                    </h6>
                    <div className="font-mono text-xs text-black break-all">
                      0x{BigInt(result.value).toString(16).toUpperCase()}
                    </div>
                  </div>

                  <div className="p-2 bg-gray-100 border border-[#00EF8B] rounded">
                    <h6 className="text-black m-0 mb-1 text-xs">
                      Binary (truncated):
                    </h6>
                    <div className="font-mono text-xs text-black break-all max-h-8 overflow-hidden">
                      {BigInt(result.value).toString(2).slice(0, 32)}...
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded text-xs text-black">
              <strong>Usage in Cadence:</strong>{" "}
              <code className="font-mono">
                revertibleRandom(modulo: UInt256)
              </code>
            </div>
          </div>
        )}

        {!randomResults && !isLoading && !error && (
          <p className="text-gray-500 m-0">
            Click "Generate Random Values" to get new random numbers
          </p>
        )}
      </div>
    </div>
  )
}
