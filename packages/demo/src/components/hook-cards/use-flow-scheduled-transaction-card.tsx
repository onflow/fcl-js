import {
  useFlowCurrentUser,
  useFlowScheduledTransactionList,
  useFlowScheduledTransaction,
  useFlowScheduledTransactionSetup,
  useFlowScheduledTransactionCancel,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
  type ScheduledTransaction,
} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard} from "../ui/demo-card"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import {
  useFlowScheduledTransactionList,
  useFlowScheduledTransaction,
  useFlowScheduledTransactionSetup,
  useFlowScheduledTransactionCancel
} from "@onflow/react-sdk"

// Setup the scheduler (one-time initialization)
const { setupAsync, isPending: isSettingUp } = useFlowScheduledTransactionSetup()
await setupAsync()

// List all scheduled transactions for an account
const { data: transactions, isLoading } = useFlowScheduledTransactionList({
  account: "0xACCOUNT",
  includeHandlerData: true  // Optional: include handler details
})

// Get a specific scheduled transaction by ID
const { data: transaction } = useFlowScheduledTransaction({
  scheduledTxId: "42",
  includeHandlerData: true
})

// Cancel a scheduled transaction
const { cancelTransactionAsync } = useFlowScheduledTransactionCancel()
await cancelTransactionAsync("42")`

const PRIORITY_LABELS: Record<ScheduledTransactionPriority, string> = {
  [ScheduledTransactionPriority.Low]: "Low",
  [ScheduledTransactionPriority.Medium]: "Medium",
  [ScheduledTransactionPriority.High]: "High",
}

const STATUS_LABELS: Record<ScheduledTransactionStatus, string> = {
  [ScheduledTransactionStatus.Pending]: "Pending",
  [ScheduledTransactionStatus.Processing]: "Processing",
  [ScheduledTransactionStatus.Completed]: "Completed",
  [ScheduledTransactionStatus.Failed]: "Failed",
  [ScheduledTransactionStatus.Cancelled]: "Cancelled",
}

export function UseFlowScheduledTransactionCard() {
  const {darkMode} = useDarkMode()
  const {user} = useFlowCurrentUser()

  // Individual hooks for each operation
  const {setupAsync, isPending: isSettingUp} =
    useFlowScheduledTransactionSetup()
  const {cancelTransactionAsync, isPending: isCancelling} =
    useFlowScheduledTransactionCancel()

  const [activeTab, setActiveTab] = useState<
    "setup" | "list" | "get" | "cancel"
  >("setup")
  const [txId, setTxId] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [includeHandlerData, setIncludeHandlerData] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Query hooks - reactive to input changes
  const listQuery = useFlowScheduledTransactionList({
    account: accountAddress || user?.addr,
    includeHandlerData,
    query: {
      enabled: activeTab === "list" && Boolean(accountAddress || user?.addr),
    },
  })

  const getQuery = useFlowScheduledTransaction({
    scheduledTxId: txId,
    includeHandlerData,
    query: {
      enabled: activeTab === "get" && Boolean(txId),
    },
  })

  const handleSetup = async () => {
    setError(null)
    setResult(null)
    try {
      const txId = await setupAsync()
      setResult({txId, message: "Manager setup successfully"})
    } catch (err: any) {
      setError(err.message || "Setup failed")
    }
  }

  const handleList = () => {
    setError(null)
    setResult(null)

    if (!accountAddress && !user?.addr) {
      setError("Please connect your wallet or enter an account address")
      return
    }

    // Results will automatically update via listQuery
    if (listQuery.data) {
      setResult({
        account: accountAddress || user?.addr,
        count: listQuery.data.length,
        transactions: listQuery.data,
      })
    }
  }

  const handleGet = () => {
    setError(null)
    setResult(null)

    if (!txId) {
      setError("Please enter a transaction ID")
      return
    }

    // Results will automatically update via getQuery
    if (getQuery.data !== undefined) {
      setResult(getQuery.data || {message: "Transaction not found"})
    }
  }

  const handleCancel = async () => {
    if (!txId) {
      setError("Please enter a transaction ID")
      return
    }

    setError(null)
    setResult(null)
    try {
      const cancelTxId = await cancelTransactionAsync(txId)
      setResult({
        txId: cancelTxId,
        message: "Transaction cancelled successfully",
      })
    } catch (err: any) {
      setError(err.message || "Failed to cancel transaction")
    }
  }

  // Update results when queries complete
  const handleRefresh = () => {
    if (activeTab === "list") {
      handleList()
    } else if (activeTab === "get") {
      handleGet()
    }
  }

  const formatTransactionInfo = (tx: ScheduledTransaction) => {
    if (!tx.id) return tx

    return {
      ID: tx.id,
      Priority:
        PRIORITY_LABELS[tx.priority as ScheduledTransactionPriority] ||
        tx.priority,
      Status:
        STATUS_LABELS[tx.status as ScheduledTransactionStatus] || tx.status,
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

  const isLoading =
    (activeTab === "list" && listQuery.isLoading) ||
    (activeTab === "get" && getQuery.isLoading) ||
    isSettingUp ||
    isCancelling

  return (
    <DemoCard
      id="useflowscheduledtransaction"
      title="Scheduled Transaction Hooks"
      description="Manage scheduled transactions on Flow blockchain with dedicated hooks for setup, listing, fetching, and canceling transactions. Uses TanStack Query for automatic caching and refetching."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/hooks#scheduled-transactions"
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
              (one-time setup)
            </p>
            <button
              onClick={handleSetup}
              disabled={isSettingUp || !user?.addr}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isSettingUp || !user?.addr
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
            >
              {isSettingUp ? "Setting up..." : "Setup Manager"}
            </button>
            {!user?.addr && (
              <p
                className={`text-sm ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
              >
                Please connect your wallet to setup the scheduler
              </p>
            )}
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
                id="includeHandlerList"
                checked={includeHandlerData}
                onChange={e => setIncludeHandlerData(e.target.checked)}
                className="w-4 h-4"
              />
              <label
                htmlFor="includeHandlerList"
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Include handler data
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleList}
                disabled={
                  listQuery.isLoading || (!accountAddress && !user?.addr)
                }
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                listQuery.isLoading || (!accountAddress && !user?.addr)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-flow-primary text-black hover:bg-flow-primary/80"
                }`}
              >
                {listQuery.isLoading ? "Loading..." : "List Transactions"}
              </button>
              {listQuery.data && (
                <button
                  onClick={() => listQuery.refetch()}
                  disabled={listQuery.isRefetching}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  listQuery.isRefetching
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {listQuery.isRefetching ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </div>
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
            <div className="flex gap-3">
              <button
                onClick={handleGet}
                disabled={getQuery.isLoading || !txId}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                getQuery.isLoading || !txId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-flow-primary text-black hover:bg-flow-primary/80"
                }`}
              >
                {getQuery.isLoading ? "Loading..." : "Get Transaction"}
              </button>
              {getQuery.data && (
                <button
                  onClick={() => getQuery.refetch()}
                  disabled={getQuery.isRefetching}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  getQuery.isRefetching
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {getQuery.isRefetching ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </div>
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
              disabled={isCancelling || !txId || !user?.addr}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isCancelling || !txId || !user?.addr
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isCancelling ? "Cancelling..." : "Cancel Transaction"}
            </button>
            {!user?.addr && (
              <p
                className={`text-sm ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
              >
                Please connect your wallet to cancel transactions
              </p>
            )}
          </div>
        )}

        {activeTab === "list" && listQuery.data && !result && (
          <ResultsSection
            data={{
              account: accountAddress || user?.addr,
              count: listQuery.data.length,
              transactions: listQuery.data.map(formatTransactionInfo),
            }}
            darkMode={darkMode}
            show={true}
            title="Result"
          />
        )}

        {activeTab === "get" && getQuery.data && !result && (
          <ResultsSection
            data={formatTransactionInfo(getQuery.data)}
            darkMode={darkMode}
            show={true}
            title="Result"
          />
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

        {isLoading && !result && !error && (
          <div
            className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Loading...
          </div>
        )}
      </div>
    </DemoCard>
  )
}
