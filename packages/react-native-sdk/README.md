# @onflow/react-native-sdk

A React Native library that provides hooks for interacting with the Flow blockchain. It helps you authenticate users, run Cadence scripts and transactions, listen to events, and manage network configuration directly from your components. Fully compatible with Expo.

## 🔧 Installation

```bash
npm install @onflow/react-native-sdk
```

## 🧩 Quick Setup

Before using any hooks, wrap your app in the `FlowProvider`:

```tsx
import {FlowProvider} from "@onflow/react-native-sdk"
import flowJson from "../flow.json"

<FlowProvider
  config={{
    accessNodeUrl: "https://rest-mainnet.onflow.org",
    flowNetwork: "mainnet",
    walletconnectProjectId: "YOUR_WALLETCONNECT_PROJECT_ID",
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

- `useFlowCurrentUser`
- `useFlowAccount`
- `useFlowBlock`
- `useFlowConfig`
- `useFlowEvents`
- `useFlowQuery`
- `useFlowRevertibleRandom`
- `useFlowMutate`
- `useFlowTransaction`
- `useFlowTransactionStatus`
- `useCrossVmTokenBalance`
- `useCrossVmBatchTransaction`

## 🧱 Available Components

- `<Connect />` - Wallet connection button with built-in profile modal
- `<Profile />` - Displays connected wallet information with disconnect option

## 📚 Full Documentation

Looking for full API docs, examples, and usage tips?

👉 [Explore the official docs →](https://developers.flow.com/tools/react-sdk)
