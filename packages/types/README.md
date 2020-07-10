# @onflow/types

Translates JavaScript values into equivalent Cadence compatible values.

# Status

- **Last Updated:** July 10 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

# Install

```bash
npm install --save @onflow/types
```

# Usage

```javascript
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

// This is the recommended way of using arguments with types.
sdk.build([
  sdk.transaction`
    transaction(to: Address, amount: UFix64) {
      execute {
        let addr: Address = to
        let value: UFix64 = amount
      }
    }
  `,
  sdk.args([
    // only two arguments
    sdk.arg(to, t.Address),
    sdk.arg(amount, t.UFix64),
  ]),
])

// This is the non-recommended way of using params with types.
sdk.build([
  sdk.transaction`
    transaction {
      execute {
        let to: Address = ${p => p.to}
        let amount: UFix64 = ${p => p.amount}
      }
    }
  `,
  sdk.params([
    // notice the third argument
    sdk.param(to, t.Address, "to"),
    sdk.param(amount, t.UFix64, "amount"),
  ]),
])
```
