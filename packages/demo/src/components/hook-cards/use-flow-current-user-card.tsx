import {useFlowCurrentUser} from "@onflow/react-sdk"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `import { useFlowCurrentUser } from "@onflow/react-sdk"

const { user, authenticate, unauthenticate } = useFlowCurrentUser()`

export function UseFlowCurrentUserCard() {
  const {darkMode} = useDarkMode()
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()

  return (
    <DemoCard
      id="hook-flow-current-user"
      title="useFlowCurrentUser"
      description="Manage user authentication and access current user information including wallet address and authentication status."
      code={IMPLEMENTATION_CODE}
      docsUrl="https://developers.flow.com/build/tools/react-sdk#useflowcurrentuser"
    >
      <div className="space-y-6">
        <div
          className={`relative p-6 rounded-lg border ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top right" className="absolute" />

          <div className="flex items-start justify-between mb-4">
            <h4
              className={`text-sm font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-600" }`}
            >
              Authentication Status
            </h4>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user?.loggedIn
                  ? "bg-green-500/10 text-green-500"
                  : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-200 text-gray-500"
                }`}
            >
              {user?.loggedIn ? "Connected" : "Not Connected"}
            </span>
          </div>

          {user?.loggedIn ? (
            <div>
              <p
                className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Wallet Address
              </p>
              <p
                className={`font-mono text-sm ${darkMode ? "text-white" : "text-black"}`}
              >
                {user.addr}
              </p>
            </div>
          ) : (
            <div
              className={`text-center py-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-sm">No wallet connected</p>
            </div>
          )}
        </div>

        <div className="flex justify-start">
          {!user?.loggedIn ? (
            <button
              onClick={authenticate}
              className="py-3 px-6 bg-flow-primary text-black rounded-lg font-medium transition-all
                duration-200 hover:bg-flow-primary/80"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={unauthenticate}
              className={`py-3 px-6 rounded-lg font-medium border transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 text-white border-white/10 hover:bg-gray-700"
                  : "bg-white text-black border-black/10 hover:bg-gray-50"
                }`}
            >
              Disconnect
            </button>
          )}
        </div>

        <ResultsSection
          data={user}
          darkMode={darkMode}
          show={!!user?.loggedIn}
          title="Current User Data"
        />
      </div>
    </DemoCard>
  )
}
