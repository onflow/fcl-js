# @onflow/kit

A React library that provides hooks for interacting with the Flow blockchain. It helps you authenticate users, run Cadence scripts and transactions, listen to events, and manage network configuration directly from your components.

## 🔧 Installation

```bash
npm install @onflow/kit
```

## 🧩 Quick Setup

Before using any hooks, wrap your app in the `FlowProvider`:

```tsx
import { FlowProvider } from "@onflow/kit"
import flowJson from "../flow.json"

<FlowProvider
  config={{
    accessNodeUrl: "https://access-mainnet.onflow.org",
    flowNetwork: "mainnet",
    appDetailTitle: "My On Chain App",
    appDetailIcon: "https://example.com/icon.png",
    appDetailDescription: "A decentralized app on Flow",
    appDetailUrl: "https://myonchainapp.com",
  }}
  flowJson={flowJson}
>
  <App />
</FlowProvider>
```

## 🪝 Available Hooks

- `useCurrentFlowUser`
- `useFlowAccount`
- `useFlowBlock`
- `useFlowConfig`
- `useFlowEvents`
- `useFlowQuery`
- `useFlowRevertibleRandom`
- `useFlowMutate`
- `useFlowTransaction`
- `useCrossVmTokenBalance`

## 📚 Full Documentation

Looking for full API docs, examples, and usage tips?

👉 [Explore the official docs →](https://developers.flow.com/tools/kit)
