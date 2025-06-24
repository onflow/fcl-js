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
  darkMode={false}
>
  <App />
</FlowProvider>
```

## 🌙 Dark Mode

The kit includes built-in dark mode support controlled by the parent app. Set the `darkMode` prop to enable dark mode styling in all kit components.

```tsx
import { useDarkMode } from "@onflow/kit"

function MyComponent() {
  const { isDark } = useDarkMode()

  return (
    <div>
      <p>Current mode: {isDark ? "Dark" : "Light"}</p>
    </div>
  )
}
```

**Usage:**
- `darkMode={false}` (default): Light mode
- `darkMode={true}`: Dark mode
- The parent app controls the dark mode state and can change it by updating the prop

**Note**: Dark mode is controlled entirely by the parent app. Kit components will automatically apply dark mode styling when `darkMode={true}`.

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
- `useDarkMode`

## 📚 Full Documentation

Looking for full API docs, examples, and usage tips?

👉 [Explore the official docs →](https://developers.flow.com/tools/kit)
