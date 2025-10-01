import "./app.css"
import FlowProviderWrapper, {
  useDarkMode,
} from "./components/flow-provider-wrapper"
import {Header} from "./components/header"
import {ContentSidebar} from "./components/content-sidebar"
import {ContentSection} from "./components/content-section"
import {Footer} from "./components/footer"
import {useState} from "react"

function AppContent() {
  // Move dark mode state outside FlowProvider to prevent sidebar reset on network change
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(newValue))
      }
      return newValue
    })
  }

  return (
    <div
      className={`font-flow transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900" }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2
          bg-flow-primary text-black rounded-lg font-medium transition-all"
      >
        Skip to main content
      </a>

      <FlowProviderWrapper darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Header />

        <div className="relative">
          <div className="flex min-h-screen">
            <div className="relative w-80 flex-shrink-0 hidden lg:block">
              <svg
                viewBox="0 0 15 15"
                className={`absolute -top-2 -right-2 size-[15px] z-10 ${
                  darkMode ? "fill-white/20" : "fill-black/10" }`}
              >
                <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
              </svg>

              <div className="sticky top-0 h-screen overflow-y-auto p-6 scrollbar-hide">
                <ContentSidebar darkMode={darkMode} />
              </div>
            </div>

            <div className="relative flex-1">
              <svg
                viewBox="0 0 15 15"
                className={`absolute -top-2 -left-2 size-[15px] z-10 ${
                  darkMode ? "fill-white/20" : "fill-black/10" }`}
              >
                <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
              </svg>

              <div className="p-4 lg:p-6">
                <main id="main-content" role="main" aria-label="Main content">
                  <ContentSection />
                </main>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </FlowProviderWrapper>
    </div>
  )
}

export function App() {
  return <AppContent />
}
