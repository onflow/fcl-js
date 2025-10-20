import {useCrossVmBridgeNftFromEvm, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"
import {getContractAddress} from "../../constants"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { useCrossVmBridgeNftFromEvm } from "@onflow/react-sdk"

const {
  crossVmBridgeNftFromEvm,
  isPending,
  error,
  data: txId
} = useCrossVmBridgeNftFromEvm()

crossVmBridgeNftFromEvm({
  nftIdentifier: "A.dfc20aee650fcbdf.ExampleNFT.NFT",
  nftId: "1"
})`

export function UseCrossVmBridgeNftFromEvmCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [nftIdentifier, setNftIdentifier] = useState("")
  const [nftId, setNftId] = useState("1")

  const {
    crossVmBridgeNftFromEvm,
    isPending,
    data: transactionId,
    error,
  } = useCrossVmBridgeNftFromEvm()

  const exampleNftData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const exampleNftAddress = getContractAddress("ExampleNFT", currentNetwork)
    return {
      name: "Example NFT",
      nftIdentifier: `A.${exampleNftAddress.replace("0x", "")}.ExampleNFT.NFT`,
      nftId: "1",
    }
  }, [currentNetwork])

  // Set default NFT identifier when network changes to testnet
  useMemo(() => {
    if (exampleNftData && !nftIdentifier) {
      setNftIdentifier(exampleNftData.nftIdentifier)
    }
  }, [exampleNftData, nftIdentifier])

  const handleBridgeNft = () => {
    crossVmBridgeNftFromEvm({
      nftIdentifier,
      nftId,
    })
  }

  return (
    <DemoCard
      id="usecrossvmbridgenftfromevm"
      title="useCrossVmBridgeNftFromEvm"
      description="Bridge NFTs from Flow EVM to Cadence by withdrawing from the signer's Cadence-Owned Account (COA) in EVM."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#usecrossvmbridgenftfromevm"
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
            <PlusGridIcon placement="top left" className="absolute" />
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
                : "e.g., A.dfc20aee650fcbdf.ExampleNFT.NFT"
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
            NFT ID (UInt256)
          </label>
          <input
            type="text"
            value={nftId}
            onChange={e => setNftId(e.target.value)}
            placeholder="e.g., 1"
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
            onClick={handleBridgeNft}
            disabled={isPending || !nftIdentifier || !nftId}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPending || !nftIdentifier || !nftId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isPending ? "Bridging..." : "Bridge NFT from EVM"}
          </button>
        </div>

        <ResultsSection
          data={transactionId || error}
          darkMode={darkMode}
          show={!!transactionId || !!error}
          title={
            transactionId
              ? "NFT bridged successfully!"
              : error
                ? "Bridge failed"
                : undefined
          }
        />
      </div>
    </DemoCard>
  )
}
