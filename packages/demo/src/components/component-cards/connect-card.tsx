import {Connect, useFlowChainId, useFlowCurrentUser} from "@onflow/react-sdk"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { Connect } from "@onflow/react-sdk"

<Connect />`

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
    type: '"cadence" | "evm" | "vault"',
    required: false,
    description: "Type of balance to display (from cross-VM token balance)",
    defaultValue: '"cadence"',
  },
]

export function ConnectCard() {
  const {darkMode} = useDarkMode()
  const {data: chainId, isLoading} = useFlowChainId()
  const {user: currentUser} = useFlowCurrentUser()
  const isEmulator = chainId === "emulator" || chainId === "local"

  return (
    <DemoCard
      id="kit-connect"
      title="Connect"
      description="A ready-to-use wallet connection component with built-in styling and authentication flow."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#connect"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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
              Customizable
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Style variants
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
            <div className="flex justify-center">
              <Connect />
            </div>
          )}
        </div>
      </div>
    </DemoCard>
  )
}
