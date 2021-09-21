# @onflow/fcl -- scripts

Scripts let you run non-permanent Cadence scripts on the Flow blockchain. They can return data.

They always need to contain a `pub fun main()` function as an entry point to the script.

`fcl.send` is a function that communicates with Access Nodes ([How to configure Access Node](../config)), it takes an array of `builder` functions, that are used to build out an [`interaction`](../../../interaction).

A script is a type of interaction. We can use the `fcl.script` builder, to convert this interaction into a script.

`fcl.script` is a [JavaScript Tagged Template Literal](https://styled-components.com/docs/advanced#tagged-template-literals) that we can pass Cadence code into.

### Sending your first Script

In the following code snippet we are going to send a script to the Flow blockchain.
The script is going to add two numbers, and return them.
We can then pass the response we get back into `fcl.decode` to get back the returned value.

```javascript
import * as fcl from "@onflow/fcl"

var response = await fcl.send([
  fcl.script`
    pub fun main(): Int {
      return 1 + 2
    }
  `
])

var data = await fcl.decode(response)
console.log(data) // 3
```

### A more complicated Script

Things like [Resources](https://docs.onflow.org/docs/cadence#resources) and [Structs](https://docs.onflow.org/docs/cadence#structures) are fairly common place in Cadence.

This next example shows that `fcl.decode` out of the box knows how to convert these types of things.

In the following code snippet, our script defines a struct called `Point`, it then returns a list of them.

The closest thing to a Structure in JavaScript is an object. In this case when we decode this response, we would be expecting to get back an array of objects, where the objects have an `x` and `y` value.

```javascript
import * as fcl from "@onflow/fcl"

var response = await fcl.send([
  fcl.script`
    pub struct Point {
      pub var x: Int
      pub var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    pub fun main(): [Point] {
      return [Point(x: 1, y: 1), Point(x: 2, y: 2)]
    }
  `
])

var data = await fcl.decode(response)
console.log(data) // [{x:1, y:1}, {x:2, y:2}]
```

### Transforming the data we get back with custom decoders.

In our dapp, we probably have a way of representing these Cadence values internally. In the above example it might be a `Point` class.
FCL enables us to provide custom decoders that we can use to transform the data we receive from the Flow blockchain at the edge, before anything else in our dapp gets a chance to look at it.

We add these custom decoders by [Configuring FCL](../config).
This lets us set it once when our dapp starts up and use our normalized data through out the rest of our dapp.

In the below example we will use the concept of a `Point` again, but this time, we will add a custom decoder, that enables `fcl.decode` to transform it into a custom JavaScript `Point` class.

```javascript
import * as fcl from "@onflow/fcl"

class Point {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }
}

fcl.config()
  .put("decoder.Point", point => new Point(point))

var response = await fcl.send([
  fcl.script`
    pub struct Point {
      pub var x: Int
      pub var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    pub fun main(): [Point] {
      return [Point(x: 1, y: 1), Point(x: 2, y: 2)]
    }
  `
])

var data = await fcl.decode(response)
console.log(data) // [Point{x:1, y:1}, Point{x:2, y:2}]
```

We know this can all be fairly overwhelming, we are commited to help though. If you run into any problems, reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are more than happy to help out.
