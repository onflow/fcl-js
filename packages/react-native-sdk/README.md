# @onflow/react-native-sdk

React Native SDK for building mobile dapps on the Flow blockchain.

## Installation

```bash
npm install @onflow/react-native-sdk
```

This will automatically install all required dependencies including `@onflow/fcl-react-native` and `@onflow/react-sdk`.

## Quick Start

### 1. Wrap your app with FlowProvider

```typescript
import {FlowProvider} from "@onflow/react-native-sdk"

export default function App() {
  return (
    <FlowProvider
      config={{
        flowNetwork: "testnet",
        walletconnectProjectId: "YOUR_PROJECT_ID",
        appDetailTitle: "My Flow App",
        appDetailIcon: "https://myapp.com/icon.png",
      }}
    >
      {/* Your app components */}
    </FlowProvider>
  )
}
```

> **Note**: `FlowProvider` automatically includes `ConnectModalProvider` from `@onflow/fcl-react-native` for wallet connection UI. You don't need to wrap your app with `ConnectModalProvider` separately.

### 2. Use hooks and components

```typescript
import {
  Connect,
  Profile,
  useFlowCurrentUser,
} from "@onflow/react-native-sdk"

function MyScreen() {
  const {user} = useFlowCurrentUser()

  return (
    <View>
      <Connect />
      {user?.loggedIn && <Profile />}
    </View>
  )
}
```

## Components

### Connect

A button that handles wallet connection with built-in modal.

```typescript
<Connect
  onConnect={() => console.log("Connected")}
  onDisconnect={() => console.log("Disconnected")}
  modalEnabled={true}
/>
```

**Props:**
- `onConnect?: () => void` - Callback when user connects
- `onDisconnect?: () => void` - Callback when user disconnects
- `style?: ViewStyle` - Custom button styles
- `textStyle?: TextStyle` - Custom text styles
- `connectedStyle?: ViewStyle` - Button style when connected
- `connectedTextStyle?: TextStyle` - Text style when connected
- `modalEnabled?: boolean` - Show profile modal on press (default: true)

### Profile

Displays user profile with address.

```typescript
<Profile onDisconnect={() => console.log("Disconnected")} />
```

**Props:**
- `onDisconnect?: () => void` - Callback when disconnect button pressed
- `style?: ViewStyle` - Custom container styles

## Hooks

All hooks from `@onflow/react-sdk` are re-exported and available:

```typescript
import {
  useFlowCurrentUser,
  useFlowAccount,
  useFlowQuery,
  useFlowMutation,
  useFlowTransaction,
  useCrossVmTokenBalance,
  // ... and many more
} from "@onflow/react-native-sdk"
```

See [@onflow/react-sdk documentation](https://react.flow.com) for full hook API reference.

## Metro Bundler Configuration

This package includes pre-built bundles (`dist/`) that work with React Native Metro bundler. Metro will automatically use the ESM bundle (`dist/index.module.js`) via the `module` field in package.json, which is fully compatible with React Native's transformation pipeline.

No special Metro configuration is required, the package works out of the box with standard React Native and Expo projects.

## Example

See the [flow-expo-starter](https://github.com/onflow/flow-expo-starter) repository for a complete example React Native + Expo app.
