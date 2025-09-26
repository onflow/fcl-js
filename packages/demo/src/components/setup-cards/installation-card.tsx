import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {useState} from "react"

export function InstallationCard() {
  const {darkMode} = useDarkMode()
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({...prev, [key]: true}))
      setTimeout(() => {
        setCopiedStates(prev => ({...prev, [key]: false}))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <DemoCard
      id="setup-installation"
      title="Installation & Setup"
      description="Get started with the Flow React SDK in three simple steps. Install the package, configure the provider, and start building."
      docsUrl="https://developers.flow.com/build/tools/react-sdk"
    >
      <div className="space-y-8">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                font-bold ${
                darkMode
                    ? "bg-flow-primary text-black"
                    : "bg-flow-primary text-black"
                }`}
            >
              1
            </div>
            <div
              className={`flex-1 w-px mt-2 -mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Install the package
            </h3>
            <div className="relative">
              <div
                className={`relative p-4 rounded-lg border font-mono text-sm flex items-center
                  justify-between ${
                  darkMode
                      ? "bg-gray-900 text-green-400 border-white/10"
                      : "bg-gray-50 text-gray-900 border-black/5"
                  }`}
              >
                <span>npm install @onflow/react-sdk</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      "npm install @onflow/react-sdk",
                      "npm-install"
                    )
                  }
                  className={`ml-4 p-2 rounded transition-colors ${
                    copiedStates["npm-install"]
                      ? darkMode
                        ? "bg-green-800 text-green-400"
                        : "bg-green-100 text-green-600"
                      : darkMode
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  title={
                    copiedStates["npm-install"]
                      ? "Copied!"
                      : "Copy to clipboard"
                  }
                >
                  {copiedStates["npm-install"] ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  darkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                yarn add @onflow/react-sdk
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  darkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                pnpm add @onflow/react-sdk
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                font-bold ${
                darkMode
                    ? "bg-flow-primary text-black"
                    : "bg-flow-primary text-black"
                }`}
            >
              2
            </div>
            <div
              className={`flex-1 w-px mt-2 -mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Configure FlowProvider
            </h3>
            <p
              className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Wrap your application with FlowProvider to enable all React SDK
              features
            </p>

            <div
              className={`relative p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
                }`}
            >
              <PlusGridIcon placement="top left" className="absolute" />
              <button
                onClick={() =>
                  copyToClipboard(
                    `import React from "react"
import { FlowProvider } from "@onflow/react-sdk"
import App from "./App"

function Root() {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://access-mainnet.onflow.org",
        flowNetwork: "mainnet",
        appDetailTitle: "My Flow App",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myapp.com",
      }}
    >
      <App />
    </FlowProvider>
  )
}

export default Root`,
                    "flow-provider"
                  )
                }
                className={`absolute top-4 right-4 p-2 rounded transition-colors ${
                  copiedStates["flow-provider"]
                    ? darkMode
                      ? "bg-green-800 text-green-400"
                      : "bg-green-100 text-green-600"
                    : darkMode
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                title={
                  copiedStates["flow-provider"]
                    ? "Copied!"
                    : "Copy to clipboard"
                }
              >
                {copiedStates["flow-provider"] ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
              <pre
                className={`text-sm overflow-x-auto ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {`import React from "react"
import { FlowProvider } from "@onflow/react-sdk"
import App from "./App"

function Root() {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://access-mainnet.onflow.org",
        flowNetwork: "mainnet",
        appDetailTitle: "My Flow App",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myapp.com",
      }}
    >
      <App />
    </FlowProvider>
  )
}

export default Root`}
              </pre>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded border ${
                  darkMode
                    ? "bg-green-900/20 border-green-800/50"
                    : "bg-green-50 border-green-200"
                  }`}
              >
                <h5
                  className={`text-xs font-medium mb-1 ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  Mainnet
                </h5>
                <div
                  className={`font-mono text-xs ${darkMode ? "text-green-300" : "text-green-700"}`}
                >
                  https://access-mainnet.onflow.org
                </div>
              </div>

              <div
                className={`p-3 rounded border ${
                  darkMode
                    ? "bg-blue-900/20 border-blue-800/50"
                    : "bg-blue-50 border-blue-200"
                  }`}
              >
                <h5
                  className={`text-xs font-medium mb-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Testnet
                </h5>
                <div
                  className={`font-mono text-xs ${darkMode ? "text-blue-300" : "text-blue-700"}`}
                >
                  https://access-testnet.onflow.org
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                font-bold ${
                darkMode
                    ? "bg-flow-primary text-black"
                    : "bg-flow-primary text-black"
                }`}
            >
              3
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Start building
            </h3>
            <p
              className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Import and use components and hooks from the React SDK
            </p>

            <div
              className={`relative p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/50 border-white/10"
                  : "bg-gray-50 border-black/5"
                }`}
            >
              <PlusGridIcon placement="top right" className="absolute" />
              <pre
                className={`text-sm overflow-x-auto ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {`import { Connect, useFlowCurrentUser } from "@onflow/react-sdk"

function MyApp() {
  const { data: user } = useFlowCurrentUser()
  
  return (
    <div>
      <Connect />
      {user && <p>Welcome, {user.addr}!</p>}
    </div>
  )
}`}
              </pre>
            </div>
          </div>
        </div>

        <div
          className={`relative p-4 rounded-lg border ${
            darkMode
              ? "bg-orange-900/20 border-orange-800/50"
              : "bg-orange-50 border-orange-200"
            }`}
        >
          <PlusGridIcon placement="bottom left" className="absolute" />
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
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
            <div>
              <p
                className={`text-sm font-medium mb-1 ${darkMode ? "text-orange-400" : "text-orange-600"}`}
              >
                Important Notes
              </p>
              <ul
                className={`text-sm space-y-1 ${darkMode ? "text-orange-400/80" : "text-orange-600/80"}`}
              >
                <li>
                  • FlowProvider must wrap your entire application at the root
                  level
                </li>
                <li>
                  • For Next.js, place FlowProvider in layout.tsx with "use
                  client" directive
                </li>
                <li>
                  • React 18+ and TypeScript are recommended for best experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoCard>
  )
}
