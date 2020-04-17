# @onflow/sdk

A collection of modules that make interacting with [Flow](https://onflow.org) easier.

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
  sdk.params([
    sdk.param(5, t.UFix64, "a"),
    sdk.param(6, t.UFix64, "b"),
  ])
])

const ixResolved = await sdk.resolve(ixBuild, [
  sdk.resolveParams,
])

const response = await sdk.send(ixResolved, {
  node: "accessNode url",
})

const result = await sdk.decodeResponse(response, {
  UFix64: v => BigInt(v),
})

console.log(result === 11n) // true
```

# Exposes

- [Top Level](./)
  - [`sdk.build`](./build)
  - [`sdk.resolve`](./resolve)
  - [`sdk.send`](../send)
  - [`sdk.decode`](../decode)
  - [`sdk.decodeResponse`](../decode)

- [Utils](../interaction)
  - [`sdk.isOk`](../interaction)
  - [`sdk.isNope`](../interaction)
  - [`sdk.why`](../interaction)
  - [`sdk.pipe`](../interaction)

- [Builders](./build)
  - [`sdk.authorizations` & `sdk.authorization`](./build/authorizations.js)
  - [`sdk.getAccount`](./build/get-account.js)
  - [`sdk.getEvents`](./build/get-events.js)
  - [`sdk.getLatestBlock`](./build/get-latest-block.js)
  - [`sdk.getTransaction`](./build/get-transaction.js)
  - [`sdk.limit`](./build/limit.js)
  - [`sdk.nonce`](./build/nonce.js)
  - [`sdk.params` & `sdk.param`](./build/params.js)
  - [`sdk.payer`](./build/payer.js)
  - [`sdk.ping`](./build/ping.js)
  - [`sdk.ref`](./build/ref.js)
  - [`sdk.script`](./build/script.js)
  - [`sdk.transaction`](./build/transaction.js)

- [Resolvers](./resolve)
  - [`sdk.resolveAuthorizations`](./resolve/resolve-authorizations.js)
  - [`sdk.resolveParams`](./resolve/resolve-params.js)
  - [`sdk.resolvePayload`](./resolve/resolve-payload.js)
