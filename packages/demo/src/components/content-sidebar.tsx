import {useState, useEffect, useRef} from "react"
import {PlusGridIcon} from "./ui/plus-grid"

interface SidebarItem {
  id: string
  label: string
  category: "setup" | "components" | "hooks" | "advanced"
  description: string
}

const sidebarItems: SidebarItem[] = [
  // Setup section
  {
    id: "installation",
    label: "Installation & Setup",
    category: "setup",
    description: "Install and configure the React SDK",
  },

  // Components section
  {
    id: "connect",
    label: "Connect",
    category: "components",
    description: "Wallet connection component",
  },
  {
    id: "profile",
    label: "Profile",
    category: "components",
    description: "Standalone profile display",
  },
  {
    id: "transactionbutton",
    label: "Transaction Button",
    category: "components",
    description: "Transaction execution button",
  },
  {
    id: "transactiondialog",
    label: "Transaction Dialog",
    category: "components",
    description: "Transaction confirmation dialog",
  },
  {
    id: "transactionlink",
    label: "Transaction Link",
    category: "components",
    description: "Transaction link component",
  },
  {
    id: "nftcard",
    label: "NFT Card",
    category: "components",
    description: "NFT card component",
  },
  {
    id: "scheduledtransactionlist",
    label: "Scheduled Transaction List",
    category: "components",
    description: "List of scheduled transactions",
  },

  // Hooks section
  {
    id: "useflowcurrentuser",
    label: "Current User",
    category: "hooks",
    description: "Manage user authentication",
  },
  {
    id: "useflowaccount",
    label: "Account",
    category: "hooks",
    description: "Fetch account information",
  },
  {
    id: "useflowblock",
    label: "Block",
    category: "hooks",
    description: "Get blockchain block data",
  },
  {
    id: "useflowchainid",
    label: "Chain ID",
    category: "hooks",
    description: "Get current chain ID",
  },
  {
    id: "useflowconfig",
    label: "Config",
    category: "hooks",
    description: "Access Flow configuration",
  },
  {
    id: "useflowquery",
    label: "Query",
    category: "hooks",
    description: "Execute Flow scripts",
  },
  {
    id: "useflowqueryraw",
    label: "Query Raw",
    category: "hooks",
    description: "Execute raw Flow scripts",
  },
  {
    id: "useflowmutate",
    label: "Mutate",
    category: "hooks",
    description: "Send Flow transactions",
  },
  {
    id: "useflowevents",
    label: "Events",
    category: "hooks",
    description: "Listen to blockchain events",
  },
  {
    id: "useflowrevertiblerandom",
    label: "Revertible Random",
    category: "hooks",
    description: "Generate random numbers",
  },
  {
    id: "useflowtransactionstatus",
    label: "Transaction Status",
    category: "hooks",
    description: "Track transaction status",
  },
  {
    id: "usecrossvmbridgenftfromevm",
    label: "Bridge NFT from EVM",
    category: "hooks",
    description: "Bridge NFTs from EVM to Cadence",
  },
  {
    id: "usecrossvmbridgenfttoevm",
    label: "Bridge NFT to EVM",
    category: "hooks",
    description: "Bridge NFTs from Cadence to EVM",
  },
  {
    id: "usecrossvmbridgetokenfromevm",
    label: "Bridge Token from EVM",
    category: "hooks",
    description: "Bridge tokens from EVM to Cadence",
  },
  {
    id: "usecrossvmbridgetokentoevm",
    label: "Bridge Token to EVM",
    category: "hooks",
    description: "Bridge tokens from Cadence to EVM",
  },
  {
    id: "useflownftmetadata",
    label: "NFT Metadata",
    category: "hooks",
    description: "Fetch NFT metadata and traits",
  },
  {
    id: "useflowscheduledtransaction",
    label: "Scheduled Transactions",
    category: "hooks",
    description: "Manage Scheduled Transactions",
  },

  // Advanced section
  {
    id: "darkmode",
    label: "Dark Mode Control",
    category: "advanced",
    description: "Dynamic theme switching",
  },
  {
    id: "theming",
    label: "Custom Theming",
    category: "advanced",
    description: "Customize component appearance",
  },
]

interface ContentSidebarProps {
  darkMode: boolean
  onItemClick?: () => void
}

export function ContentSidebar({darkMode, onItemClick}: ContentSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const navRef = useRef<HTMLElement>(null)
  const scrollLockRef = useRef<number | null>(null)

  const setupItems = sidebarItems.filter(item => item.category === "setup")
  const componentsItems = sidebarItems.filter(
    item => item.category === "components"
  )
  const hooksItems = sidebarItems.filter(item => item.category === "hooks")
  const advancedItems = sidebarItems.filter(
    item => item.category === "advanced"
  )

  const scrollToElement = (id: string, isInitialLoad = false) => {
    const element = document.getElementById(id)
    if (element) {
      // Save current sidebar scroll position if nav ref is available (but not on initial load)
      if (navRef.current && !isInitialLoad) {
        scrollLockRef.current = navRef.current.scrollTop
      }

      // Update the URL hash without reloading the page
      window.history.replaceState(null, "", `#${id}`)

      // Calculate position manually to ensure consistent 60px from top
      const absoluteElementTop = element.offsetTop
      const scrollMarginTop = 60
      const targetPosition = absoluteElementTop - scrollMarginTop
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      // Use the minimum of target position and max scroll to handle elements at the bottom
      const scrollPosition = Math.min(targetPosition, maxScroll)

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      })

      // Call onItemClick callback (for closing mobile sidebar)
      if (!isInitialLoad && onItemClick) {
        onItemClick()
      }

      // Unlock after scroll animation completes (only if we locked it)
      if (!isInitialLoad) {
        setTimeout(() => {
          scrollLockRef.current = null
        }, 1000)
      }
    }
  }

  // Prevent sidebar from scrolling when clicking buttons
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleScroll = () => {
      if (scrollLockRef.current !== null) {
        nav.scrollTop = scrollLockRef.current
      }
    }

    nav.addEventListener("scroll", handleScroll)
    return () => nav.removeEventListener("scroll", handleScroll)
  }, [])

  // Track which section is currently visible
  useEffect(() => {
    // Check if there's a hash in the URL on initial load
    const hash = window.location.hash.slice(1) // Remove the # character
    if (hash) {
      setActiveSection(hash)

      // Manually trigger scroll since browser isn't doing it automatically
      const scrollToHash = () => {
        const element = document.getElementById(hash)
        if (element) {
          // Use scrollIntoView with auto behavior (instant, not smooth) that respects scroll-margin-top
          element.scrollIntoView({behavior: "auto", block: "start"})
        }
      }

      // Try multiple times to ensure content is loaded
      requestAnimationFrame(() => {
        scrollToHash()
        setTimeout(scrollToHash, 100)
        setTimeout(scrollToHash, 300)
        setTimeout(scrollToHash, 500)
      })
    }

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
      ref={navRef}
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
        title="Setup"
        items={setupItems}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />

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

      <SidebarSection
        title="Advanced"
        items={advancedItems}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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
            href="https://github.com/onflow/fcl-js/tree/master/packages/react-sdk"
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
