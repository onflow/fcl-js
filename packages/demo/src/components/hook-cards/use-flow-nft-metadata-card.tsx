import {useState} from "react"
import {useFlowNftMetadata} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowNftMetadata } from "@onflow/react-sdk"

const {
  data: nft,
  isLoading,
  error,
  refetch,
} = useFlowNftMetadata({
  accountAddress,
  tokenId,
  publicPathIdentifier,
  query: { enabled: false, staleTime: 30000 },
})`

export function UseFlowNftMetadataCard() {
  const {darkMode} = useDarkMode()
  const [accountAddress, setAccountAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [publicPathIdentifier, setPublicPathIdentifier] = useState(
    "exampleNFTCollection"
  )

  // Normalize address to ensure it has 0x prefix
  const normalizedAddress = accountAddress
    ? accountAddress.startsWith("0x")
      ? accountAddress
      : `0x${accountAddress}`
    : undefined

  const {
    data: nft,
    isLoading,
    error,
    refetch,
  } = useFlowNftMetadata({
    accountAddress: normalizedAddress,
    tokenId: tokenId || undefined,
    publicPathIdentifier: publicPathIdentifier || undefined,
    query: {enabled: false, staleTime: 30000},
  })

  return (
    <DemoCard
      id="useflownftmetadata"
      title="useFlowNftMetadata"
      description="Fetch NFT metadata from Flow blockchain including name, description, image, and traits."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#useflownftmetadata"
    >
      <div className="space-y-6 overflow-hidden">
        <div className="space-y-4">
          <input
            type="text"
            value={accountAddress}
            onChange={e => setAccountAddress(e.target.value)}
            placeholder="Account Address (0x...)"
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 ${
              darkMode
                  ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                    placeholder-gray-600`
                  : `bg-white text-black border-black/10 focus:border-flow-primary
                    placeholder-gray-400`
              }`}
          />

          <input
            type="text"
            value={tokenId}
            onChange={e => setTokenId(e.target.value)}
            placeholder="Token ID (e.g., 123)"
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 ${
              darkMode
                  ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                    placeholder-gray-600`
                  : `bg-white text-black border-black/10 focus:border-flow-primary
                    placeholder-gray-400`
              }`}
          />

          <input
            type="text"
            value={publicPathIdentifier}
            onChange={e => setPublicPathIdentifier(e.target.value)}
            placeholder="Public Path Identifier"
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
              disabled={isLoading || !accountAddress || !tokenId}
              className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                isLoading || !accountAddress || !tokenId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
                }`}
            >
              {isLoading ? "Fetching NFT..." : "Fetch NFT"}
            </button>
          </div>
        </div>

        {nft && !error && typeof nft === "object" && (
          <div className="space-y-4">
            {nft.thumbnailUrl && (
              <div
                className={`relative p-4 rounded-lg border ${
                darkMode
                    ? "bg-gray-900/50 border-white/10"
                    : "bg-gray-50 border-black/5"
                }`}
              >
                <PlusGridIcon placement="top left" className="absolute" />
                <p
                  className={`text-xs mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  NFT Image
                </p>
                <img
                  src={nft.thumbnailUrl}
                  alt={nft.name}
                  className="max-w-full max-h-64 rounded-lg border border-white/10 mx-auto"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            )}

            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
            >
              {!nft.thumbnailUrl && (
                <PlusGridIcon placement="top left" className="absolute" />
              )}
              <div className="space-y-3">
                <div>
                  <p
                    className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Name
                  </p>
                  <p
                    className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {nft.name}
                  </p>
                </div>

                {nft.description && (
                  <div>
                    <p
                      className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      Description
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {nft.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p
                      className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      Token ID
                    </p>
                    <p
                      className={`text-sm font-mono ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {nft.tokenID}
                    </p>
                  </div>

                  {nft.collectionName && (
                    <div>
                      <p
                        className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                      >
                        Collection
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-white" : "text-black"}`}
                      >
                        {nft.collectionName}
                      </p>
                    </div>
                  )}
                </div>

                {nft.traits && Object.keys(nft.traits).length > 0 && (
                  <div>
                    <p
                      className={`text-xs mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      Traits
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(nft.traits).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded border ${
                          darkMode
                              ? "bg-gray-800 border-white/5"
                              : "bg-white border-black/5"
                          }`}
                        >
                          <p
                            className={`text-xs uppercase ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                          >
                            {key}
                          </p>
                          <p
                            className={`text-sm font-medium ${darkMode ? "text-white" : "text-black"}`}
                          >
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !nft && !error && accountAddress && tokenId && (
          <div
            className={`p-4 rounded-lg border ${
            darkMode
                ? "bg-yellow-900/20 border-yellow-500/20"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <p
              className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-800"}`}
            >
              No NFT found. This could mean:
            </p>
            <ul
              className={`list-disc list-inside text-xs mt-2 space-y-1
              ${darkMode ? "text-yellow-400" : "text-yellow-700"}`}
            >
              <li>The NFT doesn't exist at this address/token ID</li>
              <li>
                The public path identifier is incorrect for this NFT collection
              </li>
              <li>
                Try common paths: "exampleNFTCollection", "TopShotCollection",
                "FindMarketSaleCollection"
              </li>
            </ul>
          </div>
        )}

        <ResultsSection
          data={nft || error}
          darkMode={darkMode}
          show={!!(nft || error) && !!accountAddress && !!tokenId}
          title="NFT Metadata Response"
        />
      </div>
    </DemoCard>
  )
}
