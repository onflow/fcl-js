import {useCrossVmSpendNft, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {getContractAddress} from "../../constants"

export function CrossVmSpendNftCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [nftIdentifier, setNftIdentifier] = useState("")
  const [nftIds, setNftIds] = useState("1") // NFT IDs to bridge (comma-separated)

  const {spendNft, isPending, data: transactionId, error} = useCrossVmSpendNft()

  const isNetworkSupported = currentNetwork === "testnet"

  const exampleNftData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const exampleNftAddress = getContractAddress("ExampleNFT", currentNetwork)
    return {
      name: "Example NFT",
      nftIdentifier: `A.${exampleNftAddress.replace("0x", "")}.ExampleNFT.NFT`,
      nftIds: "1",
    }
  }, [currentNetwork])

  // Set default NFT identifier when network changes
  useMemo(() => {
    if (exampleNftData && !nftIdentifier) {
      setNftIdentifier(exampleNftData.nftIdentifier)
      setNftIds(exampleNftData.nftIds)
    }
  }, [exampleNftData, nftIdentifier])

  const handleSpendNft = () => {
    const nftIdArray = nftIds.split(",").map(id => id.trim())

    spendNft({
      nftIdentifier,
      nftIds: nftIdArray,
      calls: [], // No EVM calls, just bridging
    })
  }

  if (!isNetworkSupported) {
    return (
      <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
        <h2 className="text-black mt-0 mb-6 text-xl font-bold">
          useCrossVmSpendNft
        </h2>
        <div className="p-4 bg-yellow-100 border border-yellow-200 rounded text-yellow-800">
          <p className="m-0">
            <strong>Network not supported:</strong> This feature is only
            available on testnet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useCrossVmSpendNft
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-black">
          <strong>Note:</strong> Bridge NFTs from Cadence to EVM
        </label>

        <label className="block mb-2 text-black font-medium">
          NFT Identifier:
        </label>
        <input
          type="text"
          value={nftIdentifier}
          onChange={e => setNftIdentifier(e.target.value)}
          placeholder={
            exampleNftData
              ? exampleNftData.nftIdentifier
              : "e.g., A.012e4d204a60ac6f.ExampleNFT.NFT"
          }
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <label className="block mb-2 text-black font-medium">
          NFT IDs (UInt64, comma-separated):
        </label>
        <input
          type="text"
          value={nftIds}
          onChange={e => setNftIds(e.target.value)}
          placeholder="e.g., 1,2,3"
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <button
          onClick={handleSpendNft}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out mr-4 ${
            isPending || !nftIdentifier || !nftIds
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
          disabled={isPending || !nftIdentifier || !nftIds}
        >
          {isPending ? "Spending..." : "Spend NFT"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Transaction Status:</h4>

        {isPending && (
          <p className="text-gray-500 m-0">Bridging NFTs to EVM...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {transactionId && !isPending && !error && (
          <div className="p-4 bg-green-100 border border-green-200 rounded m-0">
            <p className="text-green-800 m-0 mb-2">
              <strong>NFTs spent successfully!</strong>
            </p>
            <p className="text-green-800 m-0 font-mono">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {!transactionId && !isPending && !error && (
          <div className="text-gray-500 m-0">
            <p className="mb-2">
              Click "Spend NFT" to bridge NFTs from Cadence to EVM
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
