# @onflow/config

Reactive configuration for Flow JS SDK and FCL

## Installation

```bash
npm install @onflow/config
```

## Usage

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

// Get a config value (it's async)
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

## Loading flow.json

Before loading a `flow.json`, you must set the network:

```javascript
import { config } from "@onflow/config"

// Set network (required before loading flow.json)
config().put("flow.network", "testnet")

// Load flow.json
await config().load({ flowJSON: require('./flow.json') })
```

## Import Aliases

Import aliases allow you to deploy the same contract to multiple addresses with different names, enabling version management and multi-instance deployments.

### flow.json Configuration

```json
{
  "contracts": {
    "FUSD": {
      "source": "./contracts/FUSD.cdc",
      "aliases": {
        "testnet": "0x9a0766d93b6608b7"
      }
    },
    "FUSD1": {
      "source": "./contracts/FUSD.cdc",
      "aliases": {
        "testnet": "0xe223d8a629e49c68"
      },
      "canonical": "FUSD"
    }
  }
}
```

### How It Works

When `config.load(flowJSON)` is called:

1. **Contract addresses are extracted** based on the current network
2. **Canonical references are extracted** from the `canonical` field
3. **Values are stored in config**:
   ```typescript
   system.contracts.FUSD = "0x9a0766d93b6608b7"
   system.contracts.FUSD1 = "0xe223d8a629e49c68"
   system.contracts.FUSD1.canonical = "FUSD"
   ```

### Import Resolution

When resolving Cadence imports:

- `import "FUSD"` → `import FUSD from 0x9a0766d93b6608b7` (no canonical)
- `import "FUSD1"` → `import FUSD as FUSD1 from 0xe223d8a629e49c68` (with canonical)

The `canonical` field tells the resolver that `FUSD1` is an alias of the `FUSD` contract, so it generates the `import X as Y` syntax.

### Use Cases

**Multiple Versions:**
```json
{
  "contracts": {
    "FungibleToken": {
      "source": "./contracts/FungibleToken.cdc",
      "aliases": { "testnet": "0xf233dcee88fe0abe" }
    },
    "FungibleTokenV2": {
      "source": "./contracts/FungibleToken.cdc",
      "aliases": { "testnet": "0x9a0766d93b6608b7" },
      "canonical": "FungibleToken"
    }
  }
}
```

**Multiple Instances:**
```json
{
  "contracts": {
    "Token1": {
      "source": "./contracts/Token.cdc",
      "aliases": { "testnet": "0x1111" },
      "canonical": "Token"
    },
    "Token2": {
      "source": "./contracts/Token.cdc",
      "aliases": { "testnet": "0x2222" },
      "canonical": "Token"
    }
  }
}
```

### Dependencies

The `canonical` field also works with dependencies:

```json
{
  "dependencies": {
    "FungibleTokenV2": {
      "source": "mainnet://f233dcee88fe0abe.FungibleToken",
      "hash": "abc123...",
      "aliases": {
        "testnet": "0xf233dcee88fe0abe"
      },
      "canonical": "FungibleToken"
    }
  }
}
```

## Known Configuration Values

### Access Node

- `accessNode.api` _(default: emulator url)_ -- Where FCL will communicate with the Flow blockchain.
- `accessNode.key` _(default: null)_ -- Some Access Nodes require an API key.

```javascript
import {config} from "@onflow/fcl"

if (process.env.NODE_ENV === "production") {
  config()
    .put("accessNode.api", process.env.ACCESS_NODE_API)
    .put("accessNode.key", process.env.ACCESS_NODE_KEY)
}
```

### Decode

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

### Wallets

`wallet.discovery` _(default: FCL wallet discovery service url)_ -- Where FCL will attempt to authenticate

```javascript
import {config} from "@onflow/fcl"

if (process.env.NODE_ENV === "development") {
  // Use dev wallet during development
  config()
    .put("discovery.wallet", "http://localhost:8701/flow/authenticate")
}
```

## API Reference

### `config()`

Returns the config instance.

### `config().put(key, value)`

Sets a configuration value. Can be chained.

### `config().get(key, fallback?)`

Gets a configuration value, optionally with a fallback. Returns a Promise.

### `config().update(key, updateFn)`

Updates a configuration value using a function that receives the old value.

### `config().load({ flowJSON })`

Loads contract addresses and canonical references from a flow.json file.

**Parameters:**
- `flowJSON`: Flow JSON object or array of Flow JSON objects

**Requirements:**
- `flow.network` must be set before calling `load()`

### `config().delete(key)`

Deletes a configuration value.

### `config().all()`

Returns all configuration values as an object.

### `config().where(pattern)`

Returns configuration values matching a regex pattern.

### `config().subscribe(callback)`

Subscribes to configuration changes. Returns an unsubscribe function.

## See Also

- [Flow CLI Documentation](https://developers.flow.com/tools/flow-cli)
- [Flow JavaScript SDK](https://developers.flow.com/tools/fcl-js)
- [flow.json Configuration](https://developers.flow.com/tools/flow-cli/flow.json)
