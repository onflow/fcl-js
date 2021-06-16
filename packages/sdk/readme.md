---
title: SDK
description: A collection of modules that make interacting with Flow easier
---



## Status

- **Last Updated:** August 13th 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

This package is working and in active development, breaking changes may happen.

## Install

```bash
npm install --save @onflow/sdk
```

## Flow JS-SDK

#### Introduction

Welcome, we're glad you're here.

The Flow JS-SDK is a relatively low-level suite of tools that allow JavaScript applications to interact with the Flow Blockchain.

In doing so, the Flow JS-SDK employs several concepts which empower developers to create, and operate upon what we call _Interactions_ that can be sent to the Flow Blockchain, and what we call _Responses_ that are returned from the Flow Blockchain.

Interactions have a Type, which tells the Flow JS-SDK itself how to react to preparing, operating upon and sending this specific interaction. Types of Interactions include, Get Account, Execute Script, Execute Transaction, Get Events, Get Latest Block and Get Transaction Status.

Futher in this document we will outline how to create such Interactions for use in your JavaScript applications, and how to deal with the Responses that the Flow Blockchain returns.

## Phases

Conceptually, there are four phases to the Flow JS-SDK.

Build -> Resolve -> Send -> Decode

We will walk through each phase to exaplain how it is relevant for your applications and how you use the Flow JS-SDK.

## Build

Build is the phase of your use of the Flow JS-SDK where you _Build_ up a specific interaction. During this phase you specify upon an interaction what information you currently know. This may include the specific Cadence code for a Script you wish to execute, or the address for the Account of which you wish to get. As you specify information, the type of the interaction you are composing becomes clear. For example, if you Build an interaction and specify that you want to get an account for a specific address, you are composing an interaction of type Get Account.

The Flow JS-SDK exposes what we call a _build_ function, and a suite of _builder_ functions. The build function consumes as its argument an array of builder functions within it. Each builder function consumes information that you know, and that you want to place into the interaction.

Example 1
    : Building an Execute Script Interaction
```javascript
import * as sdk from "@onflow/sdk"

const interaction = await sdk.build([
   sdk.script`
       pub fun main(): Int {
           return 721
       }
   `
])
```

In Example 1, we're composing an Execute Script Interaction, because we have built an interaction and specified a Script Cadence code within it using the sdk.script builder.

Example 2
    : Building an Execute Get Account Interaction
```javascript
import * as sdk from "@onflow/sdk"

const interaction = await sdk.build([
   sdk.getAccount("123ABC456DEF")
])
```

In Example 2, we're composing a Get Account Interaction, because we have built an interaction and specified an address within it using the sdk.getAccount builder.

## Build - Transactions

On Flow, you can also execute transactions. Transaction Interactions can be built as well using the Flow JS-SDK. Transaction Interactions require a few pieces of information when they're being built. They require, the Cadence Code for the Transaction, any arguments that the Transaction Requires, a Proposer for the Transaction, a Payer for the Transaction and a list of Authorizers for the transaction.

The Proposer of the transaction represents the Account on Flow for which one of it's keys will have its sequence number incremented by the transaction.

The Payer of the transaction represents the Account on Flow for which will pay for the transaction.

Each Authorizer of the transaction represents an Account on Flow which consents to have it's state modified by this transaction.

The builders for the Proposer, Payer and each Authorizer consume an _authorization_ which is built using its own builder function. An authorization is a data structure which is constructed by providing an Address, Signing Function and a keyId, and optionally a sequence number (more on this later).

The Address for an Authorization corresponds to the address for the Flow Account this authorization represents. The Signing Function is a function which can produce a Signature for a transaction on behalf of the specified account. The keyId represents the id of the key on the Account which needs to be used to produce the Signature for a transaction. An Authorization also optionlly takes a sequence number, which is the sequence number for the key corresponding to the keyId of the Flow Account this authorization represents, if this authroization is for a proposer. (Again, more on this later. Observe how we choose not to provide this piece of information in Example 3, this decision will be explained later).

Example 3
    : Building a Transaction Interaction
```javascript
import * as sdk from "@onflow/sdk"

const signingFunction = (...) => {
    ...
    return signature
}

const interaction = await sdk.build([
    sdk.transaction`transaction() { prepare(acct: AuthAccount) {} execute { log("Hello, Flow!") } }`,
    sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
])
```

In Example 3, we build a Transaction Interaction by building an interaction and specifying transaction code, a payer, proposer and list of authorizers using their corresponding builder functions. Inside the payer, proposer and each authorizer, we call the authorization builder function and provide the required address, signing function and keyId that will be used in that authorization.

## Resolve

