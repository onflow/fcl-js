# Flow JS-SDK

#### Contributers

This document was written by github.com/JeffreyDoyle and github.com/orodio for github.com/onflow.

For other documentation and code surrounding the Flow JS-SDK please reference: github.com/onflow/flow-js-sdk

## Introduction

Welcome, we're glad you're here.

The Flow JS-SDK is a relatively low-level suite of tools that allow JavaScript applications to interact with the Flow Blockchain.

In doing so, the Flow JS-SDK employs several concepts which empower developers to create, and operate upon what we call _Interactions_ that can be sent to the Flow Blockchain, and what we call _Responses_ that are returned from the Flow Blockchain.

Interactions have a Type, which tells the Flow JS-SDK itself how to react to preparing, operating upon and sending this specific interaction. Types of Interactions include, Get Account, Execute Script, Execute Transaction, Get Events, Get Latest Block and Get Transaction Status.

Futher in this document we will outline how to create such Interactions for use in your JavaScript applications, and how to deal with the Responses that the Flow Blockchain returns.

## Pipelines

Conceptually, there are four phases to the Flow JS-SDK

Build -> Resolve -> Send -> Decode

We will walk through each phase to exaplain how it is relevant for your applications and how you use the Flow JS-SDK

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

Each Authorizer of the transactionr represents an Account on Flow which consents to have it's state modified by this transaction.

The builders for the Proposer, Payer and each Authorizer consume an `authorization` which is built using its own builder function. An authorization is a data structure which is constructed by providing an Address, Signing Function and a keyId, and optionally a sequence number (more on this later).

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

This is where the _Resolve_ phase comes in. Resolves takes your built interaction containing all the information you do know and does it's best to get it into a position where it can be sent to the Flow Blockchain. The Flow JS-SDK comes with several _resolver_ functions that your dApp can use to do just this.

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
    : Building an Execute Script Interaction
```javascript
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

const signingFunction = (...) => {
    ...
    return signature
}

const builtInteraction = await sdk.build([
    sdk.transaction`transaction() { prepare(acct: AuthAccount) {} execute { log("Hello, Flow!") } }`,
    sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
])

const resolvedInteraction = await sdk.pipe(builtInteraction, [
    

])

```
