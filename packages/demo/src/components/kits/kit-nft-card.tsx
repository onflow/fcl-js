import {NftCard, useFlowConfig} from "@onflow/react-sdk"
import {useState} from "react"

export function KitNftCardCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  const [accountAddress, setAccountAddress] = useState<string>("")
  const [tokenId, setTokenId] = useState<string>("")
  const [publicPathIdentifier, setPublicPathIdentifier] = useState<string>(
    "exampleNFTCollection"
  )

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        NftCard Component
      </h2>
      <div className="mb-6">
        <p className="text-black mb-4">
          A beautifully styled card component that displays NFT metadata using
          the useFlowNftMetadata hook. Features loading states, error handling,
          and responsive design.
        </p>

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

        <div className="mb-6">
          <label className="block mb-2 text-black font-medium">
            Network: <span className="font-normal">{currentNetwork}</span>
          </label>
        </div>
      </div>

      {/* NftCard Component Demo */}
      {accountAddress && tokenId && publicPathIdentifier ? (
        <div>
          <h3 className="text-black font-semibold mb-4">
            NftCard Component Preview:
          </h3>
          <div className="max-w-sm">
            <NftCard
              accountAddress={accountAddress}
              tokenId={tokenId}
              publicPathIdentifier={publicPathIdentifier}
            />
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            Fill in the fields above to see the NftCard component in action
          </p>
        </div>
      )}
    </div>
  )
}
