# @onflow/types

Translates javascript values into equivalent Cadence compatible values.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** No
- **Risk of Breaking Change:** Very Very High

At the time of writing this only an identity type exists, there are so many more to add.

Known Upcoming Changes:

- We need to add a whole heap of types here...

# Install

```bash
npm install --save @onflow/types
```

# Usage

```javascript
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

// This is the recommended way of using params.
// Unfortunately this isnt supported yet by the access nodes.
sdk.build([
  sdk.transaction`
    transaction(to: Address, amount: UFix64) {
      execute {
        let addr: Address = to
        let value: UFix64 = amount
      }
    }
  `,
  sdk.params([
    // only two arguments
    sdk.param(to, t.Address),
    sdk.param(amount, t.UFix64),
  ]),
])

// This is the non-recommended way of using params.
// Unfortunately this is the only way we can do it right now.
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
