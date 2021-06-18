# config

Reactive configuration for Flow JS SDK and FCL

# Status

- **Status Last Updated:** June 16th 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Low

# Overview

- [Usage](#usage)
- [Configurations](#configurations)
  - [Access Node](#access-node)
  - [Decode](#decode)
  - [Wallets](#Wallets)

# Usage

```javascript
import {config} from "@onflow/sdk"

// Reactively subscribe to config changes
config().subscribe(configData => console.log("CONFIG", configData))

// Set a config value
config().put("foo", "bar")

// .put can be chained
config()
  .put("foo", "bar")
  .put("baz", "rawr")

// Get a config value (its async)
var configValue = await config().get("woot")
console.log(configValue) // undefined

// A fallback can be supplied for .get
var configValue = await config().get("woot", "fallback")
console.log(configValue) // "fallback"

config.put("woot", "woot")
var configValue = await config().get("woot", "fallback")
console.log(configValue) // "woot"

// Update a config value
config().put("count", 1)
var count = await config().get("count", 0)
console.log(count) // 1

config().update("count", oldValue => oldValue + 1)
var count = await config().get("count", 0)
console.log(count) // 2

// Delete a config value
config().delete("woot")
var configValue = await config().get("woot", "fallback")
console.log(configValue) // "fallback"

// Configs that match a pattern
config()
  .put("scope.A", 1)
  .put("scope.B", 1)

var scopeValues = await config().where(/^scope\.\s+/)
console.log(scopeValues) // { "scope.A": 1, "scope.B": 2 }
```

# Configurations

Known configuration values in FCL

## Access Node

- `accessNode.api` _(default: emulator url)_ -- Where FCL will used to communicate with the Flow blockchain.
- `accessNode.key` _(default: null)_ -- Some Access Nodes require an api key.

```javascript
import {config} from "@onflow/fcl"

if (process.env.NODE_ENV === "production") {
  config()
    .put("accessNode.api", process.env.ACCESS_NODE_API)
    .put("accessNode.key", process.env.ACCESS_NODE_KEY)
}
```

## Decode

> See [`fcl.decode`](../decode) for more details on decode.

`decoder.*` -- Custom decoders for parsing JSON-CDC

```javascript
import {config, query} from "@onflow/fcl"

function Woot({x, y}) {
  this.x = x
  this.y = y
}

config()
  .put("decoder.Woot", woot => new Woot(woot))

var data = await fcl.query({
  cadence: `
    pub struct Woot {
      pub var x: Int
      pub var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    pub fun main(): [Woot] {
      return [Woot(x: 1, y: 2), Woot(x: 3, y: 4), Woot(x: 5, y: 6)]
    }
  `
})

console.log(data) // [ Woot{x:1, y:2}, Woot{x:3, y:4}, Woot{x:5, y:6} ]
```

## Wallets

> See [`fcl.currentUser`](../current-user) for more details on authentication.

`wallet.discovery` _(default: FCL wallet discovery service url)_ -- Where FCL will attempt to authenticate

```javascript
import {config} from "@onflow/fcl"

if (process.env.NODE_ENV === "development") {
  // Use dev wallet during development
  config()
    .put("discovery.wallet", "http://localhost:8701/flow/authenticate")
}
```
