import {useCrossVmReceiveToken, useFlowConfig} from "@onflow/kit"
import {useState, useMemo} from "react"
import {getContractAddress} from "../../constants"

export function CrossVmReceiveTokenCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [vaultIdentifier, setVaultIdentifier] = useState("")
  const [amount, setAmount] = useState("1000000000000000000") // 1 token (18 decimals for EVM)

  const {
    receiveToken,
    isPending,
    data: transactionId,
    error,
  } = useCrossVmReceiveToken()

  const isNetworkSupported = currentNetwork === "testnet"

  const clickTokenData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const clickTokenAddress = getContractAddress("ClickToken", currentNetwork)
    return {
      name: "ClickToken",
      vaultIdentifier: `A.${clickTokenAddress.replace("0x", "")}.EVMVMBridgedToken_a7cf2260e501952c71189d04fad17c704dfb36e6.Vault`,
      amount: "1000000000000000000", // 1 ClickToken (18 decimals for EVM)
    }
  }, [currentNetwork])

  // Set default vault identifier when network changes
  useMemo(() => {
    if (clickTokenData && !vaultIdentifier) {
      setVaultIdentifier(clickTokenData.vaultIdentifier)
    }
  }, [clickTokenData, vaultIdentifier])

  const handleReceiveToken = () => {
    receiveToken({
      vaultIdentifier,
      amount,
    })
  }

  if (!isNetworkSupported) {
    return (
      <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
        <h2 className="text-black mt-0 mb-6 text-xl font-bold">
          useCrossVmReceiveToken
        </h2>
        <div className="p-4 bg-yellow-100 border border-yellow-200 rounded text-yellow-800">
          <p className="m-0">
            <strong>Network not supported:</strong> This feature is only
            available on testnet (with ClickToken ERC20). Current network:{" "}
            <strong>{currentNetwork}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useCrossVmReceiveToken
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-black">
          <strong>Note:</strong> Prefilled with ClickToken (ERC20) vault
          identifier
        </label>
        <label className="block mb-2 text-black font-medium">
          Vault Identifier:
        </label>
        <input
          type="text"
          value={vaultIdentifier}
          onChange={e => setVaultIdentifier(e.target.value)}
          placeholder={
            clickTokenData
              ? clickTokenData.vaultIdentifier
              : "e.g., A.dfc20aee650fcbdf.EVMVMBridgedToken_a7cf2260e501952c71189d04fad17c704dfb36e6.Vault"
          }
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <label className="block mb-2 text-black font-medium">
          Amount (Wei/UInt256):
        </label>
        <input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="e.g., 100000000000000000 (0.1 token with 18 decimals)"
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full mb-4 font-mono"
        />

        <button
          onClick={handleReceiveToken}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out mr-4 ${
            isPending || !vaultIdentifier || !amount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
          disabled={isPending || !vaultIdentifier || !amount}
        >
          {isPending ? "Receiving..." : "Receive Token"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Transaction Status:</h4>

        {isPending && (
          <p className="text-gray-500 m-0">Receiving tokens from EVM...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {transactionId && !isPending && !error && (
          <div className="p-4 bg-green-100 border border-green-200 rounded m-0">
            <p className="text-green-800 m-0 mb-2">
              <strong>Tokens received successfully!</strong>
            </p>
            <p className="text-green-800 m-0 font-mono">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {!transactionId && !isPending && !error && (
          <div className="text-gray-500 m-0">
            <p className="mb-2">
              Click "Receive Token" to bridge tokens from EVM to Cadence
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
