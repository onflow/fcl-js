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

Build is the phase of your use of the Flow JS-SDK where you _Build_ up a specific interaction. During this phase you specify upon an interaction what information you currently know. This may include the specific Cadence code for a Script you wish to execute, or the address for the Account of which you wish to get. As you specify information, the type of the interaction you are composing becomes clear. For example, if you Build an interaction and speficy that you want to get an account for a specific address, you are composing an interaction of type Get Account.

The Flow JS-SDK exposes what we call a _build_ function, and a suite of _builder_ functions. The build function consumes as its argument an array of builder functions within it. Each builder function consumes information that you know, and that you want to place into the interaction. 


> Example 1
>    : Building an Execute Script Interaction
> ```javascript
> import * as sdk from "@onflow/sdk"
>
> const interaction = await sdk.build([
>    sdk.script`
>        pub fun main(): Int {
>            return 721
>        }
>    `
> ])
> ```

So, what happened in Example 1? 
