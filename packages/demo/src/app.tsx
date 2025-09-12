import "./app.css"
import {Container} from "./components/container"
import FlowProviderWrapper, {
  useDarkMode,
} from "./components/flow-provider-wrapper"
import {Navbar} from "./components/navbar"
import {Sidebar} from "./components/sidebar"
import {useEffect} from "react"

function AppContent() {
  const {darkMode} = useDarkMode()

  // Apply dark class to document element for scrollbar styling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black" }`}
    >
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main
          id="main-content"
          className={`flex-1 overflow-y-auto p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
          style={{height: "calc(100vh - 88px)"}}
        >
          <Container />
        </main>
      </div>
    </div>
  )
}

export function App() {
  return (
    <FlowProviderWrapper>
      <AppContent />
    </FlowProviderWrapper>
  )
}
