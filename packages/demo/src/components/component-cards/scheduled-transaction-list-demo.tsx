import {
  ScheduledTransactionList,
  useFlowCurrentUser,
  useFlowChainId,
} from "@onflow/react-sdk"
import {useState} from "react"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"
import {DEMO_ADDRESS_TESTNET} from "../../constants"

const IMPLEMENTATION_CODE = `import { ScheduledTransactionList, useFlowCurrentUser } from "@onflow/react-sdk"

function MyComponent() {
  const { user } = useFlowCurrentUser()

  return (
    <div style={{ height: "600px" }}>
      <ScheduledTransactionList
        address={user?.addr || ""}
        filterHandlerTypes={["A.123.Contract.Handler1"]}
      />
    </div>
  )
}`

const PROPS: PropDefinition[] = [
  {
    name: "address",
    type: "string",
    required: true,
    description: "The Flow account address to fetch scheduled transactions for",
  },
  {
    name: "filterHandlerTypes",
    type: "string[]",
    required: false,
    description:
      "Array of handler type identifiers to filter. Only transactions matching these types will be displayed",
  },
  {
    name: "className",
    type: "string",
    required: false,
    description: "Additional CSS classes to apply to the list container",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    required: false,
    description: "Inline styles to apply to the list container",
  },
]

export function ScheduledTransactionListDemo() {
  const {darkMode} = useDarkMode()
  const {user} = useFlowCurrentUser()
  const {data: chainId, isLoading} = useFlowChainId()
  const isEmulator = chainId === "emulator" || chainId === "local"
  const [customAddress, setCustomAddress] = useState("")
  const [filterInput, setFilterInput] = useState("")

  const normalizeAddress = (address: string): string => {
    if (!address) return ""
    const trimmed = address.trim()
    return trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`
  }

  const displayAddress = customAddress
    ? normalizeAddress(customAddress)
    : chainId === "testnet"
      ? DEMO_ADDRESS_TESTNET
      : user?.addr || ""

  const filterHandlerTypes = filterInput
    ? filterInput
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
    : undefined

  return (
    <DemoCard
      id="scheduledtransactionlist"
      title="<ScheduledTransactionList />"
      description="A scrollable list component that displays all scheduled transactions for an account with automatic refresh after cancellation."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#scheduledtransactionlist"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Auto-fetch
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Automatic data fetching
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
              Scrollable
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Configurable max height
            </p>
          </div>

          <div
            className={`relative p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="bottom left" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Auto-refresh
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Refreshes after cancellation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Account Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAddress}
                onChange={e => setCustomAddress(e.target.value)}
                placeholder={user?.addr || "Enter Flow address (e.g., 0x...)"}
                className={`flex-1 px-3 py-2 rounded-md border text-sm font-mono ${
                  darkMode
                    ? `bg-gray-800 border-gray-700 text-white placeholder-gray-500
                      focus:border-blue-500`
                    : `bg-white border-gray-300 text-gray-900 placeholder-gray-400
                      focus:border-blue-500`
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {customAddress && (
                <button
                  onClick={() => setCustomAddress("")}
                  className={`px-3 py-2 rounded-md border text-sm ${
                  darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
            {!customAddress && (
              <p
                className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                {chainId === "testnet"
                  ? `Using demo account: ${DEMO_ADDRESS_TESTNET}`
                  : user?.addr
                    ? `Using connected wallet address: ${user.addr}`
                    : "Connect wallet or enter address to view scheduled transactions"}
              </p>
            )}
          </div>

          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Filter by Handler Types (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={filterInput}
                onChange={e => setFilterInput(e.target.value)}
                placeholder="e.g., A.123.Contract.Handler1, A.456.Contract.Handler2"
                className={`flex-1 px-3 py-2 rounded-md border text-sm font-mono ${
                  darkMode
                    ? `bg-gray-800 border-gray-700 text-white placeholder-gray-500
                      focus:border-blue-500`
                    : `bg-white border-gray-300 text-gray-900 placeholder-gray-400
                      focus:border-blue-500`
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {filterInput && (
                <button
                  onClick={() => setFilterInput("")}
                  className={`px-3 py-2 rounded-md border text-sm ${
                  darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
            <p
              className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              {filterInput
                ? `Filtering by ${filterHandlerTypes?.length || 0} handler type(s)`
                : "Enter comma-separated handler type identifiers to filter transactions"}
            </p>
          </div>
        </div>

        <div
          className={`relative rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          {isLoading ? (
            <div className="text-center py-8 px-6">
              <div
                className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                  darkMode ? "border-white" : "border-black" }`}
              ></div>
              <p
                className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading chain information...
              </p>
            </div>
          ) : isEmulator ? (
            <div className="p-6">
              <div
                className={`text-center py-8 px-6 rounded-lg border ${
                  darkMode
                    ? "bg-orange-900/20 border-orange-800/50"
                    : "bg-orange-50 border-orange-200"
                  }`}
              >
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-orange-400" : "text-orange-600"}`}
                >
                  Emulator Network Detected
                </p>
                <p
                  className={`text-xs mt-1 ${darkMode ? "text-orange-400/70" : "text-orange-600/70"}`}
                >
                  Scheduled transactions require testnet or mainnet
                </p>
              </div>
            </div>
          ) : !displayAddress ? (
            <div className="p-6">
              <div
                className={`text-center py-8 px-6 rounded-lg border ${
                  darkMode
                    ? "bg-blue-900/20 border-blue-800/50"
                    : "bg-blue-50 border-blue-200"
                  }`}
              >
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Connect Wallet or Enter Address
                </p>
                <p
                  className={`text-xs mt-1 ${darkMode ? "text-blue-400/70" : "text-blue-600/70"}`}
                >
                  Connect your wallet or enter a Flow address above to view
                  scheduled transactions
                </p>
              </div>
            </div>
          ) : (
            <div style={{height: "500px", overflowY: "auto"}}>
              <ScheduledTransactionList
                address={displayAddress}
                filterHandlerTypes={filterHandlerTypes}
              />
            </div>
          )}
        </div>
      </div>
    </DemoCard>
  )
}
