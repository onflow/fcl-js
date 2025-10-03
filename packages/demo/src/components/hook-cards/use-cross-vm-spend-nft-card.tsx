import {useCrossVmSpendNft, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"
import {getContractAddress} from "../../constants"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { useCrossVmSpendNft } from "@onflow/react-sdk"

const {
  spendNft,
  isPending,
  error,
  data: txId
} = useCrossVmSpendNft()

spendNft({
  nftIdentifier: "A.012e4d204a60ac6f.ExampleNFT.NFT",
  nftIds: ["1", "2", "3"],
  calls: []
})`

export function UseCrossVmSpendNftCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [nftIdentifier, setNftIdentifier] = useState("")
  const [nftIds, setNftIds] = useState("1")

  const {spendNft, isPending, data: transactionId, error} = useCrossVmSpendNft()

  const exampleNftData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const exampleNftAddress = getContractAddress("ExampleNFT", currentNetwork)
    return {
      name: "Example NFT",
      nftIdentifier: `A.${exampleNftAddress.replace("0x", "")}.ExampleNFT.NFT`,
      nftIds: "1",
    }
  }, [currentNetwork])

  // Set default NFT identifier when network changes to testnet
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

  return (
    <DemoCard
      id="hook-cross-vm-spend-nft"
      title="useCrossVmSpendNft"
      description="Bridge NFTs from Cadence to Flow EVM by depositing them into the signer's Cadence-Owned Account (COA)."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#usecrossvmspendnft"
    >
      <div className="space-y-6">
        {exampleNftData && (
          <div
            className={`relative p-4 rounded-lg border ${
            darkMode
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <p
              className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-800"}`}
            >
              <strong>Note:</strong> Example prefilled with ExampleNFT type
              identifier for testnet
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            NFT Identifier
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
            className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
              ${
              darkMode
                  ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                    focus:border-flow-primary/50`
                  : `bg-white border-black/10 text-black placeholder-gray-400
                    focus:border-flow-primary/50`
              } outline-none`}
          />
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            NFT IDs (UInt64, comma-separated)
          </label>
          <input
            type="text"
            value={nftIds}
            onChange={e => setNftIds(e.target.value)}
            placeholder="e.g., 1,2,3"
            className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
              ${
              darkMode
                  ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                    focus:border-flow-primary/50`
                  : `bg-white border-black/10 text-black placeholder-gray-400
                    focus:border-flow-primary/50`
              } outline-none`}
          />
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleSpendNft}
            disabled={isPending || !nftIdentifier || !nftIds}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPending || !nftIdentifier || !nftIds
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isPending ? "Bridging..." : "Bridge NFT to EVM"}
          </button>
        </div>

        <ResultsSection
          data={transactionId || error}
          darkMode={darkMode}
          show={!!transactionId || !!error}
          title={
            transactionId
              ? "NFTs bridged successfully!"
              : error
                ? "Bridge failed"
                : undefined
          }
        />
      </div>
    </DemoCard>
  )
}
