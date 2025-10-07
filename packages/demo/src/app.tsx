import {useEffect, useState} from "react"
import "./app.css"
import {ContentSection} from "./components/content-section"
import {ContentSidebar} from "./components/content-sidebar"
import FlowProviderWrapper from "./components/flow-provider-wrapper"
import {Footer} from "./components/footer"
import {Header} from "./components/header"

function AppContent() {
  // Move dark mode state outside FlowProvider to prevent sidebar reset on network change
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(newValue))
      }
      return newValue
    })
  }

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileSidebarOpen])

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
        <Header
          onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        <div className="relative">
          {mobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <div
            className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform
              duration-300 ease-in-out lg:hidden ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full" }
              ${darkMode ? "bg-gray-900 border-r border-white/10" : "bg-white border-r border-black/5"}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between gap-3 p-6 pb-4 border-b border-current/10">
                <h2
                  className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Menu
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    aria-label={
                      darkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {darkMode ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    aria-label="Close menu"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
                <ContentSidebar
                  darkMode={darkMode}
                  onItemClick={() => setMobileSidebarOpen(false)}
                />
              </div>
            </div>
          </div>

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

            <div className="relative flex-1 min-w-0 overflow-x-hidden">
              <div className="p-4 lg:p-6 max-w-full">
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
