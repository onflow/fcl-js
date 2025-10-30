import {NftCard, useFlowChainId} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"
import {DEMO_ADDRESS_TESTNET} from "../../constants"

const IMPLEMENTATION_CODE = `import { NftCard } from "@onflow/react-sdk"

<NftCard
  accountAddress="0x123456789abcdef"
  tokenId="42"
  publicPathIdentifier="exampleNFTCollection"
  showTraits={true}
  showExtra={true}
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
    description: "The public path identifier for the NFT collection",
  },
  {
    name: "showTraits",
    type: "boolean",
    required: false,
    description:
      "Display NFT traits and attributes when available (default: false)",
  },
  {
    name: "showExtra",
    type: "boolean",
    required: false,
    description:
      "Show additional metadata like serial number, rarity, and external links (default: false)",
  },
  {
    name: "className",
    type: "string",
    required: false,
    description:
      "Additional CSS classes to apply to the card container for custom styling",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    required: false,
    description:
      "Inline styles to apply to the card container for custom styling",
  },
]

export function DemoNftCard() {
  const {darkMode} = useDarkMode()
  const {data: chainId, isLoading} = useFlowChainId()
  const [accountAddress, setAccountAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [publicPath, setPublicPath] = useState("")
  const [showTraits, setShowTraits] = useState(true)
  const [showExtra, setShowExtra] = useState(true)

  const isEmulator = chainId === "emulator" || chainId === "local"
  const isTestnet = chainId === "testnet"
  const isMainnet = chainId === "mainnet"
  const canShowDemo = isTestnet || isMainnet

  // Use user input if provided, otherwise use demo values
  const displayAddress = accountAddress || DEMO_ADDRESS_TESTNET
  const displayTokenId = tokenId || "8"
  const displayPublicPath = publicPath || "exampleNFTCollection"

  return (
    <DemoCard
      id="nftcard"
      title="<NftCard />"
      description="A card component that fetches and renders NFT metadata including image, name, description, traits, and external links."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#nftcard"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <PlusGridIcon placement="top right" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Rich Display
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Shows traits and attributes
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
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
        ) : !canShowDemo ? (
          <div
            className={`text-center py-4 px-6 rounded-lg border ${
              darkMode
                ? "bg-blue-900/20 border-blue-800/50"
                : "bg-blue-50 border-blue-200"
              }`}
          >
            <svg
              className="w-8 h-8 mx-auto mb-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p
              className={`text-sm font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              Demo Available on Testnet and Mainnet
            </p>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-blue-400/70" : "text-blue-600/70"}`}
            >
              Switch to testnet or mainnet to see the NFT card demo
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
                  placeholder={DEMO_ADDRESS_TESTNET}
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
                    placeholder="8"
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6">
              <div
                className={`relative p-8 rounded-lg border ${
                  darkMode
                    ? "bg-gray-900/50 border-white/10"
                    : "bg-gray-50 border-black/5"
                  }`}
              >
                <PlusGridIcon placement="bottom left" className="absolute" />
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-sm">
                    <NftCard
                      accountAddress={displayAddress}
                      tokenId={displayTokenId}
                      publicPathIdentifier={displayPublicPath}
                      showTraits={showTraits}
                      showExtra={showExtra}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className={`p-5 rounded-lg border ${
                    darkMode
                      ? "bg-gray-900/50 border-white/10"
                      : "bg-white border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className={`w-5 h-5 ${darkMode ? "text-flow-primary" : "text-flow-primary"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <h4
                      className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Display Options
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <label
                      className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
                        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50" }`}
                    >
                      <input
                        type="checkbox"
                        checked={showTraits}
                        onChange={e => setShowTraits(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-flow-primary focus:ring-flow-primary
                          focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Show Traits
                        </div>
                        <div
                          className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Display NFT attributes and properties
                        </div>
                      </div>
                    </label>

                    <div
                      className={`h-px ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
                    ></div>

                    <label
                      className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
                        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50" }`}
                    >
                      <input
                        type="checkbox"
                        checked={showExtra}
                        onChange={e => setShowExtra(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-flow-primary focus:ring-flow-primary
                          focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Show Extra
                        </div>
                        <div
                          className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Serial number, rarity, and external links
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoCard>
  )
}
