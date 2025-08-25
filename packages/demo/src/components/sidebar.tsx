import {useDarkMode} from "./flow-provider-wrapper"

interface SidebarItem {
  id: string
  label: string
  category: "hooks" | "components"
}

const sidebarItems: SidebarItem[] = [
  // Hooks section
  {id: "flow-current-user", label: "Current User", category: "hooks"},
  {id: "flow-account", label: "Account", category: "hooks"},
  {id: "flow-block", label: "Block", category: "hooks"},
  {id: "flow-chain-id", label: "Chain ID", category: "hooks"},
  {id: "flow-config", label: "Config", category: "hooks"},
  {id: "flow-query", label: "Query", category: "hooks"},
  {id: "flow-query-raw", label: "Query Raw", category: "hooks"},
  {id: "flow-mutate", label: "Mutate", category: "hooks"},
  {id: "flow-nft", label: "NFT", category: "hooks"},
  {id: "flow-revertible-random", label: "Revertible Random", category: "hooks"},
  {
    id: "flow-transaction-status",
    label: "Transaction Status",
    category: "hooks",
  },

  // Components section
  {id: "kit-connect", label: "Connect Kit", category: "components"},
  {
    id: "kit-transaction-button",
    label: "Transaction Button",
    category: "components",
  },
  {
    id: "kit-transaction-dialog",
    label: "Transaction Dialog",
    category: "components",
  },
  {
    id: "kit-transaction-link",
    label: "Transaction Link",
    category: "components",
  },
]

const scrollToElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }
}

export function Sidebar() {
  const {darkMode} = useDarkMode()

  const hooksItems = sidebarItems.filter(item => item.category === "hooks")
  const componentsItems = sidebarItems.filter(
    item => item.category === "components"
  )

  return (
    <aside
      className={`w-64 flex-shrink-0 border-r overflow-y-auto ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200" }`}
      style={{height: "calc(100vh - 88px)"}}
    >
      <div className="p-4">
        <nav className="space-y-6">
          {/* Hooks Section */}
          <div>
            <h3
              className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Hooks
            </h3>
            <ul className="space-y-1">
              {hooksItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToElement(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Components Section */}
          <div>
            <h3
              className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Components
            </h3>
            <ul className="space-y-1">
              {componentsItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToElement(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}
