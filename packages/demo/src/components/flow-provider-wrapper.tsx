import {flowEmulator, flowMainnet, flowTestnet} from "@onflow/fcl"
import {FlowProvider, type FlowNetwork} from "@onflow/react-sdk"
import React, {useEffect} from "react"
import * as fcl from "@onflow/fcl"
import flowJSON from "../../flow.json"

const flowNetwork =
  (import.meta.env.VITE_FLOW_NETWORK as FlowNetwork) || "emulator"
const flowConfig = {
  emulator: {
    accessNodeUrl: "http://localhost:8888",
    discoveryWallet: "http://localhost:8701/fcl/authn",
    discoveryAuthnEndpoint: "http://localhost:8701/fcl/authn",
    flowNetwork: "local" as any,
  },
  testnet: {
    accessNodeUrl: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/testnet/authn",
    flowNetwork: "testnet" as any,
  },
  mainnet: {
    accessNodeUrl: "https://rest-mainnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/mainnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/mainnet/authn",
    flowNetwork: "mainnet" as any,
  },
}

export default function FlowProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FlowProvider
      config={{
        ...flowConfig[flowNetwork],
        appDetailTitle: "Demo App",
        appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
        appDetailUrl: "https://yourapp.com",
        appDetailDescription: "Your app description",
        computeLimit: 1000,
      }}
      flowJson={flowJSON}
      // theme={{
      //   colors: {
      //     primary: {
      //       background: "flow-bg-red-700",
      //       text: "flow-text-white",
      //       hover: "hover:flow-bg-green-800",
      //     },
      //     secondary: {
      //       background: "flow-bg-blue-100",
      //       text: "flow-text-blue-800",
      //       hover: "hover:flow-bg-blue-200",
      //     },
      //     outline: {
      //       background: "flow-bg-transparent",
      //       text: "flow-text-blue-700",
      //       hover: "hover:flow-bg-blue-50",
      //       border: "flow-border flow-border-blue-700",
      //     },
      //     link: {
      //       background: "flow-bg-transparent",
      //       text: "flow-text-blue-700",
      //       hover: "hover:flow-bg-blue-50",
      //     },
      //   },
      // }}
    >
      {children}
    </FlowProvider>
  )
}
