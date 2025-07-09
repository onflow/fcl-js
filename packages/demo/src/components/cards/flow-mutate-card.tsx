import {useFlowMutate, useFlowConfig} from "@onflow/kit"
import {useState} from "react"
import {getContractAddress} from "../../constants"

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
    <div
      style={{
        padding: "2rem",
        border: "2px solid #00EF8B",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 6px rgba(0, 239, 139, 0.1)",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          color: "#000000",
          marginTop: "0",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        useFlowMutate
      </h2>

      <div style={{marginBottom: "1.5rem"}}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#000000",
            fontWeight: "500",
          }}
        >
          Preset Transactions:
        </label>
        <div style={{marginBottom: "1rem"}}>
          {presetTransactions.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCadenceTransaction(preset.transaction)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f8f9fa",
                color: "#000000",
                border: "1px solid #00EF8B",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                marginBottom: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#000000",
            fontWeight: "500",
          }}
        >
          Cadence Transaction:
        </label>
        <textarea
          value={cadenceTransaction}
          onChange={e => setCadenceTransaction(e.target.value)}
          placeholder="Enter your Cadence transaction here..."
          style={{
            padding: "0.75rem",
            border: "2px solid #00EF8B",
            borderRadius: "6px",
            fontSize: "0.9rem",
            color: "#000000",
            backgroundColor: "#FFFFFF",
            outline: "none",
            transition: "border-color 0.2s ease",
            width: "100%",
            minHeight: "120px",
            fontFamily: "monospace",
            resize: "vertical" as const,
            marginBottom: "1rem",
          }}
        />

        <button
          onClick={handleSendTransaction}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: isPending ? "#cccccc" : "#00EF8B",
            color: isPending ? "#666666" : "#000000",
            border: "none",
            borderRadius: "6px",
            cursor: isPending ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            marginRight: "1rem",
          }}
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send Transaction"}
        </button>
      </div>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #00EF8B",
        }}
      >
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>
          Transaction Status:
        </h4>

        {isPending && (
          <p style={{color: "#666666", margin: "0"}}>Sending transaction...</p>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              color: "#721c24",
              margin: "0",
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {transactionId && !isPending && !error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: "4px",
              margin: "0",
            }}
          >
            <p style={{color: "#155724", margin: "0 0 0.5rem 0"}}>
              <strong>Transaction sent successfully!</strong>
            </p>
            <p style={{color: "#155724", margin: "0", fontFamily: "monospace"}}>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          </div>
        )}

        {!transactionId && !isPending && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Send Transaction" to submit the transaction to the blockchain
          </p>
        )}
      </div>
    </div>
  )
}
