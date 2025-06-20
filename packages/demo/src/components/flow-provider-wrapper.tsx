import React from "react"
import {FlowProvider, type FlowNetwork} from "@onflow/kit"
import flowJSON from "../../flow.json"
import {ACCESS_NODE_URLS} from "../constants"

const flowNetwork = import.meta.env.VITE_FLOW_NETWORK as FlowNetwork

export default function FlowProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FlowProvider
      config={{
        flowNetwork,
        accessNodeUrl: ACCESS_NODE_URLS[flowNetwork],
        discoveryWallet: `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
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
