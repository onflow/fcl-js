# @onflow/kit

> This library is currently in alpha and is subject to change.

A React library with hooks and components for interacting with the Flow blockchain.

## Installation

```bash
npm install @onflow/kit
```

## Usage

### Wrapping Your App With `FlowProvider`

Before using any hooks or components, wrap your application with the `FlowProvider` to initialize FCL configuration. This sets up FCL and maps its configuration keys to a strictly typed format for your hooks.

```jsx
import React from "react"
import { FlowProvider } from "@onflow/kit"
import App from "./App"

function Root() {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://access-mainnet.onflow.org",
        flowNetwork: "mainnet",
        appDetailTitle: "My On Chain App",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myonchainapp.com",
        // include other typed configuration keys as needed...
      }}
    >
      <App />
    </FlowProvider>
  )
}

export default Root
```

### Install Everything

```jsx
import { useBlock, ConnectButton } from '@onflow/kit'
```

### Install Hooks Only

```jsx
import { useConfig } from '@onflow/kit/hooks'
```

### Install Components Only

```jsx
import { ConnectButton } from '@onflow/kit/components'
```

### Hooks

#### `useFlowAccount`

```jsx
const { account, loading, error, refetch } = useAccount("0x1cf0e2f2f715450")

  if (loading) return <p>Loading account...</p>
  if (error) return <p>Error fetching account: {error.message}</p>
  if (!account) return <p>No account data</p>

  return (
    <div>
      <h2>Account: {account.address}</h2>
      <p>Balance: {account.balance}</p>
      <pre>{account.code}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
```

#### `useCurrentFlowUser`

```jsx
import { useCurrentFlowUser } from "@onflow/kit/hooks"

function AuthComponent() {
  const { user, authenticate, unauthenticate } = useCurrentFlowUser()

  return (
    <div>
      {user.loggedIn ? (
        <>
          <p>Logged in as {user.addr}</p>
          <button onClick={unauthenticate}>Logout</button>
        </>
      ) : (
        <button onClick={authenticate}>Login</button>
      )}
    </div>
  )
}
```

#### `useConfig`

```jsx
import { useConfig } from '@onflow/kit/hooks'

function MyComponent() {
  const config = useConfig()

  return (
    <div>
      <p>Current network: {config.flowNetwork}</p>
      <p>Current access node: {config.accesNodeApi}</p>
    </div>
  )
}
```
