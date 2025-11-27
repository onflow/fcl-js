import {useState} from "react"
import {Fund, useFlowChainId} from "@onflow/react-sdk"
import {useDarkMode} from "../flow-provider-wrapper"
import {DemoCard, type PropDefinition} from "../ui/demo-card"
import {PlusGridIcon} from "../ui/plus-grid"

const IMPLEMENTATION_CODE = `import { Fund } from "@onflow/react-sdk"

// Basic usage - opens modal with funding options
<Fund />

// With custom variant
<Fund variant="secondary" />`

const PROPS: PropDefinition[] = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "outline" | "link"',
    required: false,
    description: "The visual style variant of the fund button",
    defaultValue: '"primary"',
  },
]

export function FundCard() {
  const {darkMode} = useDarkMode()
  const {data: chainId, isLoading} = useFlowChainId()
  const [variant, setVariant] = useState<
    "primary" | "secondary" | "outline" | "link"
  >("primary")

  return (
    <DemoCard
      id="fund"
      title="<Fund />"
      description="The Fund Account component provides users with a simple, unified way to bring liquidity into the Flow ecosystem, supporting both Flow EVM and Cadence accounts. It streamlines the process of funding a user wallet by offering two clear on-ramps."
      code={IMPLEMENTATION_CODE}
      props={PROPS}
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
              Unified Interface
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Single component for all funding
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
              Cross-VM Support
            </h4>
            <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
              Flow EVM & Cadence accounts
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
              Streamlined Flow
            </h4>
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Simple on-ramp experience
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className={`relative flex-1 rounded-lg border flex items-center justify-center ${
              darkMode
                ? "bg-gray-900/50 border-white/10"
                : "bg-gray-50 border-black/5"
            }`}
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div
                  className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                    darkMode ? "border-white" : "border-black"
                  }`}
                ></div>
              </div>
            ) : (
              <div className="w-full p-6 flex items-center justify-center">
                <Fund variant={variant} />
              </div>
            )}
          </div>

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
                Variant
              </label>
              <div className="space-y-1.5">
                {(["primary", "secondary", "outline", "link"] as const).map(
                  variantOption => (
                    <button
                      key={variantOption}
                      onClick={() => setVariant(variantOption)}
                      className={`w-full text-sm px-3 py-2 rounded-lg transition-colors text-left ${
                        variant === variantOption
                          ? darkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                          : darkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-white hover:bg-gray-100 text-black border border-black/10"
                      }`}
                    >
                      {variantOption.charAt(0).toUpperCase() +
                        variantOption.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoCard>
  )
}
