# Transitions

## 0007 Deprecate Opts First Arg Latest Block

- **Date:** Feb 2nd 2021
- **Type:** Deprecation of options as first arguemnt to latestBlock

For JS-SDK versions 0.0.44 and below, getting the latest block looked like this:

```javascript
let options = {...}

await sdk.latestBlock(options)
```

Getting the latest block now works slightly differently. If you wish to get the latest block, you must now pass in arguments
like such:

```javascript
let options = {...}
let isSealed = false

await sdk.latestBlock(isSealed, options)
```

The first argument to `latestBlock` must be a boolean specifying if the latest block must be sealed or not, followed by send options
as the second argument.

We reccomend migrating your code to the new format as soon as you can. In future versions of the JS-SDK, `latestBlock` may
cease to accept options as the first argument.

## 0006 Deprecate Get Latest Block Builder

- **Date:** Feb 2nd 2021
- **Type:** Deprecation of getLatestBlock Builder

For JS-SDK versions 0.0.44 and below, getting the latest block looked like this:

```javascript
await sdk.send(sdk.build([
  sdk.getLatestBlock()
]).then(sdk.decode)
```

Getting the latest block now works slightly differently. If you wish to get the latest block, you must now use the
`getBlock` builder like such:

```javascript
let isSealed = false

await sdk.send(sdk.build([
  sdk.getBlock(isSealed)
]).then(sdk.decode)
```

You can optionally specify if you require the latest block to be sealed or not by passing in an isSealed boolean as the first
arguement to the `getBlock` builder.

We reccomend migrating your code to the new format as soon as you can. In future versions of the JS-SDK, the `getLatestBlock` builder
may cease to exist.

## 0005 Deprecate Start End Get Events Builder

- **Date:** Feb 2nd 2021
- **Type:** Deprecation of getEvents Builder

For JS-SDK versions 0.0.44 and below, getting events in a block height range looked something like this:

```javascript
await sdk.send(sdk.build([
  sdk.getEvents("MyEvent", 123, 456)
]).then(sdk.decode)
```

Getting events now works slightly differently. If you wish to get events in a block height range, you must now use the
`getEventsAtBlockHeightRange` builder like such:

```javascript
await sdk.send(sdk.build([
  sdk.getEventsAtBlockHeightRange("MyEvent", 123, 456)
]).then(sdk.decode)
```

If you wish to get events in a selection of blocks specified by block ids, you can now use the `getEventsAtBlockIds` builder
like such:

```javascript
await sdk.send(sdk.build([
  sdk.getEventsAtBlockIds("MyEvent", [
    "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
    "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f"
  ])
]).then(sdk.decode)
```

We reccomend migrating your code to the new format as soon as you can. In future versions of the JS-SDK, the `getEvents` builder
may cease to exist.

## 0004 Deprecate Get Block By Id Builder

- **Date:** Feb 2nd 2021
- **Type:** Deprecation of getBlockById Builder

For JS-SDK versions 0.0.44 and below, getting a block at a specific block id looked something like this:

```javascript
await sdk.send(sdk.build([
  sdk.getBlockById("c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7")
]).then(sdk.decode)
```

Moving forward, getting a block by a specific block id will work by specifying that you want to get a block, and then the block id
of the block you wish to get like such:

```javascript
await sdk.send(sdk.build([
  sdk.getBlock(),
  sdk.atBlockId("c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7")
]).then(sdk.decode)
```

We reccomend migrating your code to the new format as soon as you can. In future versions of the JS-SDK, the `getBlockById` builder
may cease to exist.

## 0003 Deprecate Get Block By Height Builder

- **Date:** Feb 2nd 2021
- **Type:** Deprecation of getBlockByHeight Builder

For JS-SDK versions 0.0.44 and below, getting a block at a specific block height looked something like this:

```javascript
await sdk.send(sdk.build([
  sdk.getBlockByHeight(123)
]).then(sdk.decode)
```

Moving forward, getting a block by a specific block height will work by specifying that you want to get a block, and then the block height
of the block you wish to get like such:

```javascript
await sdk.send(sdk.build([
  sdk.getBlock(),
  sdk.atBlockHeight(123)
]).then(sdk.decode)
```

We reccomend migrating your code to the new format as soon as you can. In future versions of the JS-SDK, the `getBlockByHeight` builder
may cease to exist.

