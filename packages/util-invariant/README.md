```javascript
import {invariant} from "@onflow/util-invariant"

function add(a, b) {
  invariant(typeof a === "number", "add(a, b) -- `a` needs to be a number", { a, b })
  invariant(typeof b === "number", "add(a, b) -- `b` needs to be a number", { a, b })
  return a + b
}
```
