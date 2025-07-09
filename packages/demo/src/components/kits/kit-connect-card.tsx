import {Connect, useFlowChainId} from "@onflow/kit"

export function KitConnectCard() {
  const {data: chainId, isLoading} = useFlowChainId()
  const isEmulator = chainId === "emulator" || chainId === "local"

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Kit Connect Component</h2>
        <p>Loading chain info...</p>
      </div>
    )
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-8">
      <h2 className="text-lg font-bold mb-2">Kit Connect Component</h2>
      {isEmulator ? (
        <p className="text-gray-500">
          The Connect component is not available on the emulator. Please switch
          to testnet or mainnet.
        </p>
      ) : (
        <>
          <p className="mb-4">
            This component allows users to connect to their wallet.
          </p>
          <Connect />
        </>
      )}
    </div>
  )
}
