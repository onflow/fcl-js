import * as fcl from "@onflow/fcl"
import {FlowProvider, type FlowNetwork} from "@onflow/react-sdk"
import {relayProvider} from "@onflow/payments"
import React, {createContext, useCallback, useContext, useState} from "react"

// Dark mode context
interface DarkModeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

// Network switching context
interface NetworkSwitchContextType {
  currentNetwork: FlowNetwork
  switchNetwork: (network: FlowNetwork) => Promise<void>
  isNetworkSwitching: boolean
}

// Flow configuration type
interface FlowConfig {
  accessNodeUrl: string
  discoveryWallet: string
  discoveryAuthnEndpoint: string
  flowNetwork: string
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

const NetworkSwitchContext = createContext<
  NetworkSwitchContextType | undefined
>(undefined)

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}

export const useNetworkSwitch = () => {
  const context = useContext(NetworkSwitchContext)
  if (!context) {
    throw new Error(
      "useNetworkSwitch must be used within a NetworkSwitchProvider"
    )
  }
  return context
}

const flowNetwork =
  (import.meta.env.VITE_FLOW_NETWORK as FlowNetwork) || "emulator"
const flowConfig: Record<FlowNetwork, FlowConfig> = {
  emulator: {
    accessNodeUrl: "http://localhost:8888",
    discoveryWallet: "http://localhost:8701/fcl/authn",
    discoveryAuthnEndpoint: "http://localhost:8701/fcl/authn",
    flowNetwork: "local" as const,
  },
  testnet: {
    accessNodeUrl: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/testnet/authn",
    flowNetwork: "testnet" as const,
  },
  mainnet: {
    accessNodeUrl: "https://rest-mainnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/mainnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/mainnet/authn",
    flowNetwork: "mainnet" as const,
  },
}

// Network switching provider component
function NetworkSwitchProvider({children}: {children: React.ReactNode}) {
  const [currentNetwork, setCurrentNetwork] = useState<FlowNetwork>(flowNetwork)
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false)

  const switchNetwork = useCallback(
    async (network: FlowNetwork) => {
      setIsNetworkSwitching(true)

      try {
        // Check if user is currently authenticated
        const currentUser = await fcl.currentUser.snapshot()
        const wasAuthenticated = currentUser.loggedIn

        // If user is authenticated, unauthenticate them first
        if (wasAuthenticated) {
          fcl.unauthenticate()
        }

        // Update FCL configuration for new network
        const config = flowConfig[network]
        fcl.config({
          "accessNode.api": config.accessNodeUrl,
          "discovery.wallet": config.discoveryWallet,
          "flow.network": config.flowNetwork,
          "app.detail.title": "Demo App",
          "app.detail.url": window.location.origin,
          "app.detail.icon":
            "https://avatars.githubusercontent.com/u/62387156?v=4",
          "fcl.limit": 1000,
          "fcl.walletconnect.projectId": "9b70cfa398b2355a5eb9b1cf99f4a981",
        })

        // Update local state
        setCurrentNetwork(network)
      } catch (error) {
        console.error("Failed to switch network:", error)
      } finally {
        setIsNetworkSwitching(false)
      }
    },
    [currentNetwork]
  )

  return (
    <NetworkSwitchContext.Provider
      value={{currentNetwork, switchNetwork, isNetworkSwitching}}
    >
      {children}
    </NetworkSwitchContext.Provider>
  )
}

// Inner component that can access the network switch context
function FlowProviderInner({
  children,
  darkMode,
}: {
  children: React.ReactNode
  darkMode: boolean
}) {
  const {currentNetwork} = useNetworkSwitch()

  return (
    <FlowProvider
      key={currentNetwork} // Force re-mount when network changes
      config={{
        ...flowConfig[currentNetwork],
        appDetailTitle: "Demo App",
        appDetailUrl: window.location.origin,
        appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
        appDetailDescription: "Your app description",
        computeLimit: 1000,
        walletconnectProjectId: "9b70cfa398b2355a5eb9b1cf99f4a981",
        flowNetwork: currentNetwork,
      }}
      colorMode={darkMode ? "dark" : "light"}
      fundingProviders={[relayProvider()]}
    >
      {children}
    </FlowProvider>
  )
}

export default function FlowProviderWrapper({
  children,
  darkMode,
  toggleDarkMode,
}: {
  children: React.ReactNode
  darkMode: boolean
  toggleDarkMode: () => void
}) {
  return (
    <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
      <NetworkSwitchProvider>
        <FlowProviderInner darkMode={darkMode}>{children}</FlowProviderInner>
      </NetworkSwitchProvider>
    </DarkModeContext.Provider>
  )
}
