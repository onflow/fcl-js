# Query

Programmatically Query Flow. A light, stable and approachable higher level wrapper around the script variant of the FCL/JS-SDK interaction.

> The primary idea here is to make querying the Flow Blockchain more approachable by providing an interface that hides most of the complexity. Eventually this way of querying the chain will be able to pull stored script interactions from on chain repositories of scripts/transactions, this interface provides some initial steps/foundation in that direction.

## Status

- **Last Updated:** Aug 17th 2022
- **Stable:** Yes
- **Risk of Breaking Change:** Low
- **Introduced:** `0.0.68`

## Configuration

`query` requires the usage of FCL configuration in order to operate properly.
You can learn more about configuring FCL here: [Configure FCL](https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx)
Configuration only needs to happen once, but it must happen before query is called. We always recommend configuring FCL as early in your application as possible/reasonable.

The main things you will need to configure is are:
- `accessNode.api` - How to talk to Flow.
- `flow.network` - which network are you on ("mainnet", "testnet", etc).

Below is an example of configuring FCL to talk to Flow (testnet)

```javascript
import * as fcl from "@onflow/fcl"

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("flow.network", "testnet")
```

`query` also respects [Address Replacement](https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx#address-replacement-in-scripts-and-transactions) configuration.
This allows you to write your cadence with placeholder addresses like `0xProfile` and then configure FCL to replace it with an actual address before it executes the query.

If your cadence includes the following import statement:

```javascript
import Profile from 0xProfile
```

And your config includes:

```javascript
fcl.config().put("0xProfile", "0xba1132bc08f82fe2")
```

The import at the time of execution will look like this:

```javascript
import Profile from 0xba1132bc08f82fe2
```

## Basic Usage

We query Flow blockchain by sending cadence scripts to them.
All queries execute (and must include) a public `main` function.
We need to supply this public `main` function to `query` as cadence.

Let's take the following cadence as an example:

> It declares a `main` function that returns a boolean.

```swift
pub fun main(): Bool {
  return true
}
```

We can query Flow using this cadence like so:

```javascript
import * as fcl from "@onflow/fcl"

await fcl.query({
  cadence: `
    pub fun main(): Bool {
      return true
    }
  `,
})
```

## Passing in Arguments

Often when querying Flow you will want to change values in the query based on your code.
When you want to do this Arguments are your friend.

Arguments are ordered and passed into the public `main` function in your cadence.
Each argument, to be valid, needs to include two critical pieces of information: its value and its corresponding cadence type (as specified by the public `main` functions).

> `arguments` is a reserved word in javascript so we use `args`

For the following example we need to pass two numbers and a Flow Address into our query in a way we can use them.
The cadence for our query is going to accept these two numbers and address, log out the address and then return back to us the sum of the two numbers, which would look something like this:

```swift
pub fun main(a: Int, b: Int, addr: Address): Int {
  log(addr)
  return a + b
}
```

Just like before we would pass this to our query function as the `cadence` value, but this time we are also going to include an `args` value, which needs to be a function that returns our arguments in an array ordered by how they are passed into the public `main` function, in this case `[a, b, addr]`.
The function will be passed two values (`arg` and `t`) for us to construct our return value in a way that FCL understands.
The first value is a function called `arg`, it is going to take our value and our type and build out the underlying argument.
The second value is an object that includes a corresponding type constructor for every valid cadence type we can pass in as an argument.
Writing it out in text makes it so much more complicated than it is, just remember we need to tell the query the order of the arguments (the array) and the type of each argument (`t`), that requires a special data structure that you shouldn't need to care about so that is hidden in a function (`arg`).

As an example lets look at our first argument passed into the public `main` function (`a: Int`), and say we want its value to be `7`.
Because it is the first argument, it should be the first argument returned in the array.
Also it has a type of `Int`, so we will need to use `t.Int` to say what type is should be.

We could then construct the argument like so: `arg(7, t.Int)`.

Our second argument, (say we want it to be `6`) is going to be very similar, the primary exceptions being its value and the fact it should be the second argument in the returned array.
So something like this: `arg(6, t.Int)`.

Our third argument, an address this time (we want it to have a value of: `0xba1132bc08f82fe2`), should be the third element in the array and use the `t.Address`, so: `arg("0xba1132bc08f82fe2", t.Address)`

When we put them all together our args function needs to return:

```javascript
;[
  arg(7, t.Int), // a: Int
  arg(6, t.Int), // b: Int
  arg("0xba1132bc08f82fe2", t.Address), // addr: Address
]
```

To bring all this together our query will look like this:

```javascript
import * as fcl from "@onflow/fcl"

await fcl.query({
  cadence: `
    pub fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg("0xba1132bc08f82fe2", t.Address), // addr: Address
  ],
})
```

## A more real world example

The above examples are a bit contrived. We tried to distill things down to convey the concepts, but in practice those examples are a bit useless because you could just do them in javascript.
The following example should hopefully highlight a bit better what is possible. In this example we are going to point FCL at testnet, and use a profile contract that is deployed there to query a couple Flow accounts that may or may not have Profile resources.

The first thing we need to do is to configure FCL, as mentioned above this only needs to happen once before we make our first query. In this case we are wanting two configurations values, the access node api and the profile contract address.

```javascript
import * as fcl from "@onflow/fcl"

// prettier-ignore
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("0xProfile", "0xba1132bc08f82fe2")
```

Now that things are configured we can query Flow.

```javascript
import * as fcl from "@onflow/fcl"

// prettier-ignore
await fcl.query({
  cadence: `
    import Profile from 0xProfile

    pub fun main(addresses: [Address]): {Address: Profile.ReadOnly} {
      return Profile.readMultiple(addresses)
    }
  `,

  args: (arg, t) => [
    arg(["0xba1132bc08f82fe2", "0xf76a4c54f0f75ce4", "0xf117a8efa34ffd58"], t.Array(t.Address))
  ]
})
```

Which should return something like this:

> Please note that `0xf117a8efa34ffd58` isn't included because it doesn't have a profile resource.

```javascript
{
  0xba1132bc08f82fe2: {
    address: "0xba1132bc08f82fe2",
    name: "qvvg",
    avatar: "https://i.imgur.com/r23Zhvu.png",
    color: "tomato",
    info: "Flow Core Team. Creator and Maintainer of FCL and the flow-js-sdk.",
    verified: true
  },
  0xf76a4c54f0f75ce4: {
    address: "0xf76a4c54f0f75ce4",
    name: "Jeff Doyle",
    avatar: "https://avatars.onflow.org/avatar/jeffdoyle",
    color: "#00d9ff",
    info: "Hi, I am Jeff. You know it's me, because I am the only verified Jeff. Jeff!",
    verified: true
  }
}
```

## Interaction Templates

If you have an Interaction Template, you can use it with `query`:

### Using Template JSON 

```javascript
import * as fcl from "@onflow/fcl"
import myScriptTemplate from "script-template.json"

const scriptResult = await fcl.query({
  template: myScriptTemplate,
})
```

### Using Template URL 

In place of a JSON template, you can specify a URL that points to one, and FCL will retrieve it from the remote location:

```javascript
import * as fcl from "@onflow/fcl"

const scriptResult = await fcl.mutate({
  template: "https://interactions.my-project.com/read-nft",
})
```

`query` will use the Interaction Template to carry out it's underlying script. Read more on Interaction Templates with FCL [here](https://github.com/onflow/fcl-js/blob/master/docs/reference/interaction-templates.mdx)

