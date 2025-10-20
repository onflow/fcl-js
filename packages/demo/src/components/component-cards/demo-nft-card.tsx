import {NftCard, useFlowChainId} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { NftCard } from "@onflow/react-sdk"

<NftCard
  accountAddress="0x123456789abcdef"
  tokenId="42"
  publicPathIdentifier="exampleNFTCollection"
/>`

const PROPS: PropDefinition[] = [
  {
    name: "accountAddress",
    type: "string",
    required: true,
    description: "The Flow account address that owns the NFT",
  },
  {
    name: "tokenId",
    type: "string | number",
    required: true,
    description: "The unique identifier of the NFT within the collection",
  },
  {
    name: "publicPathIdentifier",
    type: "string",
    required: true,
    description:
      "The public path identifier for the NFT collection (e.g., 'exampleNFTCollection')",
  },
  {
    name: "className",
    type: "string",
    required: false,
    description: "Additional CSS classes to apply to the card wrapper",
  },
]

export function DemoNftCard() {
  const {darkMode} = useDarkMode()
  const {data: chainId, isLoading} = useFlowChainId()
  const [accountAddress, setAccountAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [publicPath, setPublicPath] = useState("")
  const [loadedAddress, setLoadedAddress] = useState("")
  const [loadedTokenId, setLoadedTokenId] = useState("")
  const [loadedPublicPath, setLoadedPublicPath] = useState("")
  const [showNft, setShowNft] = useState(false)

  const isEmulator = chainId === "emulator" || chainId === "local"

  const handleLoadNft = () => {
    setLoadedAddress(accountAddress)
    setLoadedTokenId(tokenId)
    setLoadedPublicPath(publicPath)
    setShowNft(true)
  }

  const canLoad = accountAddress && tokenId && publicPath

  return (
    <DemoCard
      id="nftcard"
      title="<NftCard />"
      description="A ready-to-use NFT display component that fetches and renders NFT metadata including image, name, description, traits, and external links."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#nftcard"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="top left" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              NFT Metadata
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Fetches NFT data automatically
            </p>
          </div>

          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Rich Display
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Shows traits and attributes
            </p>
          </div>

          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Responsive
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Dark mode support
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Account Address
            </label>
            <input
              type="text"
              value={accountAddress}
              onChange={e => setAccountAddress(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/50 border-white/10 text-white"
                  : "bg-white border-black/10 text-black"
                } focus:outline-none focus:ring-2 focus:ring-flow-primary/50`}
              placeholder="0x123456789abcdef"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Token ID
              </label>
              <input
                type="text"
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-900/50 border-white/10 text-white"
                    : "bg-white border-black/10 text-black"
                  } focus:outline-none focus:ring-2 focus:ring-flow-primary/50`}
                placeholder="1"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Public Path Identifier
              </label>
              <input
                type="text"
                value={publicPath}
                onChange={e => setPublicPath(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-900/50 border-white/10 text-white"
                    : "bg-white border-black/10 text-black"
                  } focus:outline-none focus:ring-2 focus:ring-flow-primary/50`}
                placeholder="exampleNFTCollection"
              />
            </div>
          </div>

          <button
            onClick={handleLoadNft}
            disabled={!canLoad}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              canLoad
                ? darkMode
                  ? "bg-flow-primary text-black hover:bg-flow-primary/90"
                  : "bg-flow-primary text-black hover:bg-flow-primary/90"
                : darkMode
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Load NFT
          </button>
        </div>

        <div
          className={`relative p-8 rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="bottom left" className="absolute" />
          {isLoading ? (
            <div className="text-center">
              <div
                className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                  darkMode ? "border-white" : "border-black" }`}
              ></div>
            </div>
          ) : isEmulator ? (
            <div
              className={`text-center py-4 px-6 rounded-lg border ${
                darkMode
                  ? "bg-orange-900/20 border-orange-800/50"
                  : "bg-orange-50 border-orange-200"
                }`}
            >
              <svg
                className="w-8 h-8 mx-auto mb-2 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p
                className={`text-sm font-medium ${darkMode ? "text-orange-400" : "text-orange-600"}`}
              >
                Emulator Network Detected
              </p>
              <p
                className={`text-xs mt-1 ${darkMode ? "text-orange-400/70" : "text-orange-600/70"}`}
              >
                NFT Card component requires testnet or mainnet
              </p>
            </div>
          ) : showNft && loadedAddress && loadedTokenId && loadedPublicPath ? (
            <div className="flex justify-center">
              <NftCard
                accountAddress={loadedAddress}
                tokenId={loadedTokenId}
                publicPathIdentifier={loadedPublicPath}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Fill in the fields above and click "Load NFT" to display the NFT
                card
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoCard>
  )
}
