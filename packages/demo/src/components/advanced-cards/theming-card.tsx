import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {useState} from "react"
import {FlowProvider} from "@onflow/react-sdk"
import {Connect, TransactionButton} from "@onflow/react-sdk"

const THEMING_CODE = `import { FlowProvider } from "@onflow/react-sdk"

const customTheme = {
  colors: {
    primary: "flow-bg-purple-600",
    primaryForeground: "flow-text-white",
    secondary: "flow-bg-purple-100",
    secondaryForeground: "flow-text-purple-900",
    accent: "flow-bg-purple-700",
    background: "flow-bg-white",
    foreground: "flow-text-purple-900",
    muted: "flow-bg-purple-50",
    mutedForeground: "flow-text-purple-500",
    border: "flow-border-purple-200",
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
      colors: {
        primary: darkMode ? "bg-black" : "bg-gray-900",
        secondary: darkMode ? "bg-gray-700" : "bg-gray-200",
        accent: "bg-flow-primary",
      },
    },
    purple: {
      name: "Purple Theme",
      theme: {
        colors: {
          primary: darkMode ? "flow-bg-purple-400" : "flow-bg-purple-600",
          primaryForeground: "flow-text-white",
          secondary: darkMode ? "flow-bg-purple-900" : "flow-bg-purple-100",
          secondaryForeground: darkMode
            ? "flow-text-purple-100"
            : "flow-text-purple-900",
          accent: darkMode ? "flow-bg-purple-300" : "flow-bg-purple-700",
          background: darkMode ? "flow-bg-purple-950" : "flow-bg-white",
          foreground: darkMode
            ? "flow-text-purple-100"
            : "flow-text-purple-900",
          muted: darkMode ? "flow-bg-purple-800" : "flow-bg-purple-50",
          mutedForeground: darkMode
            ? "flow-text-purple-400"
            : "flow-text-purple-500",
          border: darkMode
            ? "flow-border-purple-700"
            : "flow-border-purple-200",
          link: darkMode ? "flow-text-purple-300" : "flow-text-purple-600",
        },
      },
      colors: {
        primary: darkMode ? "bg-purple-400" : "bg-purple-600",
        secondary: darkMode ? "bg-purple-800" : "bg-purple-100",
        accent: darkMode ? "bg-purple-300" : "bg-purple-700",
      },
    },
    emerald: {
      name: "Emerald Theme",
      theme: {
        colors: {
          primary: darkMode ? "flow-bg-emerald-400" : "flow-bg-emerald-600",
          primaryForeground: "flow-text-white",
          secondary: darkMode ? "flow-bg-emerald-900" : "flow-bg-emerald-100",
          secondaryForeground: darkMode
            ? "flow-text-emerald-100"
            : "flow-text-emerald-900",
          accent: darkMode ? "flow-bg-emerald-300" : "flow-bg-emerald-700",
          background: darkMode ? "flow-bg-emerald-950" : "flow-bg-white",
          foreground: darkMode
            ? "flow-text-emerald-100"
            : "flow-text-emerald-900",
          muted: darkMode ? "flow-bg-emerald-800" : "flow-bg-emerald-50",
          mutedForeground: darkMode
            ? "flow-text-emerald-400"
            : "flow-text-emerald-500",
          border: darkMode
            ? "flow-border-emerald-700"
            : "flow-border-emerald-200",
          link: darkMode ? "flow-text-emerald-300" : "flow-text-emerald-600",
        },
      },
      colors: {
        primary: darkMode ? "bg-emerald-400" : "bg-emerald-600",
        secondary: darkMode ? "bg-emerald-800" : "bg-emerald-100",
        accent: darkMode ? "bg-emerald-300" : "bg-emerald-700",
      },
    },
    rose: {
      name: "Rose Theme",
      theme: {
        colors: {
          primary: darkMode ? "flow-bg-rose-400" : "flow-bg-rose-600",
          primaryForeground: "flow-text-white",
          secondary: darkMode ? "flow-bg-rose-900" : "flow-bg-rose-100",
          secondaryForeground: darkMode
            ? "flow-text-rose-100"
            : "flow-text-rose-900",
          accent: darkMode ? "flow-bg-rose-300" : "flow-bg-rose-700",
          background: darkMode ? "flow-bg-rose-950" : "flow-bg-white",
          foreground: darkMode ? "flow-text-rose-100" : "flow-text-rose-900",
          muted: darkMode ? "flow-bg-rose-800" : "flow-bg-rose-50",
          mutedForeground: darkMode
            ? "flow-text-rose-400"
            : "flow-text-rose-500",
          border: darkMode ? "flow-border-rose-700" : "flow-border-rose-200",
          link: darkMode ? "flow-text-rose-300" : "flow-text-rose-600",
        },
      },
      colors: {
        primary: darkMode ? "bg-rose-400" : "bg-rose-600",
        secondary: darkMode ? "bg-rose-800" : "bg-rose-100",
        accent: darkMode ? "bg-rose-300" : "bg-rose-700",
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
                  className={`w-full h-12 rounded-lg ${currentTheme.colors.primary} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Primary
                </span>
              </div>
              <div className="text-center">
                <div
                  className={`w-full h-12 rounded-lg ${currentTheme.colors.secondary} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Secondary
                </span>
              </div>
              <div className="text-center">
                <div
                  className={`w-full h-12 rounded-lg ${currentTheme.colors.accent} mb-2`}
                />
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Accent
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
