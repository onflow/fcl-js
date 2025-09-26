import {useState, useEffect} from "react"
import {PlusGridIcon} from "./ui/plus-grid"

interface SidebarItem {
  id: string
  label: string
  category: "hooks" | "components"
  description: string
}

const sidebarItems: SidebarItem[] = [
  // Components section
  {
    id: "component-connect",
    label: "Connect",
    category: "components",
    description: "Wallet connection component",
  },
  {
    id: "component-transaction-button",
    label: "Transaction Button",
    category: "components",
    description: "Transaction execution button",
  },
  {
    id: "component-transaction-dialog",
    label: "Transaction Dialog",
    category: "components",
    description: "Transaction confirmation dialog",
  },
  {
    id: "component-transaction-link",
    label: "Transaction Link",
    category: "components",
    description: "Transaction link component",
  },

  // Hooks section
  {
    id: "hook-flow-current-user",
    label: "Current User",
    category: "hooks",
    description: "Manage user authentication",
  },
  {
    id: "hook-flow-account",
    label: "Account",
    category: "hooks",
    description: "Fetch account information",
  },
  {
    id: "hook-flow-block",
    label: "Block",
    category: "hooks",
    description: "Get blockchain block data",
  },
  {
    id: "hook-flow-chain-id",
    label: "Chain ID",
    category: "hooks",
    description: "Get current chain ID",
  },
  {
    id: "hook-flow-config",
    label: "Config",
    category: "hooks",
    description: "Access Flow configuration",
  },
  {
    id: "hook-flow-query",
    label: "Query",
    category: "hooks",
    description: "Execute Flow scripts",
  },
  {
    id: "hook-flow-query-raw",
    label: "Query Raw",
    category: "hooks",
    description: "Execute raw Flow scripts",
  },
  {
    id: "hook-flow-mutate",
    label: "Mutate",
    category: "hooks",
    description: "Send Flow transactions",
  },
  {
    id: "hook-flow-events",
    label: "Events",
    category: "hooks",
    description: "Listen to blockchain events",
  },
  {
    id: "hook-flow-revertible-random",
    label: "Revertible Random",
    category: "hooks",
    description: "Generate random numbers",
  },
  {
    id: "hook-flow-transaction-status",
    label: "Transaction Status",
    category: "hooks",
    description: "Track transaction status",
  },
]

const scrollToElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    // Get the header height to account for sticky header offset
    const headerHeight = 80 // Approximate header height + padding
    const elementRect = element.getBoundingClientRect()
    const absoluteElementTop = elementRect.top + window.pageYOffset
    const scrollPosition = absoluteElementTop - headerHeight

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    })
  }
}

export function ContentSidebar({darkMode}: {darkMode: boolean}) {
  const [activeSection, setActiveSection] = useState<string>("")

  const hooksItems = sidebarItems.filter(item => item.category === "hooks")
  const componentsItems = sidebarItems.filter(
    item => item.category === "components"
  )

  // Track which section is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Find the entry with the highest intersection ratio that's actually visible
        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio and pick the most visible one
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )
          setActiveSection(mostVisible.target.id)
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: "-80px 0px -40% 0px", // Account for header height and give more weight to top sections
      }
    )

    sidebarItems.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const SidebarSection = ({
    title,
    items,
    icon,
  }: {
    title: string
    items: SidebarItem[]
    icon: React.ReactNode
  }) => (
    <div className="relative">
      <div className="relative mb-4">
        <PlusGridIcon placement="top left" className="absolute" />
        <PlusGridIcon placement="top right" className="absolute" />
        <div
          className={`flex items-center space-x-3 p-3 border rounded-lg ${
            darkMode
              ? "border-white/10 bg-gray-800/30"
              : "border-black/5 bg-gray-50/30"
            }`}
        >
          <div
            className={`p-1.5 rounded ${darkMode ? "bg-gray-700" : "bg-white"}`}
          >
            {icon}
          </div>
          <h3
            className={`text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-gray-200" : "text-gray-700" }`}
          >
            {title}
          </h3>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map(item => {
          const isActive = activeSection === item.id
          return (
            <li key={item.id} className="relative">
              <button
                onClick={() => scrollToElement(item.id)}
                aria-label={`Navigate to ${item.label} section`}
                className={`w-full text-left px-4 py-3 border text-sm transition-all duration-200 group
                focus:outline-none focus:ring-2 focus:ring-flow-primary/50 ${
                isActive
                    ? darkMode
                      ? "bg-flow-primary/10 text-flow-primary border border-flow-primary/20 shadow-sm"
                      : "bg-flow-primary/10 text-flow-600 border border-flow-primary/20 shadow-sm"
                    : darkMode
                      ? `text-gray-300 hover:text-white hover:bg-gray-700/30 border-transparent
                        hover:border-white/10`
                      : `text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent
                        hover:border-black/5`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-flow-primary animate-pulse"></div>
                  )}
                </div>
                <div
                  className={`text-xs leading-relaxed ${
                  isActive
                      ? darkMode
                        ? "text-flow-primary/80"
                        : "text-flow-600/80"
                      : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                >
                  {item.description}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <nav
      className={`relative w-full h-full border rounded-xl ${
        darkMode
          ? "bg-gray-800/30 border-white/10"
          : "bg-gray-50/50 border-black/5"
        } p-6 space-y-6 overflow-y-auto scrollbar-hide`}
      role="navigation"
      aria-label="Table of contents"
    >
      <svg
        viewBox="0 0 15 15"
        className={`absolute -top-2 -left-2 size-[15px] z-10 ${
          darkMode ? "fill-white/20" : "fill-black/10" }`}
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>
      <svg
        viewBox="0 0 15 15"
        className={`absolute -bottom-2 -left-2 size-[15px] z-10 ${
          darkMode ? "fill-white/20" : "fill-black/10" }`}
      >
        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
      </svg>
      <SidebarSection
        title="Components"
        items={componentsItems}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="2" width="8" height="8" rx="1" />
            <rect x="14" y="2" width="8" height="8" rx="1" />
            <rect x="2" y="14" width="8" height="8" rx="1" />
            <rect x="14" y="14" width="8" height="8" rx="1" />
          </svg>
        }
      />

      <SidebarSection
        title="Hooks"
        items={hooksItems}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v6" strokeLinecap="round" />
            <path
              d="M12 8a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6"
              strokeLinecap="round"
            />
            <path d="M6 14a2 2 0 0 0 2 2 2 2 0 0 0 2-2" strokeLinecap="round" />
          </svg>
        }
      />

      <div className="pt-8 border-t border-gray-200/20">
        <h4
          className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            darkMode ? "text-gray-400" : "text-gray-500" }`}
        >
          Quick Links
        </h4>
        <div className="space-y-2">
          <a
            href="https://developers.flow.com/tools/fcl-js"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
              darkMode
                ? "text-gray-400 hover:text-flow-primary"
                : "text-gray-600 hover:text-flow-600"
              }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Documentation</span>
          </a>
          <a
            href="https://github.com/onflow/fcl-js"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
              darkMode
                ? "text-gray-400 hover:text-flow-primary"
                : "text-gray-600 hover:text-flow-600"
              }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
