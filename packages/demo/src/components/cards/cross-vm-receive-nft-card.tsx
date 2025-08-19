import {useCrossVmReceiveNft, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {getContractAddress} from "../../constants"

export function CrossVmReceiveNftCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [nftIdentifier, setNftIdentifier] = useState("")
  const [nftId, setNftId] = useState("1") // NFT ID to bridge

  const {
    receiveNft,
    isPending,
    data: transactionId,
    error,
  } = useCrossVmReceiveNft()

  const isNetworkSupported = currentNetwork === "testnet"

  const exampleNftData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const exampleNftAddress = getContractAddress("ExampleNFT", currentNetwork)
    return {
      name: "Example NFT",
      nftIdentifier: `A.${exampleNftAddress.replace("0x", "")}.ExampleNFT.NFT`,
      nftId: "1",
    }
  }, [currentNetwork])

  // Set default NFT identifier when network changes
  useMemo(() => {
    if (exampleNftData && !nftIdentifier) {
      setNftIdentifier(exampleNftData.nftIdentifier)
    }
  }, [exampleNftData, nftIdentifier])

  const handleReceiveNft = () => {
    receiveNft({
      nftIdentifier,
      nftId,
    })
  }

  if (!isNetworkSupported) {
    return (
      <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
        <h2 className="text-black mt-0 mb-6 text-xl font-bold">
          useCrossVmReceiveNft
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
        useCrossVmReceiveNft
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-black">
          <strong>Note:</strong> Example prefilled with ExampleNFT type
          identifier
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
              : "e.g., A.dfc20aee650fcbdf.ExampleNFT.NFT"
          }
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <label className="block mb-2 text-black font-medium">
          NFT ID (UInt256):
        </label>
        <input
          type="text"
          value={nftId}
          onChange={e => setNftId(e.target.value)}
          placeholder="e.g., 1"
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <button
          onClick={handleReceiveNft}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out mr-4 ${
            isPending || !nftIdentifier || !nftId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
          disabled={isPending || !nftIdentifier || !nftId}
        >
          {isPending ? "Receiving..." : "Receive NFT"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Transaction Status:</h4>

        {isPending && (
          <p className="text-gray-500 m-0">Receiving NFT from EVM...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {transactionId && !isPending && !error && (
          <div className="p-4 bg-green-100 border border-green-200 rounded m-0">
            <p className="text-green-800 m-0 mb-2">
              <strong>NFT received successfully!</strong>
            </p>
            <p className="text-green-800 m-0 font-mono">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {!transactionId && !isPending && !error && (
          <div className="text-gray-500 m-0">
            <p className="mb-2">
              Click "Receive NFT" to bridge an NFT from EVM to Cadence
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
