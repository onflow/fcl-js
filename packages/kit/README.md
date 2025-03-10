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
