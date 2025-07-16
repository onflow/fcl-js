import {useFlowConfig, useFlowMutate} from "@onflow/react-sdk"
import {useState} from "react"

export function FlowMutateCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceTransaction, setCadenceTransaction] = useState(
    `
transaction {
    prepare(signer: &Account) {
        log("Hello from a transaction!")
    }
    
    execute {
        log("Transaction executed successfully")
    }
}
`.trim()
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
      args: (arg, t) => [],
    })
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowMutate</h2>
      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Preset Transactions:
        </label>
        <div className="mb-4">
          {presetTransactions.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCadenceTransaction(preset.transaction)}
              className="py-3 px-6 bg-[#f8f9fa] text-black border border-[#00EF8B] rounded-md
                cursor-pointer font-semibold text-base transition-all duration-200 ease-in-out
                mb-2 mr-2"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label className="block mb-2 text-black font-medium">
          Cadence Transaction:
        </label>
        <textarea
          value={cadenceTransaction}
          onChange={e => setCadenceTransaction(e.target.value)}
          placeholder="Enter your Cadence transaction here..."
          className="p-3 border-2 border-[#00EF8B] rounded-md text-sm text-black bg-white
            outline-none transition-colors duration-200 ease-in-out w-full min-h-[120px]
            font-mono resize-y mb-4"
        />

        <button
          onClick={handleSendTransaction}
          className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
            ease-in-out mr-4 ${
            isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00EF8B] text-black cursor-pointer"
            }`}
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send Transaction"}
        </button>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Transaction Status:</h4>

        {isPending && (
          <p className="text-gray-500 m-0">Sending transaction...</p>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {transactionId && !isPending && !error && (
          <div className="p-4 bg-green-100 border border-green-200 rounded m-0">
            <p className="text-green-800 m-0 mb-2">
              <strong>Transaction sent successfully!</strong>
            </p>
            <p className="text-green-800 m-0 font-mono">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {!transactionId && !isPending && !error && (
          <p className="text-gray-500 m-0">
            Click "Send Transaction" to submit the transaction to the blockchain
          </p>
        )}
      </div>
    </div>
  )
}
