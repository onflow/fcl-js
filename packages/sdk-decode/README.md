# sdk-decode

The `decode` function takes the return value (`response`) of a `send` function and returns the information you probably want, in the formats you probably want.

It understands how to transform cadence values into javascript and allows you to overload those transformations for your own if you want with custom decoders.

# Examples

For the following examples these are the imports

```javascript
import * as fcl from "@onflow/fcl"
import {config} from "@onflow/config"
import {decode} from "@onflow/sdk-decode"
```

### Decode script return value

```javascript
var v1 = await fcl.send([
  fcl.script`
    pub fun main(): Int {
      return 5 + 6
    }
  `
]).then(decode)

console.assert(v1 === 11)
```

### Cast script return value to application domain type at edge

Somewhere central in your application you can configure the decode function with custom decoders.
It only needs to exist once and needs to happen before your script is called.

```javascript
class Point {
  constructor({x, y}) {
    this.x = x
    this.y = y
  }
}

config()
  .put("decoder.Point", async point => new Point(point))
```

Then your script can be something like this.

```javascript
var v2 = await fcl.send([
  fcl.script`
    pub struct Point {
      pub var x: Int
      pub var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    pub fun main(): Point {
      return Point(x: 5, y: 8)
    }
  `
]).then(decode)

console.assert(v2 instanceof Point)
console.assert(v2.x === 5)
console.assert(v2.y === 8)
```
