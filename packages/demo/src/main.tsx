import React from "react"
import {createRoot} from "react-dom/client"
import {FlowProvider} from "@onflow/kit"
import {Connect} from "@onflow/kit"

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)

root.render(
  <FlowProvider
    config={{
      accessNodeUrl: "https://access-testnet.onflow.org",
      flowNetwork: "testnet",
      appDetailTitle: "@onflow/kit Demo",
      appDetailIcon: "",
      appDetailDescription: "Demo of our Connect button",
      appDetailUrl: "https://flow.com",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        padding: 32,
      }}
    >
      <h1>💧 @onflow/kit Connect Demo</h1>
      <Connect />
    </div>
  </FlowProvider>
)
