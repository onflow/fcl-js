import {TransactionButton} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"
import {useState} from "react"

const IMPLEMENTATION_CODE = `<TransactionButton
  label="Sign Transaction"
  transaction={{
    cadence: GREETING_TRANSACTION,
    args: (arg, t) => [arg("Hello, World!", t.String)],
    limit: 999,
  }}
  mutation={{
    onSuccess: (data) => {
      console.log("Transaction ID:", data)
    },
    onError: (error) => {
      console.error("Transaction failed:", error)
    }
  }}
/>`

export function TransactionButtonCard() {
  const {darkMode} = useDarkMode()
  const [transactionResult, setTransactionResult] = useState<any>(null)

  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: &Account) {
        log(greeting)
      }
    }
  `

  return (
    <DemoCard
      id="kit-transaction-button"
      title="TransactionButton"
      description="A ready-to-use transaction button component with built-in signing flow and status management."
      code={IMPLEMENTATION_CODE}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="top left" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Transaction Signing
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Built-in wallet integration
            </p>
          </div>

          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Status Management
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Loading and error states
            </p>
          </div>
        </div>

        <div
          className={`relative p-8 rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="bottom left" className="absolute" />
          <div className="flex justify-center">
            <TransactionButton
              label="Sign Transaction"
              transaction={{
                cadence: GREETING_TRANSACTION,
                args: (arg, t) => [arg("Hello, World!", t.String)],
                limit: 999,
              }}
              mutation={{
                onSuccess: data => {
                  setTransactionResult({
                    txId: data,
                    timestamp: new Date().toISOString(),
                  })
                },
                onError: error => {
                  setTransactionResult({
                    error: error.message,
                    timestamp: new Date().toISOString(),
                  })
                },
              }}
            />
          </div>
        </div>

        {transactionResult && (
          <>
            <div
              className={`-mx-6 h-px ${darkMode ? "bg-white/10" : "bg-black/10"}`}
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-1.5 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <h4
                  className={`text-sm font-semibold uppercase tracking-wider ${
                  darkMode ? "text-gray-200" : "text-gray-700" }`}
                >
                  Transaction Result
                </h4>
              </div>

              {transactionResult.txId ? (
                <div
                  className={`relative p-4 rounded-lg border ${
                    darkMode
                      ? "bg-green-900/20 border-green-800/50"
                      : "bg-green-50 border-green-200"
                    }`}
                >
                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}
                    >
                      Transaction Submitted Successfully
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p
                          className={`text-xs mb-1 ${darkMode ? "text-green-400/70" : "text-green-600/70"}`}
                        >
                          Transaction ID:
                        </p>
                        <p
                          className={`text-sm font-mono break-all ${darkMode ? "text-green-400" : "text-green-600"}`}
                        >
                          {transactionResult.txId}
                        </p>
                      </div>
                      <p
                        className={`text-xs ${darkMode ? "text-green-400/50" : "text-green-600/50"}`}
                      >
                        {new Date(transactionResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`relative p-4 rounded-lg border ${
                    darkMode
                      ? "bg-red-900/20 border-red-800/50"
                      : "bg-red-50 border-red-200"
                    }`}
                >
                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      Transaction Failed
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      {transactionResult.error}
                    </p>
                    <p
                      className={`text-xs mt-2 ${darkMode ? "text-red-400/50" : "text-red-600/50"}`}
                    >
                      {new Date(transactionResult.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DemoCard>
  )
}
