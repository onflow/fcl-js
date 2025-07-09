import {useFlowTransactionStatus} from "@onflow/kit"
import {useState, useEffect} from "react"

// Safe wrapper hook for transaction status
function useSafeFlowTransactionStatus(id?: string) {
  const [hookError, setHookError] = useState<string | null>(null)

  useEffect(() => {
    setHookError(null)
  }, [id])

  // Always call the hook (React rule), but pass undefined when not ready
  const shouldCallHook = Boolean(id)

  const result = useFlowTransactionStatus({
    id: shouldCallHook ? id : undefined,
  })

  // Handle FCL validation errors
  useEffect(() => {
    if (
      result.error &&
      result.error.message.includes("Invalid transactionId")
    ) {
      setHookError("Transaction ID not found or invalid on current network")
    }
  }, [result.error])

  return {
    transactionStatus: result.transactionStatus,
    error: result.error,
    hookError: hookError,
  }
}

export function FlowTransactionStatusCard() {
  const [transactionId, setTransactionId] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  // Improved validation - Flow transaction IDs must be exactly 64 hex characters after 0x
  const isValidTransactionId = (id: string): boolean => {
    const trimmedId = id.trim()

    // Must start with 0x and be exactly 66 characters total (0x + 64 hex chars)
    if (trimmedId.length !== 66 || !trimmedId.startsWith("0x")) {
      return false
    }

    // Must contain only valid hex characters after 0x
    const hexPart = trimmedId.slice(2)
    return /^[a-fA-F0-9]{64}$/.test(hexPart)
  }

  // Only pass valid transaction IDs to the hook, with error catching
  const validTransactionId = isValidTransactionId(transactionId)
    ? transactionId.trim()
    : undefined

  // Add debug logging
  useEffect(() => {
    if (transactionId.trim()) {
      setDebugInfo(
        `Input: "${transactionId.trim()}", Length: ${transactionId.trim().length}, Valid: ${isValidTransactionId(transactionId)}`
      )
    } else {
      setDebugInfo("")
    }
  }, [transactionId])

  // Use safe wrapper hook
  const {transactionStatus, error, hookError} =
    useSafeFlowTransactionStatus(validTransactionId)

  const getStatusColor = (statusCode: number) => {
    switch (statusCode) {
      case 0: // UNKNOWN
        return "#666666"
      case 1: // PENDING
        return "#FFB800"
      case 2: // FINALIZED
        return "#9945FF"
      case 3: // EXECUTED
        return "#00EF8B"
      case 4: // SEALED
        return "#00EF8B"
      case 5: // EXPIRED
        return "#FF6B6B"
      default:
        return "#666666"
    }
  }

  const getStatusText = (statusCode: number) => {
    switch (statusCode) {
      case 0:
        return "UNKNOWN"
      case 1:
        return "PENDING"
      case 2:
        return "FINALIZED"
      case 3:
        return "EXECUTED"
      case 4:
        return "SEALED"
      case 5:
        return "EXPIRED"
      default:
        return `UNKNOWN (${statusCode})`
    }
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
        useFlowTransactionStatus
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
          Transaction ID:
        </label>
        <input
          type="text"
          value={transactionId}
          onChange={e => setTransactionId(e.target.value)}
          placeholder="Enter transaction ID (e.g., 0x1234567890abcdef...)"
          style={{
            padding: "0.75rem",
            border: `2px solid ${
              transactionId.trim() === ""
                ? "#00EF8B"
                : isValidTransactionId(transactionId)
                  ? "#00EF8B"
                  : "#FF6B6B"
            }`,
            borderRadius: "6px",
            fontSize: "0.9rem",
            color: "#000000",
            backgroundColor: "#FFFFFF",
            outline: "none",
            transition: "border-color 0.2s ease",
            width: "100%",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}
        />

        {transactionId.trim() !== "" &&
          !isValidTransactionId(transactionId) && (
            <div
              style={{
                padding: "0.5rem",
                backgroundColor: "#ffe6e6",
                border: "1px solid #FF6B6B",
                borderRadius: "4px",
                color: "#d63384",
                fontSize: "0.8rem",
                marginBottom: "1rem",
              }}
            >
              <strong>Invalid format:</strong> Transaction ID must be a hex
              string starting with "0x" and exactly 64 characters long
              <br />
              <small style={{color: "#666", fontSize: "0.7rem"}}>
                {debugInfo}
              </small>
            </div>
          )}

        {!transactionId.trim() && (
          <p
            style={{color: "#666666", fontSize: "0.9rem", margin: "0 0 1rem 0"}}
          >
            Enter a transaction ID above to automatically watch its status
            updates.
          </p>
        )}

        {transactionId.trim() !== "" && isValidTransactionId(transactionId) && (
          <div style={{marginBottom: "1rem"}}>
            <p
              style={{
                color: "#00EF8B",
                fontSize: "0.9rem",
                margin: "0 0 0.5rem 0",
                fontWeight: "500",
              }}
            >
              ✓ Valid transaction ID format - monitoring status...
            </p>
            <small style={{color: "#666", fontSize: "0.7rem"}}>
              {debugInfo}
            </small>
          </div>
        )}
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

        {!transactionId.trim() && (
          <p style={{color: "#666666", margin: "0"}}>
            Enter a transaction ID to check its status
          </p>
        )}

        {transactionId.trim() !== "" &&
          !isValidTransactionId(transactionId) && (
            <p style={{color: "#FF6B6B", margin: "0"}}>
              Please enter a valid transaction ID format to check status
            </p>
          )}

        {(error || hookError) && (
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
            <strong>Error:</strong> {hookError || error?.message}
          </div>
        )}

        {transactionStatus && !error && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(transactionStatus.status),
                  }}
                />
                <span
                  style={{
                    color: "#000000",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  {getStatusText(transactionStatus.status)}
                </span>
              </div>
            </div>

            <pre
              style={{
                backgroundColor: "#FFFFFF",
                padding: "1rem",
                borderRadius: "4px",
                border: "1px solid #00EF8B",
                overflow: "auto",
                fontSize: "0.8rem",
                color: "#000000",
                margin: "0",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(transactionStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#fff8e1",
          borderRadius: "6px",
          border: "1px solid #FFB800",
        }}
      >
        <h5 style={{color: "#000000", margin: "0 0 0.5rem 0"}}>
          Status Codes:
        </h5>
        <ul
          style={{
            color: "#666666",
            margin: "0",
            paddingLeft: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          <li>
            <strong>PENDING (1):</strong> Transaction submitted but not yet
            finalized
          </li>
          <li>
            <strong>FINALIZED (2):</strong> Transaction included in a block
          </li>
          <li>
            <strong>EXECUTED (3):</strong> Transaction executed successfully
          </li>
          <li>
            <strong>SEALED (4):</strong> Transaction permanently committed
          </li>
          <li>
            <strong>EXPIRED (5):</strong> Transaction expired before execution
          </li>
        </ul>
      </div>
    </div>
  )
}
