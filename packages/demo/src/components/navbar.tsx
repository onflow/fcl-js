import {useFlowCurrentUser, useFlowConfig} from "@onflow/react-sdk"
import {useDarkMode} from "./flow-provider-wrapper"

export function Navbar() {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const config = useFlowConfig()
  const {darkMode, toggleDarkMode} = useDarkMode()
  const currentNetwork = config.flowNetwork || "emulator"

  return (
    <nav
      className={`flex justify-between items-center p-4 sm:p-8 border-l border-r border-b
        rounded-b-xl mb-0 ${
        darkMode
            ? "bg-gray-900 border-l-gray-700 border-r-gray-700 border-b-gray-700"
            : "bg-white border-l-gray-200 border-r-gray-200 border-b-gray-200"
        }`}
    >
      <div
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        FCL Demo
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md transition-all duration-200 ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
            </svg>
          )}
        </button>
        <div
          className={`text-sm font-medium px-4 py-2 rounded border border-[#FFB800] flex items-center
            gap-2 ${darkMode ? "bg-gray-800 text-white" : "bg-[#fff8e1] text-black"}`}
        >
          <div
            className={` w-2 h-2 rounded-full ${
              currentNetwork === "mainnet"
                ? "bg-[#00EF8B]"
                : currentNetwork === "testnet"
                  ? "bg-[#FFB800]"
                  : "bg-[#9945FF]"
              } `}
          />
          <span>
            Network:{" "}
            <strong className={darkMode ? "text-white" : "text-black"}>
              {currentNetwork}
            </strong>
          </span>
        </div>

        {!user?.loggedIn && (
          <button
            onClick={authenticate}
            className="py-2 px-6 bg-[#00EF8B] text-black border-none rounded-md cursor-pointer
              font-semibold text-base transition-all duration-200 ease-in-out
              hover:bg-[#00d178]"
          >
            Log In With Wallet
          </button>
        )}
        {user?.loggedIn && (
          <>
            <span
              className={`text-sm font-medium px-4 py-2 rounded border border-[#00EF8B] ${
              darkMode ? "bg-gray-800 text-white" : "bg-[#f8f9fa] text-black" }`}
            >
              {user?.addr}
            </span>
            <button
              onClick={unauthenticate}
              className={`py-2 px-6 border-none rounded-md cursor-pointer font-semibold text-base
              transition-all duration-200 ease-in-out ${
              darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
