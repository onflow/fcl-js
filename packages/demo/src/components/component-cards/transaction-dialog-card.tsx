import {TransactionButton, TransactionDialog} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `<TransactionDialog open={open} onOpenChange={setOpen} txId={txId} />`

const PROPS: PropDefinition[] = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description: "Controls whether the dialog is open or closed",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Callback function called when the dialog open state changes",
  },
  {
    name: "txId",
    type: "string",
    required: false,
    description: "Transaction ID to display status for",
  },
  {
    name: "onSuccess",
    type: "() => void",
    required: false,
    description: "Callback function called when transaction succeeds",
  },
  {
    name: "pendingTitle",
    type: "string",
    required: false,
    description:
      "Custom title for pending state (defaults to 'Transaction Pending')",
  },
  {
    name: "pendingDescription",
    type: "string",
    required: false,
    description: "Custom description for pending state",
  },
  {
    name: "successTitle",
    type: "string",
    required: false,
    description:
      "Custom title for success state (defaults to 'Transaction Successful')",
  },
  {
    name: "successDescription",
    type: "string",
    required: false,
    description: "Custom description for success state",
  },
  {
    name: "closeOnSuccess",
    type: "boolean",
    required: false,
    description:
      "Whether to automatically close dialog when transaction succeeds",
  },
]

export function TransactionDialogCard() {
  const {darkMode} = useDarkMode()
  const [open, setOpen] = useState(false)
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
      id="kit-transaction-dialog"
      title="TransactionDialog"
      description="A modal dialog component that displays transaction status and progress with real-time updates."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
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
              Real-time Updates
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Live transaction status
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
              Modal Interface
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Overlay with progress
            </p>
          </div>
        </div>

        <div
          className={`relative p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-900 border-white/10"
              : "bg-gray-100 border-black/5"
            }`}
        >
          <h4
            className={`text-xs font-medium mb-3 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            Dialog Flow
          </h4>
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-8 h-8 rounded-full bg-flow-primary flex items-center justify-center text-black
                  font-bold"
              >
                1
              </div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Sign Transaction
              </span>
            </div>
            <div
              className={`flex-1 h-0.5 mx-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-8 h-8 rounded-full bg-flow-primary flex items-center justify-center text-black
                  font-bold"
              >
                2
              </div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Dialog Opens
              </span>
            </div>
            <div
              className={`flex-1 h-0.5 mx-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-8 h-8 rounded-full bg-flow-primary flex items-center justify-center text-black
                  font-bold"
              >
                3
              </div>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Status Updates
              </span>
            </div>
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
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <TransactionButton
                label="Trigger Transaction Dialog"
                transaction={{
                  cadence: GREETING_TRANSACTION,
                  args: (arg, t) => [arg("Hello, World!", t.String)],
                  limit: 999,
                }}
                mutation={{
                  onSuccess: data => {
                    setTxId(data)
                    setOpen(true)
                    setTransactionResult({
                      txId: data,
                      timestamp: new Date().toISOString(),
                      dialogShown: true,
                    })
                  },
                  onError: error => {
                    setTransactionResult({
                      error: error.message,
                      timestamp: new Date().toISOString(),
                      dialogShown: false,
                    })
                  },
                }}
              />
            </div>

            {txId && !open && (
              <div
                className={`relative p-3 rounded-lg border ${
                darkMode
                    ? "bg-green-900/20 border-green-800/50"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
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
                    Transaction submitted! Dialog was displayed.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className={`mt-2 text-xs underline ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  Show dialog again
                </button>
              </div>
            )}
          </div>
        </div>

        <TransactionDialog open={open} onOpenChange={setOpen} txId={txId} />
      </div>
    </DemoCard>
  )
}
