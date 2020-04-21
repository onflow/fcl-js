# @onflow/sdk

A collection of modules that make interacting with [Flow](https://onflow.org) easier.

# Status

- **Last Updated:** April 21st 2020
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
const builtTxIx = await sdk.build([
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer("01", 0, seqNum),
  sdk.transaction`transaction { prepare(acct: AuthAccount) {} execute { log("Hello") } }`,
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
])
```

## Example: Resolving A Transaction Interaction

Once a transaction interaction is built, it's still not quite ready to be sent to the Access Node. To further prepare it to be ready to be sent to the Access Node, you must resolve it by piping it through a series of resolvers. Resolvers are functions that consume an interaction and attempt to fill in or prepare any missing pieces of it to get it ready to be sent to the Access API. The example below highlights one way to resolve a transaction interaction:

```javascript
const resolvedTxIx = await sdk.pipe(builtTxIx, [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ])
)
```
## Example: Sending A Transaction Interaction

Now that your transction interaction is resolved, it can be sent to an Access Node! To send it to an Access Node, you must call `sdk.send(...)` with that interaction, and a configuration object. To specify which Access Node to send your request to, you specify it in the _node_ parameter of the config object. For example, the code below shows how to send your transaction interaction to the Flow Emulator running on _localhost:8080_:

```javascript
const response = await sdk.send(resolvedTxIx, { node: "http://localhost:8080" })
```

## Using the rest of the SDK

The SDK additionally supplies builders to construct interactions of many different types to interact with the Access Node's various APIs. 

Please reference the provided example project `react-simple` for example code.

### GetAccount

```javascript
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.getAccount(addr)
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### GetEvents

```javascript
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.getEvents(eventType, startBlock, endBlock),
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### GetLatestBlock

```javascript
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.getLatestBlock()
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### GetTransactionStatus

```javascript
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.getTransactionStatus(txId)
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### Ping

```javascript
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.ping()
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### Script

```javascript 
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.params([sdk.param("foo", "bar")]),
  sdk.script`
    pub fun main(): Int {
      log("${p => p.foo}")
      return 7
    }
  `,
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })
```

### Transaction

```javascript
const acctResponse = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.getAccount("01")
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ]),
]), { node: "http://localhost:8080" })

const seqNum = acctResponse.account.keys[0].sequenceNumber

const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer("01", 0, seqNum),
  sdk.transaction`transaction { prepare(acct: AuthAccount) {} execute { log("Hello") } }`,
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
]), [
  sdk.resolve([
    sdk.resolveParams,
    sdk.resolveAuthorizations,
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
  - [`sdk.resolveAuthorizations`](./src/resolve/resolve-authorizations.js)
  - [`sdk.resolveParams`](./src/resolve/resolve-params.js)
