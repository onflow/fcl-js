```javascript

import {parseArguments} from "@onflow/cadence-parser"

const cadence = `
  pub fun main(name: String, age: UInt8) {
  ...
  }
`

console.log(parseArguments(cadence)) // [{ name: "name", type: "String" }, { name: "age", type: "UInt8" }]

```
