import {flowEmulator, flowMainnet, flowTestnet} from "@onflow/fcl"
import {FlowProvider, type FlowNetwork} from "@onflow/kit"
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
      //       background: "bg-blue-700",
      //       text: "text-black",
      //       hover: "hover:bg-black-600",
      //     },
      //     secondary: {
      //       background: "bg-blue-100",
      //       text: "text-blue-800",
      //       hover: "hover:bg-blue-200",
      //     },
      //     outline: {
      //       background: "bg-transparent",
      //       text: "text-blue-700",
      //       hover: "hover:bg-blue-50",
      //       border: "border border-blue-700",
      //     },
      //   },
      // }}
    >
      {children}
    </FlowProvider>
  )
}
