import {useState} from "react"
import {Connect, useFlowChainId} from "@onflow/react-sdk"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"
import {CONTRACT_ADDRESSES} from "../../constants"

const IMPLEMENTATION_CODE = `import { Connect } from "@onflow/react-sdk"

// Basic usage - shows FLOW by default
<Connect />

// With multiple tokens - dropdown selector, first token is default
// Note: Provide only ONE identifier per token (the bridge derives the other)
<Connect
  balanceTokens={[
    {
      symbol: "FLOW",
      name: "Flow Token",
      vaultIdentifier: "A.1654653399040a61.FlowToken.Vault",
    },
    {
      symbol: "USDF",
      name: "USDF (PYUSD)",
      vaultIdentifier: "A.1e4aa0b87d10b141.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault",
    },
  ]}
  balanceType="combined"
/>`

const PROPS: PropDefinition[] = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "outline" | "link"',
    required: false,
    description: "The visual style variant of the connect button",
    defaultValue: '"primary"',
  },
  {
    name: "onConnect",
    type: "() => void",
    required: false,
    description: "Callback function called when user connects their wallet",
  },
  {
    name: "onDisconnect",
    type: "() => void",
    required: false,
    description: "Callback function called when user disconnects their wallet",
  },
  {
    name: "balanceType",
    type: '"cadence" | "evm" | "combined"',
    required: false,
    description:
      "Type of balance to display: cadence (Cadence VM only), evm (EVM only), or combined (sum of both)",
    defaultValue: '"cadence"',
  },
  {
    name: "balanceTokens",
    type: "TokenConfig[]",
    required: false,
    description:
      "Array of tokens with dropdown selector (first token is default). Each token needs symbol, name, and EXACTLY ONE of: vaultIdentifier OR erc20Address (the bridge derives the other automatically)",
  },
  {
    name: "modalConfig",
    type: "ConnectModalConfig",
    required: false,
    description:
      "Configuration for the profile modal (like show scheduled transactions, filter handler types)",
  },
]

export function ConnectCard() {
  const {darkMode} = useDarkMode()
  const {data: chainId, isLoading} = useFlowChainId()
  const isEmulator = chainId === "emulator" || chainId === "local"
  const [showMultiToken, setShowMultiToken] = useState(false)
  const [balanceType, setBalanceType] = useState<
    "cadence" | "evm" | "combined"
  >("cadence")

  const getFlowTokenAddress = () => {
    if (chainId === "emulator" || chainId === "local") {
      return CONTRACT_ADDRESSES.FlowToken.emulator
    }
    return chainId === "testnet"
      ? CONTRACT_ADDRESSES.FlowToken.testnet
      : CONTRACT_ADDRESSES.FlowToken.mainnet
  }

  const multiTokens = [
    {
      symbol: "FLOW",
      name: "Flow Token",
      vaultIdentifier: `A.${getFlowTokenAddress().replace("0x", "")}.FlowToken.Vault`,
    },
    // Only show USDF (PYUSD) on testnet and mainnet
    // Note: Only vaultIdentifier provided - EVM address is derived by the bridge
    ...(!isEmulator
      ? [
          {
            symbol: "USDF",
            name: "USDF (PYUSD)",
            vaultIdentifier:
              chainId === "testnet"
                ? "A.dfc20aee650fcbdf.EVMVMBridgedToken_f2e5a325f7d678da511e66b1c0ad7d5ba4df93d3.Vault"
                : "A.1e4aa0b87d10b141.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault",
          },
        ]
      : []),
  ]

  return (
    <DemoCard
      id="connect"
      title="<Connect />"
      description="A ready-to-use wallet connection component with built-in styling and authentication flow."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#connect"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
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
              Authentication
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Built-in wallet flow
            </p>
          </div>

          <div
            className={`relative col-span-2 p-4 rounded-lg border ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
              }`}
          >
            <PlusGridIcon placement="top right" className="absolute" />
            <h4
              className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Multi-Token Cross-VM
            </h4>
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Multi-token support with cross-VM bridge integration. Provide only
              a vaultIdentifier or an erc20Address and the bridge derives the
              other automatically.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className={`relative flex-1 p-8 rounded-lg border flex items-center justify-center
              min-h-[200px] ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
          >
            {isLoading ? (
              <div className="text-center">
                <div
                  className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                    darkMode ? "border-white" : "border-black" }`}
                ></div>
              </div>
            ) : isEmulator ? (
              <div
                className={`text-center py-4 px-6 rounded-lg border ${
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
                  Connect component requires testnet or mainnet
                </p>
              </div>
            ) : (
              <div>
                {showMultiToken ? (
                  <Connect
                    balanceType={balanceType}
                    balanceTokens={multiTokens}
                  />
                ) : (
                  <Connect balanceType={balanceType} />
                )}
              </div>
            )}
          </div>

          {!isEmulator && (
            <div
              className={`w-56 p-4 rounded-lg border space-y-4 ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
            >
              <div>
                <label
                  className={`text-xs font-medium mb-2 block ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  Token Mode
                </label>
                <button
                  onClick={() => setShowMultiToken(!showMultiToken)}
                  className={`w-full text-sm px-3 py-2 rounded-lg transition-colors ${
                  showMultiToken
                      ? darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      : darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                        : "bg-white hover:bg-gray-100 text-black border border-black/10"
                  }`}
                >
                  {showMultiToken ? "Multi-Token" : "Basic"}
                </button>
              </div>

              <div>
                <label
                  className={`text-xs font-medium mb-2 block ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  Balance Type
                </label>
                <div className="space-y-1.5">
                  {(["cadence", "evm", "combined"] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setBalanceType(type)}
                      className={`w-full text-sm px-3 py-2 rounded-lg transition-colors text-left ${
                      balanceType === type
                          ? darkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                          : darkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-white hover:bg-gray-100 text-black border border-black/10"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoCard>
  )
}
