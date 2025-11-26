import {useCrossVmBridgeTokenFromEvm, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"
import {getContractAddress} from "../../constants"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { useCrossVmBridgeTokenFromEvm } from "@onflow/react-sdk"

const {
  crossVmBridgeTokenFromEvm,
  isPending,
  error,
  data: txId
} = useCrossVmBridgeTokenFromEvm()

crossVmBridgeTokenFromEvm({
  vaultIdentifier: "A.dfc20aee650fcbdf.EVMVMBridgedToken_xxx.Vault",
  amount: "1000000000000000000"
})`

export function UseCrossVmBridgeTokenFromEvmCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [vaultIdentifier, setVaultIdentifier] = useState("")
  const [amount, setAmount] = useState("1") // User-friendly amount
  const [decimals, setDecimals] = useState("18") // ERC20 decimals

  const {
    crossVmBridgeTokenFromEvm,
    isPending,
    data: transactionId,
    error,
  } = useCrossVmBridgeTokenFromEvm()

  const clickTokenData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const clickTokenAddress = getContractAddress("ClickToken", currentNetwork)
    return {
      name: "ClickToken",
      vaultIdentifier: `A.${clickTokenAddress.replace("0x", "")}.EVMVMBridgedToken_a7cf2260e501952c71189d04fad17c704dfb36e6.Vault`,
      amount: "1", // 1 ClickToken
      decimals: "18", // ClickToken has 18 decimals
    }
  }, [currentNetwork])

  // Set default vault identifier when network changes to testnet
  useMemo(() => {
    if (clickTokenData && !vaultIdentifier) {
      setVaultIdentifier(clickTokenData.vaultIdentifier)
      setAmount(clickTokenData.amount)
      setDecimals(clickTokenData.decimals)
    }
  }, [clickTokenData, vaultIdentifier])

  // Convert user-friendly amount to Wei (UInt256)
  const convertToWei = (value: string, tokenDecimals: string): string => {
    try {
      // Remove any non-numeric characters except decimal point
      const cleaned = value.replace(/[^\d.]/g, "")
      if (!cleaned || cleaned === ".") return "0"

      const decimalPlaces = parseInt(tokenDecimals) || 18
      const [whole = "0", fraction = ""] = cleaned.split(".")

      // Pad or truncate fraction to match decimals
      const paddedFraction = fraction
        .padEnd(decimalPlaces, "0")
        .slice(0, decimalPlaces)

      // Combine whole and fraction parts
      const weiValue = (whole || "0") + paddedFraction

      // Remove leading zeros but keep at least one digit
      const result = weiValue.replace(/^0+/, "") || "0"

      return result
    } catch {
      return "0"
    }
  }

  const handleBridgeToken = () => {
    const weiAmount = convertToWei(amount, decimals)
    console.log("Bridging token:", {
      amount,
      decimals,
      weiAmount,
      vaultIdentifier,
    })
    crossVmBridgeTokenFromEvm({
      vaultIdentifier,
      amount: weiAmount,
    })
  }

  return (
    <DemoCard
      id="usecrossvmbridgetokenfromevm"
      title="useCrossVmBridgeTokenFromEvm"
      description="Bridge fungible tokens from Flow EVM to Cadence by withdrawing from the signer's Cadence-Owned Account (COA) in EVM."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#usecrossvmbridgetokenfromevm"
    >
      <div className="space-y-6">
        {clickTokenData && (
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
              <strong>Note:</strong> Example prefilled with ClickToken (ERC20)
              vault identifier for testnet
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Vault Identifier
          </label>
          <input
            type="text"
            value={vaultIdentifier}
            onChange={e => setVaultIdentifier(e.target.value)}
            placeholder={
              clickTokenData
                ? clickTokenData.vaultIdentifier
                : "e.g., A.dfc20aee650fcbdf.EVMVMBridgedToken_xxx.Vault"
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
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="e.g., 1 or 1.5"
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
            Token Decimals
          </label>
          <input
            type="text"
            value={decimals}
            onChange={e => setDecimals(e.target.value)}
            placeholder="e.g., 18"
            className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
              ${
              darkMode
                  ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                    focus:border-flow-primary/50`
                  : `bg-white border-black/10 text-black placeholder-gray-400
                    focus:border-flow-primary/50`
              } outline-none`}
          />
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ERC20 decimals (typically 18). Amount will be converted to Wei
            automatically.
          </p>
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleBridgeToken}
            disabled={isPending || !vaultIdentifier || !amount}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPending || !vaultIdentifier || !amount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isPending ? "Bridging..." : "Bridge Token from EVM"}
          </button>
        </div>

        <ResultsSection
          data={transactionId || error}
          darkMode={darkMode}
          show={!!transactionId || !!error}
          title={
            transactionId
              ? "Tokens bridged successfully!"
              : error
                ? `Bridge failed: ${error instanceof Error ? error.message : String(error)}`
                : undefined
          }
        />
      </div>
    </DemoCard>
  )
}
