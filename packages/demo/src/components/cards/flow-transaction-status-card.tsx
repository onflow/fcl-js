import {useFlowTransactionStatus} from "@onflow/react-sdk"
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
        return "bg-gray-500"
      case 1: // PENDING
        return "bg-yellow-500"
      case 2: // FINALIZED
        return "bg-purple-500"
      case 3: // EXECUTED
        return "bg-green-500"
      case 4: // SEALED
        return "bg-green-500"
      case 5: // EXPIRED
        return "bg-red-500"
      default:
        return "bg-gray-500"
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
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useFlowTransactionStatus
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Transaction ID:
        </label>
        <input
          type="text"
          value={transactionId}
          onChange={e => setTransactionId(e.target.value)}
          placeholder="Enter transaction ID (e.g., 0x1234567890abcdef...)"
          className={`p-3 border-2 rounded-md text-sm text-black bg-white outline-none
            transition-colors duration-200 ease-in-out w-full mb-2 font-mono ${
            transactionId.trim() === ""
                ? "border-[#00EF8B]"
                : isValidTransactionId(transactionId)
                  ? "border-green-500"
                  : "border-red-500"
            }`}
        />

        {transactionId.trim() !== "" &&
          !isValidTransactionId(transactionId) && (
            <div className="p-2 bg-red-100 border border-red-200 rounded text-red-800 text-xs mb-4">
              <strong>Invalid format:</strong> Transaction ID must be a hex
              string starting with "0x" and exactly 64 characters long
              <br />
              <small className="text-gray-500 text-xs">{debugInfo}</small>
            </div>
          )}

        {!transactionId.trim() && (
          <p className="text-gray-500 text-sm m-0 mb-4">
            Enter a transaction ID above to automatically watch its status
            updates.
          </p>
        )}

        {transactionId.trim() !== "" && isValidTransactionId(transactionId) && (
          <div className="mb-4">
            <p className="text-green-600 text-sm m-0 mb-2 font-medium">
              ✓ Valid transaction ID format - monitoring status...
            </p>
            <small className="text-gray-500 text-xs">{debugInfo}</small>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Transaction Status:</h4>

        {!transactionId.trim() && (
          <p className="text-gray-500 m-0">
            Enter a transaction ID to check its status
          </p>
        )}

        {transactionId.trim() !== "" &&
          !isValidTransactionId(transactionId) && (
            <p className="text-red-500 m-0">
              Please enter a valid transaction ID format to check status
            </p>
          )}

        {(error || hookError) && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {hookError || error?.message}
          </div>
        )}

        {transactionStatus && !error && !hookError && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`py-1 px-3 rounded-full text-white text-sm font-semibold ${getStatusColor(
                transactionStatus.status )}`}
              >
                {getStatusText(transactionStatus.status)}
              </span>
              <span className="text-gray-500 text-xs font-mono">
                Status Code: {transactionStatus.status}
              </span>
            </div>
            {transactionStatus.errorMessage && (
              <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0 mb-4">
                <strong>Transaction Error:</strong>{" "}
                {transactionStatus.errorMessage}
              </div>
            )}
            <details>
              <summary className="text-black cursor-pointer font-medium mb-2">
                Full Transaction Status
              </summary>
              <pre
                className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-xs text-black
                  m-0 whitespace-pre-wrap"
              >
                {JSON.stringify(transactionStatus, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
