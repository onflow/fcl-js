import {useFlowConfig, useFlowMutate} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowMutate } from "@onflow/react-sdk"

const { 
  mutate, 
  isPending, 
  error, 
  data: txId 
} = useFlowMutate({
  cadence: TRANSACTION_CADENCE,
  args: (arg, t) => [arg("value", t.String)],
  limit: 999,
})`

export function UseFlowMutateCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceTransaction, setCadenceTransaction] = useState(
    `transaction {
    prepare(signer: &Account) {
        log("Hello from a transaction!")
    }
    
    execute {
        log("Transaction executed successfully")
    }
}`.trim()
  )

  const {mutate, isPending, data: transactionId, error} = useFlowMutate()

  const presetTransactions = [
    {
      name: "Simple Log",
      transaction: `transaction {
    prepare(signer: &Account) {
        log("Hello from a transaction!")
    }
    
    execute {
        log("Transaction executed successfully")
    }
}`,
    },
  ]

  const handleSendTransaction = () => {
    mutate({
      cadence: cadenceTransaction,
      args: () => [],
    })
  }

  return (
    <DemoCard
      id="hook-flow-mutate"
      title="useFlowMutate"
      description="Send transactions to the Flow blockchain using Cadence scripts with built-in loading states and error handling."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#useflowmutate"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Preset Transactions
          </label>
          <div className="flex flex-wrap gap-2">
            {presetTransactions.map(preset => (
              <button
                key={preset.name}
                onClick={() => setCadenceTransaction(preset.transaction)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                darkMode
                    ? "bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700"
                    : "bg-white text-gray-700 border-black/10 hover:bg-gray-50"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Cadence Transaction
          </label>
          <textarea
            value={cadenceTransaction}
            onChange={e => setCadenceTransaction(e.target.value)}
            placeholder="Enter your Cadence transaction here..."
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 min-h-[150px] resize-y ${
              darkMode
                  ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                    placeholder-gray-600`
                  : `bg-white text-black border-black/10 focus:border-flow-primary
                    placeholder-gray-400`
              }`}
          />
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleSendTransaction}
            disabled={isPending}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isPending ? "Sending..." : "Send Transaction"}
          </button>
        </div>

        <ResultsSection
          data={transactionId || error}
          darkMode={darkMode}
          show={!!transactionId || !!error}
        />
      </div>
    </DemoCard>
  )
}
