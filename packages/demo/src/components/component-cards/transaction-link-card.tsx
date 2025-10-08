import {TransactionButton, TransactionLink} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { TransactionLink } from "@onflow/react-sdk"

<TransactionLink txId={txId} />`

const PROPS: PropDefinition[] = [
  {
    name: "txId",
    type: "string",
    required: true,
    description: "Transaction ID to create block explorer link for",
  },
  {
    name: "variant",
    type: '"primary" | "secondary" | "outline" | "link"',
    required: false,
    description: "The visual style variant of the link button",
    defaultValue: '"link"',
  },
]

export function TransactionLinkCard() {
  const {darkMode} = useDarkMode()
  const [txId, setTxId] = useState<string | undefined>(undefined)
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
      id="transactionlink"
      title="<TransactionLink />"
      description="A link component that automatically generates URLs to block explorers for viewing transaction details."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#transactionlink"
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
              Block Explorer
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Direct links to flowscan
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
              Network Aware
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Auto network detection
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
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <TransactionButton
                label="Trigger Transaction"
                transaction={{
                  cadence: GREETING_TRANSACTION,
                  args: (arg, t) => [arg("Hello, World!", t.String)],
                  limit: 999,
                }}
                mutation={{
                  onSuccess: data => {
                    setTxId(data)
                    setTransactionResult({
                      txId: data,
                      timestamp: new Date().toISOString(),
                      linkGenerated: true,
                    })
                  },
                  onError: error => {
                    setTransactionResult({
                      error: error.message,
                      timestamp: new Date().toISOString(),
                      linkGenerated: false,
                    })
                  },
                }}
              />
            </div>

            {txId && (
              <div
                className={`relative p-4 rounded-lg border ${
                darkMode
                    ? "bg-green-900/20 border-green-800/50"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5 text-green-500"
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
                      className={`font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}
                    >
                      Transaction Submitted!
                    </p>
                  </div>

                  <div className="text-center">
                    <TransactionLink txId={txId} />
                  </div>

                  <div
                    className={`text-xs font-mono text-center p-2 rounded ${
                    darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Transaction ID: {txId}
                  </div>
                </div>
              </div>
            )}

            {!txId && (
              <div className="text-center py-6">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Submit a transaction to see the block explorer link
                </p>
              </div>
            )}
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
                      Transaction Submitted & Link Generated
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