## 0002 Deprecate Resolve Params Resolver

- **Date:** Sept 29th 2020
- **Issue:** [#177](https://github.com/onflow/flow-js-sdk/issues/177)
- **Type:** Deprecation of resolveParams Resolver

At the time of writing this if you are writing script and transaction interactions and building up your resolvers yourself you will likely have a piece of code that looks something like this.

```javascript
import * as sdk from "@onflow/sdk"

sdk.resolve(ix, [
  sdk.resolveParams,
])
```

We are introducing a more generic resolver that covers core cadence concepts: `@onflow/sdk-resolve-cadence`.
The above code using `sdk.resolveParams` will still work for now as a proxy to `@onflow/sdk-resolve-cadence` (with deprecation notice), but we can't promise it will stay around for ever in the future.

Instead we would recommend that you use the following in its place:

```javascript
import * as sdk from "@onflow/sdk"
import {resolveCadence} from "@onflow/sdk-resolve-cadence"

sdk.resolve(ix, [
  resolveCadence,
])
```

As part of our ongoing effort to break the sdk down into smaller and smaller pieces, at this time we are not considering adding in an `sdk.resolveCadence`.

## 0001 Deprecate Params

- **Date:** July 22nd 2020
- **Issue:** [#177](https://github.com/onflow/flow-js-sdk/issues/177)
- **Type:** Deprecation of Certain Functionality

A common way of getting values from our javascript into our cadence code has been like this:

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

const doTheThing = async (a, b, msg) => {
  const response = await fcl.send([
    fcl.script`
      pub fun main(): Int {
        log("${p => p.msg}")
        return ${p => p.a} + ${p => p.b}
      }
    `,
    fcl.params([
      fcl.param(5, t.Identity, "a"),
      fcl.param(6, t.Identity, "b"),
      fcl.param("hmm", t.Identity, "msg"),
    ]),
  ])

  return fcl.decode(response)
}
```

Where `a` and `b` are integers in the users control, and `msg` is a string in the applications control.

We have a couple issues with this, which are better listed out (here)[https://github.com/onflow/flow-js-sdk/issues/177], which is leading us to modify a couple parts of this functionality.

With the addition of `Arguments` in the Cadence code we would prefer the above to be written like this:

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

const doTheThing = async (a, b, msg) => {
  const response = await fcl.send([
    fcl.script`
      pub fun main(a: Int, b: Int): Int {
        log("${msg}")
        return a + b
      }
    `,
    fcl.args([fcl.arg(5, t.Int), fcl.arg(6, t.Int)]),
  ])

  return fcl.decode(response)
}
```

Once again, where `a` and `b` are values the user controls, and `msg` is a value that the application controls.

**Arguments also work with transactions**

You might have something like this before:

```javascript
const doTheThing = async (m1, m2, m3) => {
  const response = await fcl.send([
    fcl.transaction`
      transaction {
        execute {
          log("${p => p.m1}")
          log("${p => p.m2}")
          log("${p => p.m3}")
        }
      }
    `,
    fcl.params([
      fcl.param(m1, t.Identity, "m1"),
      fcl.param(m2, t.Identity, "m2"),
      fcl.param(m3, t.Identity, "m3"),
    ]),
    // ...payer/authorizations/proposer
  ])
}
```

With arguments you can do it like this:

```javascript
const doTheThing = async (m1, m2, m3) => {
  const response = await fcl.send([
    fcl.transaction`
      transaction(m1: String, m2: String, m3: String) {
        execute {
          log(m1)
          log(m2)
          log(m3)
        }
      }
    `,
    fcl.args([
      fcl.arg(m1, t.String),
      fcl.arg(m2, t.String),
      fcl.arg(m3, t.String),
    ]),
    // ...payer/authorizations/proposer
  ])
}
```

**Some things to be aware of:**

Import addresses have to be done as standard interopolation.

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

const doTheThing = async barId => {
  const response = await fcl.send([
    fcl.script`
      import Foo from ${CONTRACT_ADDRESS}

      pub fun main(id: UFix64): Foo.Bar {
        return Foo.getBarWithId(id: id)
      }
    `,
    fcl.args([fcl.arg(barId, t.UFix64)]),
  ])

  return fcl.decode(response)
}
```
