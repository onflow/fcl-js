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

## Transactions

```javascript
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

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
    sdk.arg(to, t.Address),
    sdk.arg(amount, t.UFix64),
  ]),
])
```

## Scripts

```javascript
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

sdk.build([
  sdk.script`
    pub fun main(a: Int, b: Int): Int {
      return a + b
    }
  `,
  sdk.args([
    sdk.arg(1, t.Int),
    sdk.arg(2, t.Int),
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
  sdk.args([ sdk.arg(8, t.UInt8) ])
])
```

## Int8

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(8, t.Int8) ])
])
```

## UInt16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(16, t.UInt16) ])
])
```

## Int16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(16, t.Int16) ])
])
```

## UInt32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(32, t.UInt32) ])
])
```

## Int32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(32, t.Int32) ])
])
```

## UInt64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(64, t.UInt64) ])
])
```

## Int64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(64, t.Int64) ])
])
```

## UInt128

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(128, t.UInt128) ])
])
```

## Int128

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(128, t.Int128) ])
])
```

## UInt256

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(256, t.UInt256) ])
])
```

## Int256

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(256, t.Int256) ])
])
```

## Word8

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(8, t.Word8) ])
])
```

## Word16

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(16, t.Word16) ])
])
```

## Word32

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(32, t.Word32) ])
])
```

## Word64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(64, t.Word64) ])
])
```

## UFix64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("64.123", t.UFix64) ])
])
```

## Fix64

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("64.123", t.Fix64) ])
])
```

## String

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("Flow", t.String) ])
])
```

## Character

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("c", t.Character) ])
])
```

## Bool

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(true, t.Bool) ])
])
```

## Address

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("0xABC123DEF456", t.Address) ])
])
```

## Void

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(null, t.Void) ])
])
```

## Optional

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg("Flow", t.Optional(t.String)) ])
])

sdk.build([
  sdk.args([ sdk.arg(null, t.Optional(t.String)) ])
])
```

## Reference

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg({address: "0xABC123DEF456", type: "0xABC123DEF456.CryptoKitty"}, t.Reference) ])
])
```

## Array

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ sdk.arg(["First", "Second"], t.Array(t.String)) ])
])

sdk.build([
  sdk.args([ sdk.arg(["First", 2], t.Array([t.String, t.Int])) ])
])
```

## Dictionary

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ 
    sdk.arg(
      [
        {key: 1, value: "one"},
        {key: 2, value: "two"},
      ],
      t.Dictionary([
        {key: t.Int, value: t.String},
        {key: t.Int, value: t.String},
      ])
    ) 
  ])
])

sdk.build([
  sdk.args([ 
    sdk.arg(
      {key: 1, value: "one"},
      t.Dictionary({key: t.Int, value: t.String})
    ) 
  ])
])
```

## Struct

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ 
    sdk.arg(
      {
        fields: [{name: "CryptoKitty_name", value: "Lil' Jimmy The CryptoKitty"}],
      },
      t.Struct("0xABC123DEF456.CryptoKitty", [{value: t.String}])
    ) 
  ])
])
```

## Event

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ 
    sdk.arg(
      {
        fields: [{name: "wasTheCodeClean?", value: "absolutely"}],
      },
      t.Event("0xABC123DEF456.JeffWroteSomeJS", [{value: t.String}]),
    ) 
  ])
])
```

## Resource

```javascript
import * as t from "@onflow/types"

sdk.build([
  sdk.args([ 
    sdk.arg(
      {
        fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}],
      }
      t.Resource("0x01.Jeffysaur", [{value: t.String}]),
    ) 
  ])
])
```