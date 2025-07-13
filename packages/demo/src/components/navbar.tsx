import {useFlowCurrentUser, useFlowConfig} from "@onflow/kit"

export function Navbar() {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  return (
    <nav
      className="flex justify-between items-center p-4 sm:p-8 bg-white border-l border-r border-b
        border-l-gray-200 border-r-gray-200 border-b-gray-200 rounded-b-xl mb-0"
    >
      <div className="text-2xl font-bold text-black">FCL Demo</div>
      <div className="flex items-center gap-4">
        <div
          className="text-sm text-black font-medium px-4 py-2 bg-[#fff8e1] rounded border
            border-[#FFB800] flex items-center gap-2"
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
            Network: <strong className="text-black">{currentNetwork}</strong>
          </span>
        </div>

        {!user?.loggedIn && (
          <button
            onClick={authenticate}
            className="py-2 px-6 bg-[#00EF8B] text-black border-none rounded-md cursor-pointer
              font-semibold text-base transition-all duration-200 ease-in-out"
          >
            Log In With Wallet
          </button>
        )}
        {user?.loggedIn && (
          <>
            <span
              className="text-sm text-black font-medium px-4 py-2 bg-[#f8f9fa] rounded border
                border-[#00EF8B]"
            >
              {user?.addr}
            </span>
            <button
              onClick={unauthenticate}
              className="py-2 px-6 bg-black text-white border-none rounded-md cursor-pointer
                font-semibold text-base transition-all duration-200 ease-in-out"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
