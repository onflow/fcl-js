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
import { FlowProvider } from '@onflow/kit'
<FlowProvider>
  {/* Your app */}
</FlowProvider>
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
