import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {useState} from "react"
import {FlowProvider} from "@onflow/react-sdk"
import {Connect, TransactionButton} from "@onflow/react-sdk"

const THEMING_CODE = `import { FlowProvider } from "@onflow/react-sdk"

const customTheme = {
  colors: {
    primary: {
      base: "flow-bg-purple-600 dark:flow-bg-purple-400",
      text: "flow-text-white dark:flow-text-purple-900",
      hover: "hover:flow-bg-purple-700 dark:hover:flow-bg-purple-300",
      muted: "flow-bg-purple-100 dark:flow-bg-purple-900",
      mutedText: "flow-text-purple-900 dark:flow-text-purple-100",
      mutedHover: "hover:flow-bg-purple-200 dark:hover:flow-bg-purple-800",
      border: "flow-border-purple-200 dark:flow-border-purple-700",
    },
    secondary: { /* ... */ },
    tertiary: { /* ... */ },
  }
}

function App() {
  return (
    <FlowProvider 
      config={...} 
      theme={customTheme}
      colorMode="system"
    >
      <CustomThemedComponents />
    </FlowProvider>
  )
}`

export function ThemingCard() {
  const {darkMode} = useDarkMode()
  const [selectedTheme, setSelectedTheme] = useState("default")

  const themes = {
    default: {
      name: "Flow Default",
      theme: null,
      swatches: {
        primary: darkMode ? "bg-slate-100" : "bg-slate-900",
        secondary: darkMode ? "bg-slate-400" : "bg-slate-600",
        tertiary: darkMode ? "bg-slate-600" : "bg-slate-400",
      },
    },
    purple: {
      name: "Purple Theme",
      theme: {
        colors: {
          primary: {
            base: darkMode ? "flow-bg-purple-400" : "flow-bg-purple-600",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-purple-300"
              : "hover:flow-bg-purple-700",
            muted: darkMode ? "flow-bg-purple-900" : "flow-bg-purple-100",
            mutedText: darkMode
              ? "flow-text-purple-100"
              : "flow-text-purple-900",
            mutedHover: darkMode
              ? "hover:flow-bg-purple-800"
              : "hover:flow-bg-purple-200",
            border: darkMode
              ? "flow-border-purple-700"
              : "flow-border-purple-200",
          },
          secondary: {
            base: darkMode ? "flow-bg-purple-300" : "flow-bg-purple-500",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-purple-200"
              : "hover:flow-bg-purple-600",
            muted: darkMode ? "flow-bg-purple-800" : "flow-bg-purple-50",
            mutedText: darkMode
              ? "flow-text-purple-200"
              : "flow-text-purple-700",
            mutedHover: darkMode
              ? "hover:flow-bg-purple-700"
              : "hover:flow-bg-purple-100",
            border: darkMode
              ? "flow-border-purple-600"
              : "flow-border-purple-300",
          },
          tertiary: {
            base: darkMode ? "flow-bg-purple-200" : "flow-bg-purple-400",
            text: darkMode ? "flow-text-purple-900" : "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-purple-100"
              : "hover:flow-bg-purple-500",
            muted: darkMode ? "flow-bg-purple-700" : "flow-bg-purple-50",
            mutedText: darkMode
              ? "flow-text-purple-300"
              : "flow-text-purple-600",
            mutedHover: darkMode
              ? "hover:flow-bg-purple-600"
              : "hover:flow-bg-purple-100",
            border: darkMode
              ? "flow-border-purple-500"
              : "flow-border-purple-400",
          },
        },
      },
      swatches: {
        primary: darkMode ? "bg-purple-400" : "bg-purple-600",
        secondary: darkMode ? "bg-purple-300" : "bg-purple-500",
        tertiary: darkMode ? "bg-purple-200" : "bg-purple-400",
      },
    },
    emerald: {
      name: "Emerald Theme",
      theme: {
        colors: {
          primary: {
            base: darkMode ? "flow-bg-emerald-400" : "flow-bg-emerald-600",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-emerald-300"
              : "hover:flow-bg-emerald-700",
            muted: darkMode ? "flow-bg-emerald-900" : "flow-bg-emerald-100",
            mutedText: darkMode
              ? "flow-text-emerald-100"
              : "flow-text-emerald-900",
            mutedHover: darkMode
              ? "hover:flow-bg-emerald-800"
              : "hover:flow-bg-emerald-200",
            border: darkMode
              ? "flow-border-emerald-700"
              : "flow-border-emerald-200",
          },
          secondary: {
            base: darkMode ? "flow-bg-emerald-300" : "flow-bg-emerald-500",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-emerald-200"
              : "hover:flow-bg-emerald-600",
            muted: darkMode ? "flow-bg-emerald-800" : "flow-bg-emerald-50",
            mutedText: darkMode
              ? "flow-text-emerald-200"
              : "flow-text-emerald-700",
            mutedHover: darkMode
              ? "hover:flow-bg-emerald-700"
              : "hover:flow-bg-emerald-100",
            border: darkMode
              ? "flow-border-emerald-600"
              : "flow-border-emerald-300",
          },
          tertiary: {
            base: darkMode ? "flow-bg-emerald-200" : "flow-bg-emerald-400",
            text: darkMode ? "flow-text-emerald-900" : "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-emerald-100"
              : "hover:flow-bg-emerald-500",
            muted: darkMode ? "flow-bg-emerald-700" : "flow-bg-emerald-50",
            mutedText: darkMode
              ? "flow-text-emerald-300"
              : "flow-text-emerald-600",
            mutedHover: darkMode
              ? "hover:flow-bg-emerald-600"
              : "hover:flow-bg-emerald-100",
            border: darkMode
              ? "flow-border-emerald-500"
              : "flow-border-emerald-400",
          },
        },
      },
      swatches: {
        primary: darkMode ? "bg-emerald-400" : "bg-emerald-600",
        secondary: darkMode ? "bg-emerald-300" : "bg-emerald-500",
        tertiary: darkMode ? "bg-emerald-200" : "bg-emerald-400",
      },
    },
    rose: {
      name: "Rose Theme",
      theme: {
        colors: {
          primary: {
            base: darkMode ? "flow-bg-rose-400" : "flow-bg-rose-600",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-rose-300"
              : "hover:flow-bg-rose-700",
            muted: darkMode ? "flow-bg-rose-900" : "flow-bg-rose-100",
            mutedText: darkMode ? "flow-text-rose-100" : "flow-text-rose-900",
            mutedHover: darkMode
              ? "hover:flow-bg-rose-800"
              : "hover:flow-bg-rose-200",
            border: darkMode ? "flow-border-rose-700" : "flow-border-rose-200",
          },
          secondary: {
            base: darkMode ? "flow-bg-rose-300" : "flow-bg-rose-500",
            text: "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-rose-200"
              : "hover:flow-bg-rose-600",
            muted: darkMode ? "flow-bg-rose-800" : "flow-bg-rose-50",
            mutedText: darkMode ? "flow-text-rose-200" : "flow-text-rose-700",
            mutedHover: darkMode
              ? "hover:flow-bg-rose-700"
              : "hover:flow-bg-rose-100",
            border: darkMode ? "flow-border-rose-600" : "flow-border-rose-300",
          },
          tertiary: {
            base: darkMode ? "flow-bg-rose-200" : "flow-bg-rose-400",
            text: darkMode ? "flow-text-rose-900" : "flow-text-white",
            hover: darkMode
              ? "hover:flow-bg-rose-100"
              : "hover:flow-bg-rose-500",
            muted: darkMode ? "flow-bg-rose-700" : "flow-bg-rose-50",
            mutedText: darkMode ? "flow-text-rose-300" : "flow-text-rose-600",
            mutedHover: darkMode
              ? "hover:flow-bg-rose-600"
              : "hover:flow-bg-rose-100",
            border: darkMode ? "flow-border-rose-500" : "flow-border-rose-400",
          },
        },
      },
      swatches: {
        primary: darkMode ? "bg-rose-400" : "bg-rose-600",
        secondary: darkMode ? "bg-rose-300" : "bg-rose-500",
        tertiary: darkMode ? "bg-rose-200" : "bg-rose-400",
      },
    },
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]

  return (
    <DemoCard
      id="theming"
      title="Custom Theming"
      description="Customize the appearance of Flow React SDK components with custom themes. Override colors, styles, and create consistent branding across your application."
      code={THEMING_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#-theming"
    >
      <div className="space-y-6">
        <div
          className={`relative p-6 rounded-lg border ${
            darkMode
              ? "bg-gray-800/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <h4
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Theme Customization Demo
          </h4>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Select Theme:
              </label>
              <select
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-white/10 text-white"
                    : "bg-white border-black/10 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-flow-primary`}
              >
                {Object.entries(themes).map(([key, theme]) => (
                  <option key={key} value={key}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div
                  className={`w-full h-12 rounded-lg ${currentTheme.swatches.primary} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Primary
                </span>
              </div>
              <div className="text-center">
                <div
                  className={`w-full h-12 rounded-lg ${currentTheme.swatches.secondary} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Secondary
                </span>
              </div>
              <div className="text-center">
                <div
                  className={`w-full h-12 rounded-lg ${currentTheme.swatches.tertiary} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Tertiary
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-900/30 border-white/5"
                  : "bg-white border-black/5"
                }`}
            >
              <p
                className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Live Flow Components Preview:
              </p>
              <FlowProvider
                config={{
                  accessNodeUrl: "https://rest-mainnet.onflow.org",
                  flowNetwork: "mainnet",
                  appDetailTitle: "Theme Demo",
                  appDetailIcon: "",
                  appDetailDescription: "Testing custom themes",
                  appDetailUrl: "",
                }}
                colorMode={darkMode ? "dark" : "light"}
                theme={currentTheme.theme}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Connect />
                  <TransactionButton
                    label="Demo Transaction"
                    transaction={{
                      cadence: `
                        transaction(greeting: String) {
                          prepare(signer: &Account) {
                            log(greeting)
                          }
                        }
                      `,
                      args: (arg, t) => [
                        arg("Hello from themed component!", t.String),
                      ],
                      limit: 999,
                    }}
                    mutation={{
                      onSuccess: data => {
                        console.log("Themed transaction succeeded:", data)
                      },
                      onError: error => {
                        console.error("Themed transaction failed:", error)
                      },
                    }}
                  />
                </div>
              </FlowProvider>
            </div>
          </div>
        </div>

        <div
          className={`relative p-4 rounded-lg border ${
            darkMode
              ? "bg-green-900/20 border-green-800/50"
              : "bg-green-50 border-green-200"
            }`}
        >
          <PlusGridIcon placement="top right" className="absolute" />
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              />
            </svg>
            <div>
              <p
                className={`text-sm font-medium mb-1 ${darkMode ? "text-green-400" : "text-green-600"}`}
              >
                Theming Features
              </p>
              <ul
                className={`text-sm space-y-1 ${darkMode ? "text-green-400/80" : "text-green-600/80"}`}
              >
                <li>• Custom color palettes and branding</li>
                <li>• Tailwind CSS utility class overrides</li>
                <li>• Light and dark theme variants</li>
                <li>• Consistent styling across components</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoCard>
  )
}
