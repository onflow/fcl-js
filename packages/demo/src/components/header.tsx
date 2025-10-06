import {Connect, useFlowChainId, type FlowNetwork} from "@onflow/react-sdk"
import {useDarkMode, useNetworkSwitch} from "./flow-provider-wrapper"
import {useState, useRef, useEffect} from "react"

export function Header() {
  const {darkMode, toggleDarkMode} = useDarkMode()
  const {currentNetwork, switchNetwork, isNetworkSwitching} = useNetworkSwitch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false)
  const networkMenuRef = useRef<HTMLDivElement>(null)
  const {data: chainId, isLoading: isChainIdLoading} = useFlowChainId()

  const getNetworkInfo = (network?: FlowNetwork) => {
    const targetNetwork = network || currentNetwork
    if (isChainIdLoading && !network) return {name: "...", color: "gray"}

    switch (targetNetwork) {
      case "mainnet":
        return {name: "Mainnet", color: "green"}
      case "testnet":
        return {name: "Testnet", color: "blue"}
      case "emulator":
        return {name: "Emulator", color: "orange"}
      default:
        return {name: "Unknown", color: "gray"}
    }
  }

  const networkInfo = getNetworkInfo()
  // Only allow switching to emulator if app was started with emulator configuration
  const startedWithEmulator =
    (import.meta.env.VITE_FLOW_NETWORK as FlowNetwork) === "emulator"
  const networks: FlowNetwork[] = startedWithEmulator
    ? ["mainnet", "testnet", "emulator"]
    : ["mainnet", "testnet"]

  const handleNetworkSwitch = async (network: FlowNetwork) => {
    if (network !== currentNetwork && !isNetworkSwitching) {
      setNetworkMenuOpen(false)
      await switchNetwork(network)
    }
  }

  // Close network menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        networkMenuRef.current &&
        !networkMenuRef.current.contains(event.target as Node)
      ) {
        setNetworkMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={`relative border-b transition-colors duration-200 ${
        darkMode ? "bg-gray-900 border-white/10" : "bg-white border-black/5" }`}
      role="banner"
    >
      <div className="flex items-center justify-between h-16 px-6">
        <a
          href="/"
          className="flex items-center space-x-4 group transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/icon.png"
            alt="Flow"
            className="w-8 h-8 rounded-lg"
          />

          <div className="flex flex-col">
            <span
              className={`text-sm font-medium tracking-wide ${
                darkMode ? "text-gray-400" : "text-gray-600" }`}
            >
              Flow
            </span>
            <h1
              className={`text-lg font-black tracking-tight -mt-1 font-mono ${
                darkMode ? "text-white" : "text-black" }`}
            >
              React SDK
            </h1>
          </div>
        </a>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative" ref={networkMenuRef}>
            <button
              onClick={() => setNetworkMenuOpen(!networkMenuOpen)}
              disabled={isNetworkSwitching}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm font-medium
                transition-colors duration-200 hover:shadow-sm ${
                networkInfo.color === "green"
                    ? darkMode
                      ? "bg-green-900/20 border-green-800/50 text-green-400 hover:bg-green-900/30"
                      : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : networkInfo.color === "blue"
                      ? darkMode
                        ? "bg-blue-900/20 border-blue-800/50 text-blue-400 hover:bg-blue-900/30"
                        : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      : networkInfo.color === "orange"
                        ? darkMode
                          ? "bg-orange-900/20 border-orange-800/50 text-orange-400 hover:bg-orange-900/30"
                          : "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                        : darkMode
                          ? "bg-gray-900/50 border-white/10 text-gray-400 hover:bg-gray-900/70"
                          : "bg-gray-50 border-black/5 text-gray-600 hover:bg-gray-100"
                } ${isNetworkSwitching ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isNetworkSwitching ? (
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
              ) : (
                <div
                  className={`w-2 h-2 rounded-full ${
                    networkInfo.color === "green"
                      ? "bg-green-500"
                      : networkInfo.color === "blue"
                        ? "bg-blue-500"
                        : networkInfo.color === "orange"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                    }`}
                />
              )}
              <span>
                {isNetworkSwitching ? "Switching..." : networkInfo.name}
              </span>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${ networkMenuOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {networkMenuOpen && (
              <div
                className={`absolute top-full left-0 mt-2 py-1 rounded-lg border shadow-lg z-50
                min-w-[140px] ${
                darkMode
                    ? "bg-gray-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                {networks.map(network => {
                  const info = getNetworkInfo(network)
                  const isActive = network === currentNetwork

                  return (
                    <button
                      key={network}
                      onClick={() => handleNetworkSwitch(network)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors
                      duration-200 ${
                      isActive
                          ? darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-50 text-black"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                        info.color === "green"
                            ? "bg-green-500"
                            : info.color === "blue"
                              ? "bg-blue-500"
                              : info.color === "orange"
                                ? "bg-orange-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <span className="font-medium">{info.name}</span>
                      {isActive && (
                        <svg
                          className="w-3 h-3 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 border rounded-lg transition-colors duration-200 ${
              darkMode
                ? `text-gray-400 hover:text-white border-white/10 hover:border-white/20
                  bg-gray-800/50`
                : `text-gray-600 hover:text-gray-900 border-black/5 hover:border-black/10
                  bg-gray-50/50`
              }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                width="16"
                height="16"
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
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <a
            href="https://github.com/onflow/fcl-js/tree/master/packages/react-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className={`relative p-2 border rounded-lg transition-colors duration-200 ${
              darkMode
                ? `text-gray-400 hover:text-white border-white/10 hover:border-white/20
                  bg-gray-800/50`
                : `text-gray-600 hover:text-gray-900 border-black/5 hover:border-black/10
                  bg-gray-50/50`
              }`}
            title="View on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <button
            onClick={toggleDarkMode}
            className={`relative p-2 border rounded-lg transition-colors duration-200 ${
              darkMode
                ? `text-yellow-400 hover:text-yellow-300 border-white/10 hover:border-white/20
                  bg-gray-800/50`
                : `text-gray-600 hover:text-gray-900 border-black/5 hover:border-black/10
                  bg-gray-50/50`
              }`}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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

          <div className="ml-4">
            <Connect variant="primary" />
          </div>
        </div>
      </div>
    </header>
  )
}
