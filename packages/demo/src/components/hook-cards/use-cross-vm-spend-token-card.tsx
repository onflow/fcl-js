import {useCrossVmSpendToken, useFlowConfig} from "@onflow/react-sdk"
import {useState, useMemo} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"
import {getContractAddress} from "../../constants"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { useCrossVmSpendToken } from "@onflow/react-sdk"

const {
  spendToken,
  isPending,
  error,
  data: txId
} = useCrossVmSpendToken()

spendToken({
  vaultIdentifier: "A.dfc20aee650fcbdf.EVMVMBridgedToken_xxx.Vault",
  amount: "1.0",
  calls: []
})`

export function UseCrossVmSpendTokenCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [vaultIdentifier, setVaultIdentifier] = useState("")
  const [amount, setAmount] = useState("1") // UFix64 in Cadence (8 decimals)

  const {spendToken, isPending, data: transactionId, error} = useCrossVmSpendToken()

  const clickTokenData = useMemo(() => {
    if (currentNetwork !== "testnet") return null

    const clickTokenAddress = getContractAddress("ClickToken", currentNetwork)
    return {
      name: "ClickToken",
      vaultIdentifier: `A.${clickTokenAddress.replace("0x", "")}.EVMVMBridgedToken_a7cf2260e501952c71189d04fad17c704dfb36e6.Vault`,
      amount: "1", // 1 ClickToken (UFix64 with 8 decimals)
    }
  }, [currentNetwork])

  // Set default vault identifier when network changes to testnet
  useMemo(() => {
    if (clickTokenData && !vaultIdentifier) {
      setVaultIdentifier(clickTokenData.vaultIdentifier)
      setAmount(clickTokenData.amount)
    }
  }, [clickTokenData, vaultIdentifier])

  // Normalize amount to ensure it has a decimal point for UFix64
  const normalizeAmount = (value: string): string => {
    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "")
    // If it's just a number without decimal, add .0
    if (cleaned && !cleaned.includes(".")) {
      return `${cleaned}.0`
    }
    return cleaned
  }

  const handleSpendToken = () => {
    const normalizedAmount = normalizeAmount(amount)
    spendToken({
      vaultIdentifier,
      amount: normalizedAmount,
      calls: [], // No EVM calls, just bridging
    })
  }

  return (
    <DemoCard
      id="hook-cross-vm-spend-token"
      title="useCrossVmSpendToken"
      description="Bridge fungible tokens from Cadence to Flow EVM by depositing them into the signer's Cadence-Owned Account (COA)."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#usecrossvmspendtoken"
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
            <PlusGridIcon placement="top right" className="absolute" />
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
            className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200 ${
              darkMode
                ? "bg-gray-900/50 border-white/10 text-white placeholder-gray-500 focus:border-flow-primary/50"
                : "bg-white border-black/10 text-black placeholder-gray-400 focus:border-flow-primary/50"
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
            className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200 ${
              darkMode
                ? "bg-gray-900/50 border-white/10 text-white placeholder-gray-500 focus:border-flow-primary/50"
                : "bg-white border-black/10 text-black placeholder-gray-400 focus:border-flow-primary/50"
            } outline-none`}
          />
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Enter amount as a number (e.g., "1" or "1.5"). Will be converted to UFix64 format.
          </p>
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleSpendToken}
            disabled={isPending || !vaultIdentifier || !amount}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPending || !vaultIdentifier || !amount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
            }`}
          >
            {isPending ? "Bridging..." : "Bridge Token to EVM"}
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
                ? "Bridge failed"
                : undefined
          }
        />
      </div>
    </DemoCard>
  )
}
