import {
  useFlowCurrentUser,
  useFlowSchedule,
  ScheduledTxPriority,
  ScheduledTxStatus,
} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowSchedule } from "@onflow/react-sdk"

const {
  setupScheduler,
  listScheduledTx,
  getScheduledTx,
  cancelScheduledTx
} = useFlowSchedule()

// Setup manager
await setupScheduler()

// List all scheduled transactions
const transactions = await listScheduledTx("0xACCOUNT")

// Get specific transaction
const tx = await getScheduledTx("123")

// Cancel a transaction
await cancelScheduledTx("123")`

const PRIORITY_LABELS: Record<ScheduledTxPriority, string> = {
  [ScheduledTxPriority.Low]: "Low",
  [ScheduledTxPriority.Medium]: "Medium",
  [ScheduledTxPriority.High]: "High",
}

const STATUS_LABELS: Record<ScheduledTxStatus, string> = {
  [ScheduledTxStatus.Pending]: "Pending",
  [ScheduledTxStatus.Processing]: "Processing",
  [ScheduledTxStatus.Completed]: "Completed",
  [ScheduledTxStatus.Failed]: "Failed",
  [ScheduledTxStatus.Cancelled]: "Cancelled",
}

export function UseFlowScheduleCard() {
  const {darkMode} = useDarkMode()
  const {user} = useFlowCurrentUser()
  const {listScheduledTx, getScheduledTx, setupScheduler, cancelScheduledTx} =
    useFlowSchedule()

  const [activeTab, setActiveTab] = useState<
    "setup" | "list" | "get" | "cancel"
  >("setup")
  const [txId, setTxId] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [includeHandlerData, setIncludeHandlerData] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const txId = await setupScheduler()
      setResult({txId, message: "Manager setup successfully"})
    } catch (err: any) {
      setError(err.message || "Setup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleList = async () => {
    const address = accountAddress || user?.addr

    if (!address) {
      setError("Please connect your wallet or enter an account address")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const transactions = await listScheduledTx(address, {includeHandlerData})
      setResult({
        account: address,
        count: transactions.length,
        transactions,
      })
    } catch (err: any) {
      setError(err.message || "Failed to list transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleGet = async () => {
    if (!txId) {
      setError("Please enter a transaction ID")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const transaction = await getScheduledTx(txId, {
        includeHandlerData,
      })
      setResult(transaction || {message: "Transaction not found"})
    } catch (err: any) {
      setError(err.message || "Failed to get transaction")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!txId) {
      setError("Please enter a transaction ID")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const cancelTxId = await cancelScheduledTx(txId)
      setResult({
        txId: cancelTxId,
        message: "Transaction cancelled successfully",
      })
    } catch (err: any) {
      setError(err.message || "Failed to cancel transaction")
    } finally {
      setLoading(false)
    }
  }

  const formatTransactionInfo = (tx: any) => {
    if (!tx.id) return tx

    return {
      ID: tx.id,
      Priority:
        PRIORITY_LABELS[tx.priority as ScheduledTxPriority] || tx.priority,
      Status: STATUS_LABELS[tx.status as ScheduledTxStatus] || tx.status,
      "Execution Effort": tx.executionEffort.toString(),
      "Fees (FLOW)": tx.fees.formatted,
      "Scheduled At": new Date(tx.scheduledTimestamp * 1000).toLocaleString(),
      "Handler Type": tx.handlerTypeIdentifier,
      "Handler Address": tx.handlerAddress,
      ...(tx.handlerUUID && {"Handler UUID": tx.handlerUUID}),
      ...(tx.handlerResolvedViews && {
        "Handler Views": Object.keys(tx.handlerResolvedViews).length,
      }),
    }
  }

  return (
    <DemoCard
      id="useflowschedule"
      title="useFlowSchedule"
      description="Manage scheduled transactions on Flow blockchain - setup manager, list, get, and cancel scheduled transactions."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#useflowschedule"
    >
      <div className="space-y-6">
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          {(["setup", "list", "get", "cancel"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setResult(null)
                setError(null)
              }}
              className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                  ? darkMode
                    ? "border-b-2 border-flow-primary text-white"
                    : "border-b-2 border-flow-primary text-black"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "setup" && (
          <div className="space-y-4">
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Initialize the Transaction Scheduler Manager in your account
            </p>
            <button
              onClick={handleSetup}
              disabled={loading || !user?.addr}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !user?.addr
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
            >
              {loading ? "Setting up..." : "Setup Manager"}
            </button>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Account Address (optional)
              </label>
              <input
                type="text"
                value={accountAddress}
                onChange={e => setAccountAddress(e.target.value)}
                placeholder={
                  user?.addr
                    ? `Default: ${user.addr}`
                    : "e.g., 0x1234567890abcdef"
                }
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
                ${
                darkMode
                    ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                      focus:border-flow-primary/50`
                    : `bg-white border-black/10 text-black placeholder-gray-400
                      focus:border-flow-primary/50`
                } outline-none`}
              />
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Leave empty to use connected wallet address
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeHandler"
                checked={includeHandlerData}
                onChange={e => setIncludeHandlerData(e.target.checked)}
                className="w-4 h-4"
              />
              <label
                htmlFor="includeHandler"
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Include handler data
              </label>
            </div>
            <button
              onClick={handleList}
              disabled={loading || (!accountAddress && !user?.addr)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || (!accountAddress && !user?.addr)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
            >
              {loading ? "Loading..." : "List Transactions"}
            </button>
          </div>
        )}

        {activeTab === "get" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Transaction ID
              </label>
              <input
                type="text"
                value={txId}
                onChange={e => setTxId(e.target.value)}
                placeholder="e.g., 123"
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
                ${
                darkMode
                    ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                      focus:border-flow-primary/50`
                    : `bg-white border-black/10 text-black placeholder-gray-400
                      focus:border-flow-primary/50`
                } outline-none`}
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeHandlerGet"
                checked={includeHandlerData}
                onChange={e => setIncludeHandlerData(e.target.checked)}
                className="w-4 h-4"
              />
              <label
                htmlFor="includeHandlerGet"
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Include handler data
              </label>
            </div>
            <button
              onClick={handleGet}
              disabled={loading || !txId}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !txId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
            >
              {loading ? "Loading..." : "Get Transaction"}
            </button>
          </div>
        )}

        {activeTab === "cancel" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Transaction ID
              </label>
              <input
                type="text"
                value={txId}
                onChange={e => setTxId(e.target.value)}
                placeholder="e.g., 123"
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-all duration-200
                ${
                darkMode
                    ? `bg-gray-900/50 border-white/10 text-white placeholder-gray-500
                      focus:border-flow-primary/50`
                    : `bg-white border-black/10 text-black placeholder-gray-400
                      focus:border-flow-primary/50`
                } outline-none`}
              />
            </div>
            <button
              onClick={handleCancel}
              disabled={loading || !txId || !user?.addr}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !txId || !user?.addr
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {loading ? "Cancelling..." : "Cancel Transaction"}
            </button>
          </div>
        )}

        {(result || error) && (
          <ResultsSection
            data={
              error
                ? error
                : result?.transactions
                  ? {
                      account: result.account,
                      count: result.count,
                      transactions: result.transactions.map(
                        formatTransactionInfo
                      ),
                    }
                  : formatTransactionInfo(result)
            }
            darkMode={darkMode}
            show={true}
            title={error ? "Error" : "Result"}
          />
        )}
      </div>
    </DemoCard>
  )
}
