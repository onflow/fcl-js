# Authorization Function

## Overview

An Authorization Function is a function of which wallet providers can build and supply on belalf of their users for use in dApps.

The Authorization Function, when called, returns valuable information that the Flow JS-SDK and FCL uses to understand how to use to produce signatures for a transaction on behalf of a user.

## How to Use an Authorization Function

An authorization function is a function that you may use in place of an authorization in the Flow JS-SDK and FCL. An authorization is a concept that is used when denoting a proposer, payer or authorizer for a transaction. An authorization can either be a data structure represenating an authorization, or a function which when called returns an authorization called an Authorization Function. In this document we discuss the latter.

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

The builder functions, fcl.proposer, fcl.payer and fcl.authoirzers each consume the Authorization Function and set it as the resolve field on the internal Account object it creates.

During the resolve phase of the Flow JS-SDK and FCL, when resolveAccounts is called, the resolve field on each internal Account object is called, which means each Authorization Function is called appropriately and the account is _resolved_ into the data structure the authorizationFunction returns.

## How to Create An Authorization Function

Fortunately, creating an Authorization Function is relatively simple!

An Authorization Function is a function which consumes an Account, and returns an Authroization data structure, which is the same data structure as an Account but with additional information populated into it. An Account is an internal data structure to FCL and the JS-SDK which contains information about who the Authorization is for.

Example 2:
```javascript
const authorizationFunction = (account) => {
    
    .. do things ..

    return {
        ...account,
        addr: "f8d6e0586b0a20c7", // The address of the Flow Account this authorizationFunction is for.
        keyId: 1, // The id of the key on the Flow Account this authorizationFunction intends to use.
        sequenceNum: 123, // The sequence number of the key corresponding to the keyId on the Flow Account this authorizationFunction intends to use.
        signingFunction: (...) => {...}, // The signing function for this authorization function (more on this later)
        resolve: null, // Resolve is set to null to prevent this account from being resolved further.
        roles: account.roles, // The roles this account represents (authorizer, proposer, payer or any combination of the three)
    }
}
```

## How to create a Signing Function

Creating a signing function is also relatively simple!

To create a signing function you specify a function which consumes a payload and returns a signature data structure.

Example 3:
```javascript
const signingFunction = ({
  message, // The encoded string which needs to be used to produce the signature.
  addr, // The address of the Flow Account this signature is to be produced for.
  keyId, // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer, // A Boolean representing if this signature to be produced for a proposer.
    authorizer, // A Boolean representing if this signature to be produced for a authorizer.
    payer, // A Boolean representing if this signature to be produced for a payer.
  }, 
  interaction, // The internal Interaction data structure. This can be used to recreate the message for security purposes.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message) // The hex encoded string representing the signature of the message.
  }
}
```

This signing function is one that coould be returned from the Authroization Function as the signingFunction in its returned data structure.
