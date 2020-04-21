# @onflow/sdk

A collection of modules that make interacting with [Flow](https://onflow.org) easier.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

This package is wworking and in active delveopment, breaking changes may happen.

# Install

```bash
npm install --save @onflow/sdk
```

# Usage

```javascript
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const ixBuilt = await sdk.build([
  sdk.script`
    pub fun main(): UFix64 {
      let a = ${p => p.a}
      let b = ${p => p.b}
      return a + b
    }
  `,
  sdk.params([sdk.param(5, t.UFix64, "a"), sdk.param(6, t.UFix64, "b")]),
])

const ixResolved = await sdk.resolve(ixBuild, [sdk.resolveParams])

const response = await sdk.send(ixResolved, {
  node: "https://...accessNodeUrl...",
})

const result = await sdk.decodeResponse(response, {
  UFix64: v => BigInt(v),
})

console.log(result === 11n) // true
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
  - [`sdk.nonce`](./src/build/nonce.js)
  - [`sdk.params` & `sdk.param`](./src/build/params.js)
  - [`sdk.payer`](./src/build/payer.js)
  - [`sdk.ping`](./src/build/ping.js)
  - [`sdk.ref`](./src/build/ref.js)
  - [`sdk.script`](./src/build/script.js)
  - [`sdk.transaction`](./src/build/transaction.js)

- [Resolvers](./resolve)
  - [`sdk.resolveAuthorizations`](./src/resolve/resolve-authorizations.js)
  - [`sdk.resolveParams`](./src/resolve/resolve-params.js)
  - [`sdk.resolvePayload`](./src/resolve/resolve-payload.js)