After Build, the next phase of use of the JS-SDK is the Resolve phase. During Build, we specified onto the the Interaction we're building the information that we currently know. Things like the Cadence Code we wish to have executed for a Script Interaction or Transaction Interaction, or the authroizations for a payer or proposer, or the address of the account we wish for get for a Get Account Interaction.

Some things, however, we don't know. For example, when developing your dApp, you don't know the signature that will be produced when a user signs a transaction. You don't know the specific encoding that your Interaction needs to be in, or maybe you don't yet know the sequence number for a transactions proposer authorization. All of these things need to be discovered, produced or conceptually _resolved_ before your Interaction can be sent to the Flow Blockchain.

This is where the _Resolve_ phase comes in. Resolve takes your built interaction containing all the information you do know and does it's best to get it into a position where it can be sent to the Flow Blockchain. The Flow JS-SDK comes with several _resolver_ functions that your dApp can use to do just this.

Example 4
    : Building an Execute Script Interaction
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const builtInteraction = await sdk.build([
    sdk.script`
        pub fun main(msg: String): String {
            return "Hello, Flow!"
        }
    `,
    sdk.args([ sdk.arg("Hello, Flow", types.String) ])
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    sdk.resolveParams,
    sdk.resolveArguments,
])
```

In Example 4 we Build an Execute Script Interaction by using the script builder to specify a Cadence script and the args and arg builders to specify some arguments to pass into the Cadence Script. To Resolve this built interaction, we pipe'd the built interaction through an array of resolvers. The resolveParams resolver encoded the Cadence script into a format the Flow Blockchain accepts, and the resolveArguments resolver prepared the arguments into the correct encoding that the Flow Blockchain accepts.

Example 5
    : Building a Transaction Interaction
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const signingFunction = (...) => {
    ...
    return signature
}

const builtInteraction = await sdk.build([
    sdk.transaction`transaction(msg: String) { prepare(acct: AuthAccount) {} execute { log(msg) } }`,
    sdk.args([sdk.arg("Hello, Flow!", types.String)]),
    sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    sdk.resolveArguments,
    sdk.resolveParams,
    sdk.resolveAccounts,
    sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
    sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
    sdk.resolveSignatures,
])
```

In Example 5 we build a Transaction Interaction by building an interaction and calling the transaction builder with a piece of transaction Cadence code, and then specify an authorization for the payer, proposer and one authorizer.

After the Transaction Interaction is built, we pipe it through a series of resolvers. We resolve the reference block id to execute this transaction against by calling the resolveRefBlockId resovler. We resolve the sequence number for the proposer authorization for this transaction by calling the resolveProposerSequenceNumber resolver. Then we resolve the arguments and params for the transaction by calling the resolveArguments and resolveParams resolvers. We then call the resolveAccounts resolver to prepare each specified authorization into a format that they could be used to produce their correct signature(s) for the transaction. Finally, at the end, we call the resolveSignatures resolver which will asyncronously use the signingFunction available for the specified authorizations to retrieve a signature for each.

## Send

Once an Interaction has been _Built_ and, if necessary, _Resolved_ it can then be _Sent_ to the Flow Blockchain. Fortunately, sending to the Flow Blockchain is simple. The Flow JS-SDK exposes a Send function which consumes an Interaction and some configuration, and returns a data structure called a _Response_ (more on this later).

Example 6
    : Sending an Execute Script Interaction
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const builtInteraction = await sdk.build([
    sdk.script`
        pub fun main(msg: String): String {
            return "Hello, Flow!"
        }
    `,
    sdk.args([ sdk.arg("Hello, Flow", types.String) ])
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    sdk.resolveParams,
    sdk.resolveArguments,
])

