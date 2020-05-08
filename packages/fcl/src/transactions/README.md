# @onflow/fcl -- transactions

Transactions let you send Cadence code to the Flow blockchain that permanently alters its state.

We are assuming you have read the [Scripts Documentation](../scripts) before this, as transactions are sort of scripts with more required things.

Just like [scripts](../scripts), transactions are a type of [interaction](../../../interaction) that we send to an Access Node using `fcl.send`.
Also just like scripts, `fcl.transaction` is a [JavaScript Tagged Template Literal](https://styled-components.com/docs/advanced#tagged-template-literals) that we can pass Cadence code into.

Unlike scripts, they require a little more information, things like a proposer, authorizations and a payer, which may be a little confusing and overwhelming.
If you run into trouble, get stuck or need some help, reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are more than happy to help.

# Sending your first Transaction

There is a lot to unpack in the following code snippet.
It sends a transaction to the Flow blockchain. For the transaction, the current user is authorizing it as both the `proposer` and the `payer`.
Something that is unique to Flow is the one paying for the transaction doesn't always need to be the one performing the transaction.
Proposers and Payers are special kinds of authorizations that are always required for a transaction.
The `proposer` acts similar to the `nonce` in etherium transactions, and helps prevent repeat attacks.
The `payer` is who will be paying for the transaction.
As mentioned before, it is very important to always provide both a `proposer` and `payer`, the transaction will not work with out them, when in doubt its probably safe to make them the same.

This `fcl.send` will return a `response`, that will include a `transactionId`. We can pass the response directly to `fcl.tx` and then use the `onceSealed` method which resolves a promise when the transaction is sealed.

```javascript
import * as fcl from "@onflow/fcl"

var response = await fcl.send([
  fcl.transaction`
    transaction {
      execute {
        log("Hello from execute")
      }
    }
  `,
  fcl.proposer(fcl.currentUser().authorization),
  fcl.payer(fcl.currentUser().authorization),
])

var transaction = await fcl.tx(response).onceSealed()
console.log(transaction) // The transactions status and events after being sealed
```

# Authorizing a transaction

The below code snippet is the same as the above one, except for one extremely important difference.
Our Cadence code this time has a prepare statement, and we are using the `fcl.authorizations` builder when constructing our transaction.

The `prepare` statements arguments directly map to the order of the authorizations in the `fcl.authorizations` builder.
Four authorizations means four `AuthAccount`s as arguments passed to `prepare`. In this case though there is only one, and it is the `currentUser`.

These authorizations are important as you can only access/modify an accounts storage if you have the said ccounts authorization.

```javascript
import * as fcl from "@onflow/fcl"

var response = await fcl.send([
  fcl.transaction`
    transaction {
      prepare(acct: AuthAccount) {
        log("Hello from prepare")
      }
      execute {
        log("Hello from execute")
      }
    }
  `,
  fcl.proposer(fcl.currentUser().authorization),
  fcl.authorizations([
    fcl.currentUser().authorization,
  ]),
  fcl.payer(fcl.currentUser().authorization),
])

var transaction = await fcl.tx(response).onceSealed()
console.log(transaction) // The transactions status and events after being sealed
```
