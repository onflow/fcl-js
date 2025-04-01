# @onflow/kit

> This library is currently in alpha and is subject to change.

A React library with hooks and components (coming soon) for interacting with the Flow blockchain.

## Installation

```bash
npm install @onflow/kit
```

## Usage

### Wrapping Your App With `FlowProvider`

Before using any hooks or components (coming soon), wrap your application with the `FlowProvider` to initialize FCL configuration. This sets up FCL and maps its configuration keys to a strictly typed format for your hooks.

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
import { useFlowConfig } from '@onflow/kit/hooks'
```

### Install Components Only

Coming soon...

### Hooks

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

#### `useFlowAccount`

```jsx
const { account, loading, error, refetch } = useFlowAccount("0x1cf0e2f2f715450")

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

### `useFlowBlock`

#### Parameters

- **Latest block:** `{}` (default)
- **Latest sealed block:** `{ sealed: true }`
- **By ID:** `{ id: "block-id" }`
- **By height:** `{ height: 123 }`

```jsx
import { useFlowBlock } from '@onflow/kit/hooks';

function LatestBlock() {
  const { data: block, isLoading, error } = useFlowBlock();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!block) return <p>No block data.</p>;
  return (
    <div>
      <h2>Block {block.height}</h2>
      <p>ID: {block.id}</p>
    </div>
  );
}
```

#### `useFlowConfig`

```jsx
import { useFlowConfig } from '@onflow/kit/hooks'

function MyComponent() {
  const config = useFlowConfig()

  return (
    <div>
      <p>Current network: {config.flowNetwork}</p>
      <p>Current access node: {config.accesNodeApi}</p>
    </div>
  )
}
```

### `useFlowEvents`

#### Parameters

- **eventNameOrFilter:** A fully qualified event name (string) or an EventFilter object (e.g. `{ eventTypes: ["A.0x...SomeEvent"] }`).
- **options:** An object with:
  - `onEvent`: Callback invoked with each new event.
  - `onError` (optional): Callback for handling errors.

```jsx
import { useFlowEvents } from '@onflow/kit/hooks';

function EventListener() {
  useFlowEvents("A.0xDeaDBeef.SomeContract.SomeEvent", {
    onEvent: (event) => console.log("New event:", event),
    onError: (error) => console.error("Error:", error),
  });

  return <div>Listening for events...</div>;
}
```

### `useFlowQuery`

#### Parameters

- **cadence:** The Cadence script as a string.
- **args (optional):** A function that returns an array of FCL arguments. For example, `(arg, t) => [arg(1, t.Int), arg(2, t.Int)]`.
- **enabled (optional):** A boolean indicating whether the query should be enabled. Defaults to `true`.

```jsx
import React from "react"
import { useFlowQuery } from "@onflow/kit/hooks"

function QueryExample() {
  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: `
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    args: (arg, t) => [arg(1, t.Int), arg(2, t.Int)],
    enabled: true,
  })

  if (isLoading) return <p>Loading query...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <p>Result: {data}</p>
      <button onClick={refetch}>Refetch Query</button>
    </div>
  )
}

export default QueryExample
```

### `useFlowMutate`

```tsx
import * as fcl from "@onflow/fcl";
import { useFlowMutate } from "@onflow/kit";

const CreatePage: React.FC = () => {
  const { mutate, isPending, error, data: txId } = useFlowMutate();

  const sendTransaction = () => {
    mutate({
      cadence: `transaction() {
        prepare(acct: &Account) {
          log(acct.address)
        }
      }`,
      args: (arg, t) => [],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [],
      limit: 100,
    });
  };

  return (
    <div>
      <button onClick={sendTransaction} disabled={isPending}>
        Send Transaction
      </button>
      {isPending && <p>Sending transaction...</p>}
      {error && <p>Error: {error.message}</p>}
      {txId && <p>Transaction ID: {txId}</p>}
    </div>
  );
};
```

### `useFlowTransaction`

```jsx
import {useFlowTransaction} from "./useFlowTransaction"

function TransactionComponent() {
  const txId = "your-transaction-id-here"
  const {transactionStatus, error} = useFlowTransaction(txId)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      Status: {transactionStatus?.statusString}
    </div>
  )
}
```