const response = await sdk.send(resolvedInteraction, { node: "my-access-node-url" })
```

In Example 6 we use the Flow JS-SDK send function to send an Interaction to the Flow Blockchain, and receive back a Response. Notice how the send function consumes both the resolved interaction as well as an object of configuration. The key value pair `node: "my-access-node-url"` on this configuration object tells the send function where to send this interaction to. The node here must point to the Flow access node of your choice, be that for the Flow main-net, testnet, emulator or elsewhere.

## Decode

The Flow JS-SDK send function returns a response. This Response is a Data Structure that must be _decoded_ into a format that you intuitively want. For example, if you send an Execute Script Interaction to the Flow Blockchain and inside that Interaction was a Cadence script that when executed returns the Integer 1, then the response you intuitively want is the integer 1 represented as a the JavaScript number 1. If you send a Get Account Interaction to the Flow Blockchain, then the response you intuitively want is a JavaScript object containing information of that Flow Account, not the entire content of the Response Data Structure itself.

This is where the decode phase comes in. The Flow JS-SDK exposes a function `decode` that consumes a response and returns back what you intuitively expect.

For the available Interaction types, decoding responses for them produces values like such:

- Decoding a Transaction Interaction returns the Transaction ID for the submitted Transaction Interaction
- Decoding an Execute Script Interaction returns the JavaScript equivalently typed values for the value returned by the Cadence Script that was Executed.
- Decoding a Get Account Interaction returns a JavaScript object containing the information for the account.
- Decoding a Get Events Interaction returns a JavaScript array of JavaScript objects each containing the relevant information for each Event.
- Decoding a Get Transaction Status interaction returns a JavaScript object of relevant information about the status of a transcation.
- Decoding a Get Latest Block interaction returns a JavaScript object of relevant information of the Latest Block.

Example 7
    : Decoding an Execute Script Interaction
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const builtInteraction = await sdk.build([
    sdk.script`
        pub fun main(int1: Int, int2: Int): Int {
            return int1 + int2
        }
    `,
    sdk.args([ sdk.arg(1, types.Int), sdk.arg(2, types.Int) ])
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    sdk.resolveParams,
    sdk.resolveArguments,
])

const response = await sdk.send(resolvedInteraction, { node: "my-access-node-url" })

const decoded = await sdk.decode(response)

assert(3 === decoded)
assert(typeof decoded === "number")
```

In Example 7 we illustrate how intuitively the decoded value returned from calling decode on the response returned from this Execute Script interaction must be the JavaScript number 3. This is because the Execute Script interaction contains Cadence code, which when executed with the included script arguements, adds the Cadence Integer 1 and Cadence Integer 2 together to return the Cadence Integer 3. Since there is no native concept of a Cadence Integer of value 3 in JavaScript, when this response is decoded, we intuitively expect the decoded value to be the JavaScript number 3.

Decode does several things under the hood to take your response into something you'd like to consume in your JS Applications. At a high level, it returns the relevant information from the response data structure, and if there are any Cadence values, decodes those Cadence values into conceptually equivalent JavaScript values and types.

## Custom Decoders

Custom Decoders are a concept available in the Flow JS-SDK which allows developers to, when decoding a response, exchange any Cadence typed values into their desired JavaScript value.

Custom Decoders are declared by passing a configuration object of key value pairs into the decode function. The keys included in this object correspond to the Cadence type you wish to provide a custom decoder for, and the value must be an asyncronous function which returns your desired JavaScript value for the type. The keys in this object can optionally be regex values declared by writing a regular expression between two forward slashes (ie: "/my-regex-exp/").

Example 8
    : Using a Custom Decoder to decode an Execute Script interaction.
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const builtInteraction = await sdk.build([
    sdk.script`
        pub struct Point {
            pub var x: Int
            pub var y: Int

            init(x: Int, y: Int) {
                self.x = x
                self.y = y
            }
        }

        pub fun main(x: Int, y: Int): Point {
            return Point(x: x, y: y)
        }
    `,
    sdk.args([ sdk.arg(123, types.Int), sdk.arg(456, types.Int) ])
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    sdk.resolveParams,
    sdk.resolveArguments,
])

const response = await sdk.send(resolvedInteraction, { node: "my-access-node-url" })

class Point {
    constructor({ x, y }) {
        this.x = x
        this.y = y
        this.created_at = Date.now()
    }
}

const decoded = await sdk.decode(response, {
    "/Point/": async point => new Point(point)
})

assert(3 === decoded)
assert(typeof decoded === "number")
```

In Example 8 we declare an Execute Script interaction with Cadence code that returns a Point Cadence struct. If no custom decoders were declared, the returned Cadence Point struct would by default be decoded into a JavaScript object with key value pairs for it's x and y variables. However, in this example we declare a custom decoder onto the call to decode which includes a regular expression that will match to the Point struct and return a new instance of the Point class that is declared just above.

## Flow JS-SDK Usage

### Example: Building A Transaction Interaction

Building a interaction produces an unresolved interaction. For example, to build a transaction interaction you must call `sdk.build([...])`, and pass in the sequence of builders you want to use to compose that transaction interaction. The example below highlights one way to build a transaction interaction:

```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const builtTxIx = await sdk.build([
  sdk.transaction`transaction(msg: String) { prepare(acct: AuthAccount) {} execute { log(msg) } }`,
  sdk.args([sdk.arg("Hello, Flow!", types.String)]),
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer(sdk.authorization("01", signingFunction, 0, seqNum)),
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
])
```

### Example: Resolving A Transaction Interaction

Once a transaction interaction is built, it's still not quite ready to be sent to the Access Node. To further prepare it to be ready to be sent to the Access Node, you must resolve it by piping it through a series of resolvers. Resolvers are functions that consume an interaction and attempt to fill in or prepare any missing pieces of it to get it ready to be sent to the Access API. The example below highlights one way to resolve a transaction interaction:

```javascript
import * as sdk from "@onflow/sdk"
const resolvedTxIx = await sdk.pipe(builtTxIx, [
  sdk.resolve([
    sdk.resolveArguments,
    sdk.resolveParams,
    sdk.resolveAccounts,
    sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
    sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
    sdk.resolveSignatures
  ])
)
```

### Example: Sending A Transaction Interaction

Now that your transction interaction is resolved, it can be sent to an Access Node! To send it to an Access Node, you must call `sdk.send(...)` with that interaction, and a configuration object. To specify which Access Node to send your request to, you specify it in the _node_ parameter of the config object. For example, the code below shows how to send your transaction interaction to the Flow Emulator running on _localhost:8080_:

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(resolvedTxIx, { node: "http://localhost:8080" })
```

The SDK additionally supplies builders to construct interactions of many different types to interact with the Access Node's various APIs.

Please reference the provided example project `react-simple` for example code.

### GetAccount Usage

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getAccount(addr)
]), { node: "http://localhost:8080" })
```

### GetEvents Usage

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getEvents(eventType, startBlock, endBlock),
]), { node: "http://localhost:8080" })
```

