# Authorization Function

## Overview

An Authorization Function is a function of which wallet providers can build and supply on belalf of their users for use in dApps.

The Authorization Function, when called, returns valuable information that the Flow JS-SDK and FCL uses to understand how to use to produce signatures for a transaction on behalf of a user.

## How to Use an Authorization Function

An authorization function is a function that you may use in place of an authorization in the Flow JS-SDK and FCL. An authorization is a concept that is used when denoting a proposer, payer or authorizer for a transaction. An authorization can either be a data structure represenating an authorization, or a function which when called returns an authorization. In this document we discuss the latter.

To use an Authorization Function, you simply specify that Authorization Function as the authorization for a proposer, payer or authorizer for a transaction.

Example 1:
```javascript
import * as fcl from "@onflow/fcl"

const myAuthorizationFunction = ... // An Authorization Function

const response = fcl.send([
    fcl.transaction`transaction() { prepare(acct: AuthAccount) {} execute { log("Hello, Flow!") } }`,
    fcl.proposer(myAuthorizationFunction),
    fcl.payer(myAuthorizationFunction),
    fcl.authorizers([ myAuthorizationFunction ])
])
```

During the resolve phase of the Flow JS-SDK and FCL, the authorization function is called appropriately and is _resolved_ into the authorization data structure it returns.

## How to Create An Authorization Function

Fortunately, creating an Authorization Function is relatively simple.

An Authorization Function is a function which consumes an Account, and returns an Authroization data structure. An account in an internal to FCL and the JS-SDK data structure which contains information about who the Authorization is for. 




