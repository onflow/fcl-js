import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {useState} from "react"

const DARK_MODE_CODE = `import { FlowProvider, useDarkMode } from "@onflow/react-sdk"
import { useState } from "react"

function App() {
  const [isDark, setIsDark] = useState(false)

  return (
    <FlowProvider config={...} darkMode={isDark}>
      <DarkModeToggle onToggle={setIsDark} />
      <MyFlowComponents />
    </FlowProvider>
  )
}

function DarkModeToggle({ onToggle }) {
  const { isDark } = useDarkMode()
  
  return (
    <button 
      onClick={() => onToggle(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {isDark ? "🌙" : "☀️"} Toggle Theme
    </button>
  )
}`

export function DarkModeCard() {
  const {darkMode, toggleDarkMode} = useDarkMode()
  const [demoMode, setDemoMode] = useState(darkMode)

  const handleToggle = () => {
    const newMode = !demoMode
    setDemoMode(newMode)
    // Simulate the actual dark mode toggle for demo purposes
    toggleDarkMode()
  }

  return (
    <DemoCard
      id="darkmode"
      title="Dark Mode Control"
      description="Implement dynamic dark mode switching with the Flow React SDK. Control theme state manually and access current mode throughout your application."
      code={DARK_MODE_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk/components#-dark-mode"
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
            Dark Mode Demo
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{darkMode ? "🌙" : "☀️"}</div>
              <div>
                <p
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Current Mode: {darkMode ? "Dark" : "Light"}
                </p>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Click the toggle to switch themes
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode
                    ? "bg-flow-primary focus:ring-flow-primary"
                    : "bg-gray-200 focus:ring-gray-300"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1" }`}
              />
            </button>
          </div>
        </div>
      </div>
    </DemoCard>
  )
}