### GetLatestBlock Usage

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getLatestBlock()
]), { node: "http://localhost:8080" })
```

### GetTransactionStatus Usage

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.getTransactionStatus(txId)
]), { node: "http://localhost:8080" })
```

### Ping Usage

```javascript
import * as sdk from "@onflow/sdk"
const response = await sdk.send(await sdk.build([
  sdk.ping()
]), { node: "http://localhost:8080" })
```

### Script Usage

```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.args([sdk.arg("Hello Flow!", types.String)]),
  sdk.script`
    pub fun main(msg: String): Int {
      log(msg)
      return 7
    }
  `,
]), [
  sdk.resolve([
    sdk.resolveArguments,
    sdk.resolveParams,
  ]),
]), { node: "http://localhost:8080" })
```

### Transaction Usage

```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"
const response = await sdk.send(await sdk.pipe(await sdk.build([
  sdk.transaction`transaction(msg: String) { prepare(acct: AuthAccount) {} execute { log(msg) } }`,
  sdk.args([sdk.arg("Hello, Flow!", types.String)]),
  sdk.payer(sdk.authorization("01", signingFunction, 0)),
  sdk.proposer(sdk.authorization("01", signingFunction, 0)),
  sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
]), [
  sdk.resolve([
    sdk.resolveArguments,
    sdk.resolveParams,
    sdk.resolveAccounts,
    sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
    sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
    sdk.resolveSignatures
  ]),
]), { node: "http://localhost:8080" })
```

## Flow JS-SDK Exposes

- [Top Level](./)

  - [`sdk.build`](./src/build)
  - [`sdk.resolve`](./src/resolve)
  - [`sdk.send`](./src/send)
  - [`sdk.decode`](./src/decode)
  - [`sdk.decodeResponse`](./src/decode)

- [Utils](../interaction)

  - [`sdk.isOk`](./src/interaction)
  - [`sdk.isBad`](./src/interaction)
  - [`sdk.why`](./src/interaction)
  - [`sdk.pipe`](./src/interaction)

- [Builders](./src/build)

  - [`sdk.authorizations` & `sdk.authorization`](./src/build/authorizations.js)
  - [`sdk.getAccount`](./src/build/get-account.js)
  - [`sdk.getEvents`](./src/build/get-events.js)
  - [`sdk.getLatestBlock`](./src/build/get-latest-block.js)
  - [`sdk.getTransactionStatus`](./src/build/get-transaction-status.js)
  - [`sdk.limit`](./src/build/limit.js)
  - [`sdk.params` & `sdk.param`](./src/build/params.js)
  - [`sdk.payer`](./src/build/payer.js)
  - [`sdk.ping`](./src/build/ping.js)
  - [`sdk.ref`](./src/build/ref.js)
  - [`sdk.script`](./src/build/script.js)
  - [`sdk.transaction`](./src/build/transaction.js)

- [Resolvers](./resolve)
  - [`sdk.resolveAccounts`](./src/resolve/resolve-accounts.js)
  - [`sdk.resolveParams`](./src/resolve/resolve-params.js)
  - [`sdk.resolveSignatures`](./src/resolve/resolve-signatures.js)
  - [`sdk.resolveArguments`](./src/resolve/resolve-arguments.js)
  - [`sdk.resolveProposerSequenceNumber`](./src/resolve/resolve-proposer-sequence-number.js)
  - [`sdk.resolveRefBlockId`](./src/resolve/resolve-ref-block-id.js)
  - [`sdk.resolveValidators`](./src/resolve/resolve-validators.js)
