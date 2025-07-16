import {flowEmulator, flowMainnet, flowTestnet} from "@onflow/fcl"
import {FlowProvider, type FlowNetwork} from "@onflow/react-sdk"
import React, {useEffect} from "react"
import * as fcl from "@onflow/fcl"
import flowJSON from "../../flow.json"

const flowNetwork =
  (import.meta.env.VITE_FLOW_NETWORK as FlowNetwork) || "emulator"
const flowConfig = {
  emulator: flowEmulator,
  testnet: flowTestnet,
  mainnet: flowMainnet,
}

export default function FlowProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Remove once fixed
  useEffect(() => {
    fcl.config({
      ...flowConfig[flowNetwork],
      appDetailTitle: "Demo App",
      appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
      appDetailUrl: "https://yourapp.com",
      appDetailDescription: "Your app description",
    })
  }, [flowNetwork])

  return (
    <FlowProvider
      config={{
        ...flowConfig[flowNetwork],
        appDetailTitle: "Demo App",
        appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
        appDetailUrl: "https://yourapp.com",
        appDetailDescription: "Your app description",
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
