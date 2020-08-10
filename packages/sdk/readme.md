# @onflow/sdk

A collection of modules that make interacting with [Flow](https://onflow.org) easier.

# Status

- **Last Updated:** August 10th 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

This package is working and in active delveopment, breaking changes may happen.

# Install

```bash
npm install --save @onflow/sdk
```

# Usage

## Example: Building A Transaction Interaction

Building a interaction produces an unresolved interaction. For example, to build a transaction interaction you must call `sdk.build([...])`, and pass in the sequence of builders you want to use to compose that transaction interaction. The example below highlights one way to build a transaction interaction:

```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const builtTxIx = await sdk.build([
  sdk.transaction`transaction(msg: String) { prepare(acct: AuthAccount) {} execute { log(msg) } }`,
  sdk.args([sdk.arg("Hello, Flow!", types.String)])
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer(sdk.authorization("01", signingFunction, 0, seqNum)),
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
])
```

## Example: Resolving A Transaction Interaction

Once a transaction interaction is built, it's still not quite ready to be sent to the Access Node. To further prepare it to be ready to be sent to the Access Node, you must resolve it by piping it through a series of resolvers. Resolvers are functions that consume an interaction and attempt to fill in or prepare any missing pieces of it to get it ready to be sent to the Access API. The example below highlights one way to resolve a transaction interaction:

```javascript
import * as sdk from "@onflow/sdk"
const resolvedTxIx = await sdk.pipe(builtTxIx, [
  sdk.resolve([
    sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
    sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
    sdk.resolveArguments,
    sdk.resolveAccounts,
    sdk.resolveSignatures
  ])
)
```
## Example: Sending A Transaction Interaction

Now that your transction interaction is resolved, it can be sent to an Access Node! To send it to an Access Node, you must call `sdk.send(...)` with that interaction, and a configuration object. To specify which Access Node to send your request to, you specify it in the _node_ parameter of the config object. For example, the code below shows how to send your transaction interaction to the Flow Emulator running on _localhost:8080_:

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(resolvedTxIx, { node: "http://localhost:8080" })
```

## Using the rest of the SDK

The SDK additionally supplies builders to construct interactions of many different types to interact with the Access Node's various APIs. 

Please reference the provided example project `react-simple` for example code.

### GetAccount

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getAccount(addr)
]), { node: "http://localhost:8080" })
```

### GetEvents

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getEvents(eventType, startBlock, endBlock),
]), { node: "http://localhost:8080" })
```

### GetLatestBlock

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getLatestBlock()
]), { node: "http://localhost:8080" })
```

### GetTransactionStatus

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getTransactionStatus(txId)
]), { node: "http://localhost:8080" })
```

### Ping

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.ping()
]), { node: "http://localhost:8080" })
```

### Script

```javascript 
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.args([sdk.arg("Hello Flow!", types.String)]),
  sdk.script`
    pub fun main(msg: String): Int {
      log(msg)
      return 7
    }
  `,
]), [
  sdk.resolve([
    sdk.resolveArguments,
  ]),
]), { node: "http://localhost:8080" })
```

### Transaction

```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.transaction`transaction(msg: String) { prepare(acct: AuthAccount) {} execute { log(msg) } }`,
  sdk.args([sdk.arg("Hello, Flow!", types.String)]),
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer(sdk.authorization("01", signingFunction, 0)),
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
]), [
  sdk.resolve([
    sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
    sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
    sdk.resolveArguments,
    sdk.resolveAccounts,
    sdk.resolveSignatures
  ]),
]), { node: "http://localhost:8080" })
```

# Exposes

- [Top Level](./)

  - [`sdk.build`](./src/build)
  - [`sdk.resolve`](./src/resolve)
  - [`sdk.send`](../send)
  - [`sdk.decode`](../decode)
  - [`sdk.decodeResponse`](../decode)

- [Utils](../interaction)

  - [`sdk.isOk`](../interaction)
  - [`sdk.isBad`](../interaction)
  - [`sdk.why`](../interaction)
  - [`sdk.pipe`](../interaction)

- [Builders](./src/build)

  - [`sdk.authorizations` & `sdk.authorization`](./src/build/authorizations.js)
  - [`sdk.getAccount`](./src/build/get-account.js)
  - [`sdk.getEvents`](./src/build/get-events.js)
  - [`sdk.getLatestBlock`](./src/build/get-latest-block.js)
  - [`sdk.getTransactionStatus`](./src/build/get-transaction-status.js)
  - [`sdk.limit`](./src/build/limit.js)
  - [`sdk.params` & `sdk.param`](./src/build/params.js)
  - [`sdk.payer`](./src/build/payer.js)
  - [`sdk.ping`](./src/build/ping.js)
  - [`sdk.ref`](./src/build/ref.js)
  - [`sdk.script`](./src/build/script.js)
  - [`sdk.transaction`](./src/build/transaction.js)

- [Resolvers](./resolve)
  - [`sdk.resolveAccounts`](./src/resolve/resolve-accounts.js)
  - [`sdk.resolveParams`](./src/resolve/resolve-params.js)
  - [`sdk.resolveSignatures`](./src/resolve/resolve-signatures.js)
