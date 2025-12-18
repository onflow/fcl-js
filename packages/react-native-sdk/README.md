# @onflow/react-native-sdk

A React Native library that provides hooks for interacting with the Flow blockchain. It helps you authenticate users, run Cadence scripts and transactions, listen to events, and manage network configuration directly from your components. Fully compatible with Expo.

This package provides a comparable API to [@onflow/react-sdk](https://www.npmjs.com/package/@onflow/react-sdk) for React Native applications. See the hooks in action in the [React SDK Playground](https://react.flow.com).

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

Here's a look at some of the hooks available. For a full list, see the [official documentation](https://developers.flow.com/tools/react-native-sdk/hooks).

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

## 🔗 WalletConnect Deeplinks

This SDK uses `wc-redirect` as the deeplink path for WalletConnect redirects (e.g., `myapp://wc-redirect`). When a wallet approves a connection or transaction, it redirects back to your app using this path.

To prevent navigation flashes, you can intercept this path using Expo Router's `+native-intent.tsx`. See [Expo Router Native Intent documentation](https://docs.expo.dev/router/advanced/native-intent/) for details.

## 📚 Full Documentation

Looking for full API docs, examples, and usage tips?

👉 [Explore the official docs →](https://developers.flow.com/tools/react-sdk)
