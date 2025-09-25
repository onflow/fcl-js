import {useFlowConfig} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `const { 
  data: config, 
  isLoading 
} = useFlowConfig()`

export function UseFlowConfigCard() {
  const {darkMode} = useDarkMode()
  const config = useFlowConfig()

  return (
    <DemoCard
      id="flow-config"
      title="useFlowConfig"
      description="Access the current Flow configuration including network settings, access node, and wallet discovery."
      code={IMPLEMENTATION_CODE}
    >
      <div className="space-y-6">
        <div
          className={`relative p-6 rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <h4
            className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Flow Configuration
          </h4>

          {config ? (
            <div
              className={`relative rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-white/5"
                  : "bg-white border-black/5"
                }`}
            >
              <div className="p-4 max-h-96 overflow-auto">
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700" }`}
                >
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div
                className={`inline-block animate-spin rounded-full h-6 w-6 border-b-2 mb-3 ${
                  darkMode ? "border-white" : "border-black" }`}
              ></div>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Loading configuration...
              </p>
            </div>
          )}
        </div>

        {config && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
              }`}
            >
              <PlusGridIcon placement="top right" className="absolute" />
              <h5
                className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Network
              </h5>
              <p
                className={`text-sm font-mono ${darkMode ? "text-white" : "text-black"}`}
              >
                {config.flowNetwork || "Not specified"}
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
              <h5
                className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Access Node
              </h5>
              <p
                className={`text-sm font-mono break-all ${darkMode ? "text-white" : "text-black"}`}
              >
                {config["accessNode.api"] || "Not configured"}
              </p>
            </div>
          </div>
        )}

        <ResultsSection
          data={config}
          darkMode={darkMode}
          show={!!config}
          title="Flow Configuration"
        />
      </div>
    </DemoCard>
  )
}
