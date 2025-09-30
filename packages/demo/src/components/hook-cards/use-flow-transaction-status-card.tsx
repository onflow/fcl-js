import {useFlowTransactionStatus} from "@onflow/react-sdk"
import {useState, useEffect} from "react"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowTransactionStatus } from "@onflow/react-sdk"

const { 
  transactionStatus, 
  error 
} = useFlowTransactionStatus({
  id: txId
})`

// Error boundary wrapper for the hook
function useSafeFlowTransactionStatus(id?: string) {
  const [hookError, setHookError] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Direct hook call with error handling
  const hookResult = (() => {
    try {
      return useFlowTransactionStatus({
        id,
      })
    } catch (error) {
      return {
        transactionStatus: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      }
    }
  })()

  useEffect(() => {
    if (!id) {
      setHookError(null)
      setTransactionStatus(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setHookError(null)

    try {
      if (hookResult.error) {
        if (hookResult.error.message.includes("Invalid transactionId")) {
          setHookError("Invalid transaction ID format")
        } else {
          setHookError(hookResult.error.message)
        }
      } else {
        setTransactionStatus(hookResult.transactionStatus)
      }
    } catch (error) {
      setHookError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transaction status"
      )
    } finally {
      setIsLoading(false)
    }
  }, [id, hookResult.error, hookResult.transactionStatus])

  return {
    transactionStatus,
    error: hookResult.error,
    hookError,
    isLoading,
  }
}

export function UseFlowTransactionStatusCard() {
  const {darkMode} = useDarkMode()
  const [transactionId, setTransactionId] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  // Normalize transaction ID - remove 0x prefix if present (Flow IDs don't use 0x)
  const normalizeTransactionId = (id: string): string => {
    const trimmedId = id.trim()
    if (!trimmedId) return ""

    // Remove 0x prefix if present
    if (trimmedId.startsWith("0x")) {
      return trimmedId.slice(2)
    }
    return trimmedId
  }

  // Flow transaction IDs are exactly 64 hex characters (no 0x prefix)
  const isValidTransactionId = (id: string): boolean => {
    const normalized = normalizeTransactionId(id)
    if (!normalized) return false

    // Must be exactly 64 hex characters
    if (normalized.length !== 64) {
      return false
    }

    // Must contain only valid hex characters
    return /^[a-fA-F0-9]{64}$/.test(normalized)
  }

  // Only pass valid transaction IDs to the hook, with error catching
  const validTransactionId = isValidTransactionId(transactionId)
    ? normalizeTransactionId(transactionId)
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
  const {transactionStatus, error, hookError, isLoading} =
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
    <DemoCard
      id="hook-flow-transaction-status"
      title="useFlowTransactionStatus"
      description="Monitor Flow transaction statuses in real time with automatic updates from pending to sealed."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#useflowtransactionstatus"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Transaction ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
            placeholder="Enter Flow transaction ID (64 hex chars, 0x prefix optional)"
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 ${
              transactionId.trim() === ""
                  ? darkMode
                    ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                      placeholder-gray-600`
                    : `bg-white text-black border-black/10 focus:border-flow-primary
                      placeholder-gray-400`
                  : isValidTransactionId(transactionId)
                    ? darkMode
                      ? "border-green-500 bg-green-900/20 text-green-400"
                      : "border-green-500 bg-green-50 text-green-900"
                    : darkMode
                      ? "border-red-500 bg-red-900/20 text-red-400"
                      : "border-red-500 bg-red-50 text-red-900"
              }`}
          />

          {transactionId.trim() !== "" &&
            !isValidTransactionId(transactionId) && (
              <div
                className={`relative p-3 rounded-lg border ${
                darkMode
                    ? "bg-red-900/20 border-red-800/50"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <PlusGridIcon placement="top right" className="absolute" />
                <div>
                  <p
                    className={`text-sm font-medium mb-1 ${darkMode ? "text-red-400" : "text-red-600"}`}
                  >
                    Invalid Format
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-red-400/70" : "text-red-600/70"}`}
                  >
                    Flow transaction ID must be exactly 64 hex characters (0x
                    prefix optional)
                  </p>
                  {debugInfo && (
                    <p
                      className={`text-xs mt-2 font-mono ${darkMode ? "text-red-400/50" : "text-red-600/50"}`}
                    >
                      {debugInfo}
                    </p>
                  )}
                </div>
              </div>
            )}

          {transactionId.trim() !== "" &&
            isValidTransactionId(transactionId) && (
              <div
                className={`relative p-3 rounded-lg border ${
                darkMode
                    ? "bg-green-900/20 border-green-800/50"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}
                  >
                    Valid transaction ID format - monitoring status...
                  </p>
                </div>
                {debugInfo && (
                  <p
                    className={`text-xs mt-2 font-mono ${darkMode ? "text-green-400/50" : "text-green-600/50"}`}
                  >
                    {debugInfo}
                  </p>
                )}
              </div>
            )}

          {!transactionId.trim() && (
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Enter a transaction ID above to automatically monitor its status
              updates
            </p>
          )}
        </div>

        <div
          className={`relative p-6 rounded-lg border min-h-[200px] ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <h4
            className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Transaction Status
          </h4>

          {!transactionId.trim() && (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Enter a transaction ID to check its status
              </p>
            </div>
          )}

          {transactionId.trim() !== "" &&
            !isValidTransactionId(transactionId) && (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-30 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Please enter a valid transaction ID format to check status
                </p>
              </div>
            )}

          {(error || hookError) && (
            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-red-900/20 border-red-800/50"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <PlusGridIcon placement="top right" className="absolute" />
              <div>
                <p
                  className={`text-sm font-medium mb-1 ${darkMode ? "text-red-400" : "text-red-600"}`}
                >
                  Status Check Failed
                </p>
                <p
                  className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
                >
                  {hookError || error?.message}
                </p>
              </div>
            </div>
          )}

          {transactionStatus && !error && !hookError && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full text-white text-sm font-semibold
                  ${getStatusColor(transactionStatus.status)}`}
                >
                  {getStatusText(transactionStatus.status)}
                </span>
                <span
                  className={`text-xs font-mono ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Status Code: {transactionStatus.status}
                </span>
              </div>

              {transactionStatus.errorMessage && (
                <div
                  className={`relative p-4 rounded-lg border ${
                  darkMode
                      ? "bg-red-900/20 border-red-800/50"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <PlusGridIcon placement="bottom left" className="absolute" />
                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      Transaction Error
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      {transactionStatus.errorMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ResultsSection
          data={transactionStatus || error || hookError}
          darkMode={darkMode}
          show={!!transactionStatus || !!error || !!hookError}
        />
      </div>
    </DemoCard>
  )
}
