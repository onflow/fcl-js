# Transitions

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
