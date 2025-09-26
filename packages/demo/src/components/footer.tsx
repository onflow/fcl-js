import {PlusGridRow, PlusGridItem} from "./ui/plus-grid"
import {useDarkMode} from "./flow-provider-wrapper"

export function Footer() {
  const {darkMode} = useDarkMode()

  const footerLinks = {
    "Developer Resources": [
      {
        name: "FCL Documentation",
        href: "https://developers.flow.com/tools/fcl-js",
      },
      {
        name: "React SDK Docs",
        href: "https://developers.flow.com/tools/fcl-js/react-sdk",
      },
      {name: "Flow CLI", href: "https://developers.flow.com/tools/flow-cli"},
      {name: "Cadence Language", href: "https://developers.flow.com/cadence"},
    ],
    "Flow Network": [
      {name: "Flow Blockchain", href: "https://flow.com"},
      {name: "Flow Explorer", href: "https://flowscan.org"},
      {name: "Flow Port", href: "https://port.onflow.org"},
      {name: "Flow Faucet", href: "https://testnet-faucet.onflow.org"},
    ],
    Community: [
      {name: "GitHub", href: "https://github.com/onflow/fcl-js"},
      {name: "Discord", href: "https://discord.gg/flow"},
      {name: "Forum", href: "https://forum.onflow.org"},
      {name: "Twitter", href: "https://twitter.com/flow_blockchain"},
    ],
    "Tools & APIs": [
      {
        name: "Flow Client Library",
        href: "https://developers.flow.com/tools/fcl-js",
      },
      {name: "Access API", href: "https://developers.flow.com/http-api"},
      {name: "Emulator", href: "https://developers.flow.com/tools/emulator"},
      {
        name: "NFT Standards",
        href: "https://developers.flow.com/cadence/tutorial/non-fungible-tokens",
      },
    ],
  }

  return (
    <footer
      className={`relative ${
        darkMode
          ? "bg-gray-900/30 border-gray-700/50"
          : "bg-gray-50/30 border-gray-200/50"
        }`}
    >
      <div className="max-w-7xl mx-auto pb-16">
        <PlusGridRow showTopLines={false}>
          <PlusGridItem>
            <div className="mb-12">
              <div className="flex items-center space-x-4 mb-6 mt-8">
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
                  <h3
                    className={`text-lg font-black tracking-tight -mt-1 font-mono ${
                      darkMode ? "text-white" : "text-black" }`}
                  >
                    React SDK
                  </h3>
                </div>
              </div>

              <p
                className={`text-lg max-w-2xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                The Flow React SDK provides everything you need to build amazing
                Web3 applications. Start building with ready to use components
                and hooks and ship faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4
                    className={`font-semibold text-sm uppercase tracking-wider mb-4 ${
                    darkMode ? "text-gray-200" : "text-gray-900" }`}
                  >
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map(link => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm transition-colors duration-200 hover:text-flow-primary ${
                          darkMode ? "text-gray-400" : "text-gray-600" }`}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className={`p-6 rounded-xl border mb-12 ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white border-gray-200"
                }`}
            >
              <div
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4
                  lg:space-y-0"
              >
                <div>
                  <h4
                    className={`font-semibold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Stay Updated
                  </h4>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Get the latest updates on Flow development tools and
                    ecosystem news.
                  </p>
                </div>
                <a
                  href="https://flow.com/newsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-flow-primary text-gray-900 font-semibold
                    rounded-lg hover:bg-flow-primary/90 transition-all duration-200 hover:scale-105"
                >
                  Subscribe
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div
              className={`pt-8 pb-4 border-t flex flex-col sm:flex-row justify-between items-center
                space-y-4 sm:space-y-0 ${darkMode ? "border-gray-700/50" : "border-gray-200"}`}
            >
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Built with <span className="text-flow-primary">♥</span> for
                developers.
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="https://github.com/onflow/fcl-js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  title="GitHub"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>

                <a
                  href="https://discord.gg/flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  title="Discord"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com/flow_blockchain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  title="Twitter"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </PlusGridItem>
        </PlusGridRow>
      </div>
    </footer>
  )
}
