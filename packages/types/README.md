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
```

# Available Types

## UInt

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt) ])
])
```

## Int

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int) ])
])
```

## UInt8

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt8) ])
])
```

## Int8

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int8) ])
])
```

## UInt16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt16) ])
])
```

## Int16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int16) ])
])
```

## UInt32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt32) ])
])
```

## Int32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int32) ])
])
```

## UInt64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt64) ])
])
```

## Int64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int64) ])
])
```

## UInt128

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt128) ])
])
```

## Int128

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int128) ])
])
```

## UInt256

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UInt256) ])
])
```

## Int256

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Int256) ])
])
```

## Word8

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Word8) ])
])
```

## Word16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Word16) ])
])
```

## Word32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Word32) ])
])
```

## Word64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Word64) ])
])
```

## UFix64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.UFix64) ])
])
```

## Fix64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(1, t.Fix64) ])
])
```