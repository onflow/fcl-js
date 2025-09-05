import {useFlowNftMetadata, useFlowConfig} from "@onflow/react-sdk"
import {useState} from "react"

export function FlowNftCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  const [accountAddress, setAccountAddress] = useState<string>("")
  const [tokenId, setTokenId] = useState<string>("")
  const [publicPathIdentifier, setPublicPathIdentifier] = useState<string>(
    "exampleNFTCollection"
  )

  const {
    data: nft,
    isLoading,
    error,
    refetch,
  } = useFlowNftMetadata({
    accountAddress: accountAddress || undefined,
    tokenId: tokenId || undefined,
    publicPathIdentifier: publicPathIdentifier || undefined,
    query: {enabled: false, staleTime: 30000},
  })

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useFlowNftMetadata
      </h2>
      <div className="mb-6">
        <div className="mb-4">
          <label className="block mb-2 text-black font-medium">
            Account Address:
          </label>
          <input
            type="text"
            value={accountAddress}
            onChange={e => setAccountAddress(e.target.value)}
            placeholder="0x..."
            className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
              outline-none transition-colors duration-200 ease-in-out w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-black font-medium">Token ID:</label>
          <input
            type="text"
            value={tokenId}
            onChange={e => setTokenId(e.target.value)}
            placeholder="123"
            className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
              outline-none transition-colors duration-200 ease-in-out w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-black font-medium">
            Public Path Identifier:
          </label>
          <input
            type="text"
            value={publicPathIdentifier}
            onChange={e => setPublicPathIdentifier(e.target.value)}
            placeholder="exampleNFTCollection"
            className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
              outline-none transition-colors duration-200 ease-in-out w-full"
          />
        </div>

        <button
          onClick={() => refetch()}
          disabled={!accountAddress || !tokenId || isLoading}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out ${
            !accountAddress || !tokenId || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
        >
          {isLoading ? "Loading..." : "Fetch NFT"}
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Network: <span className="font-normal">{currentNetwork}</span>
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700">Error: {error.message}</p>
        </div>
      )}

      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 overflow-auto">
        <h3 className="text-black font-semibold mb-2">NFT Data:</h3>
        {nft && typeof nft === "object" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-black">
                  <strong>Name:</strong> {nft.name}
                </p>
                <p className="text-black">
                  <strong>Description:</strong> {nft.description}
                </p>
                <p className="text-black">
                  <strong>Token ID:</strong> {nft.tokenID}
                </p>
                {nft.rarity && (
                  <p className="text-black">
                    <strong>Rarity:</strong> {nft.rarity}
                  </p>
                )}
                {nft.serialNumber && (
                  <p className="text-black">
                    <strong>Serial Number:</strong> {nft.serialNumber}
                  </p>
                )}
              </div>

              <div>
                {nft.collectionName && (
                  <p className="text-black">
                    <strong>Collection:</strong> {nft.collectionName}
                  </p>
                )}
                {nft.externalUrl && (
                  <p className="text-black">
                    <strong>External URL:</strong>{" "}
                    <a
                      href={nft.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </p>
                )}
                {nft.collectionExternalUrl && (
                  <p className="text-black">
                    <strong>Collection URL:</strong>{" "}
                    <a
                      href={nft.collectionExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Collection
                    </a>
                  </p>
                )}
              </div>
            </div>

            {nft.thumbnailUrl && (
              <div className="mt-4">
                <p className="text-black font-medium mb-2">Thumbnail:</p>
                <img
                  src={nft.thumbnailUrl}
                  alt={nft.name}
                  className="max-w-xs max-h-48 rounded-md border border-gray-300"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            )}

            {nft.traits && Object.keys(nft.traits).length > 0 && (
              <div className="mt-4">
                <p className="text-black font-medium mb-2">Traits:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(nft.traits).map(([key, value]) => (
                    <div key={key} className="bg-white p-2 rounded border">
                      <p className="text-xs text-gray-600 uppercase">{key}</p>
                      <p className="text-black font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No NFT data available</p>
        )}
      </div>
    </div>
  )
}
