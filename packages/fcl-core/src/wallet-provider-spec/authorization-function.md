# Authorization Function

## Overview

An Authorization Function is a function which enables the JS-SDK and FCL to know which Flow account fulfills which signatory role in a transaction and how to recieve a signature on behalf of the supplied account.

## How to Use an Authorization Function

An authorization function is a function that you may use in place of an authorization in the Flow JS-SDK and FCL. An authorization is a concept that is used when denoting a proposer, payer or authorizer for a transaction. An authorization can either be a data structure represenating an authorization, or a function which when called returns an authorization called an Authorization Function. In this document we discuss the latter.

To use an Authorization Function, you specify that Authorization Function as the authorization for a proposer, payer or authorizer for a transaction.

> `fcl.currentUser().authorization` which is aliased to `fcl.authz` is itself an authorization function. It tells the underlying js-sdk the current users flow account will be used for the signatory role and supplies a signing function that enables the application to request a signature from the users wallet.

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

The builder functions, `fcl.proposer`, `fcl.payer` and `fcl.authorizations` each consume the Authorization Function and set it as the resolve field on the internal Account object it creates.

During the resolve phase of the Flow JS-SDK and FCL, when [`resolveAccounts`](https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/src/resolve/resolve.js#L22) is called, the resolve field on each internal Account object is called, which means each Authorization Function is called appropriately and the account is _resolved_ into the data structure the authorizationFunction returns. These accounts are then deduped based on the a mix of the `addr`, `keyId` and `tempId` so that only a single signature request happens per `address` `keyId` pair. When [`resolveSignatures`](https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/src/resolve/resolve.js#L25) is called the signing function for each `address` `keyId` pair is called returning a composite signature for each signatory role.

## How to Create An Authorization Function

Fortunately, creating an Authorization Function is relatively straight forward.

An Authorization Function needs to be able to do at minimum two things.
- Who will sign -- Know which account is going to sign and the keyId of the key it will use to sign
- How they sign -- Know how to get a signature for the supplied account and key from the first piece.

The Authorization Function has a concept of an account. An account represent a possible signatory for the transaction, it includes the who is signing as well as the how it will be signed. The Authorization Function is passed an empty Account and needs to return an Account, your job when making an Authorization Function is mostly to fill in this Account with the information so that the account you want to sign things can.

Lets say we knew up front the account, keyId and had a function that could sign things.

```javascript
const ADDRESS = "0xba1132bc08f82fe2"
const KEY_ID = 1 // this account on testnet has three keys, we want the one with an index of 1 (has a weight of 1000)
const sign = msg => { /* ... returns signature (for the key above) for supplied message ... */ }
```

Our Authorization Function becomes about filling things in:

Example 2:
```javascript
const authorizationFunction = async (account) => {
  // authorization function need to return an account
  return {
    ...account, // bunch of defaults in here, we want to overload some of them though
    tempId: `${ADDRESS}-${KEY_ID}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
    addr: ADDRESS, // the address of the signatory
    keyId: Number(KEY_ID), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
    signingFunction: async signable => {
      // Singing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      return {
        addr: ADDRESS, // needs to be the same as the account.addr
        keyId: Number(KEY_ID), // needs to be the same as account.keyId, once again make sure its a number and not a string
        signature: sign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      }
    }
  }
}
```

## Async stuff

Both the Authorization Function, and the accounts Signing Function can be asynchronous. This means both of these functions can go and get the information needed elsewhere. Say each of your users had a `userId`. From this `userId` say you had an api call that could return the corresponding address and key that is needed for the Authorization Functions account. You could also have another endpoint that when posted the signable (includes what needs to be signed) and the `userId` it can return with the composite signature if your api decides its okay to sign (the signable has all sorts of info to help you decide). An authorization function that can do that could look something like this.

Example 3:
```javascript
const getAccount = (userId) => fetch(`/api/user/${userId}/account`).then(d => d.json())
const getSignature = (userId, signable) = fetch(`/api/user/${userId}/sign`, {
  method: "POST",
  headers: { "Content-Type": "application/json"},
  body: JSON.stringify(signable),
})

function authz (userId) {
  return async function authorizationFunction (account) {
    const {addr, keyId} = await getAccount(userId)

    return {
       ...account,
       tempId: `${addr}-${keyId}`,
       addr: addr,
       keyId: Number(keyId),
       signingFunction: signable => {
         return getSignature(userId, signable)
       }
    }
  }
}
```
The above **Example 3** is the same as **Example 2**, but the information is gathered during the execution of the authorization function based on the supplied user id.

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
  voucher, // The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message) // The hex encoded string representing the signature of the message.
  }
}
```
