## Connect

By default, the library uses HTTP to communicate with the access nodes and it must be configured with the correct access node API URL. An error will be returned if the host is unreachable.

Example:

```typescript
import { config } from "@onflow/fcl"

config({
  "accessNode.api": "https://rest-testnet.onflow.org"
})
```

## Querying the Flow Network

After you have established a connection with an access node, you can query the Flow network to retrieve data about blocks, accounts, events and transactions. We will explore how to retrieve each of these entities in the sections below.

## Mutate Flow Network

Flow, like most blockchains, allows anybody to submit a transaction that mutates the shared global chain state. A transaction is an object that holds a payload, which describes the state mutation, and one or more authorizations that permit the transaction to mutate the state owned by specific accounts.

Transaction data is composed and signed with help of the SDK. The signed payload of transaction then gets submitted to the access node API. If a transaction is invalid or the correct number of authorizing signatures are not provided, it gets rejected.

## Transactions

A transaction is nothing more than a signed set of data that includes script code which are instructions on how to mutate the network state and properties that define and limit it's execution. All these properties are explained below.

**Script** field is the portion of the transaction that describes the state mutation logic. On Flow, transaction logic is written in [Cadence](https://cadence-lang.org/docs). Here is an example transaction script:

```typescript
transaction(greeting: string) {
  execute {
    log(greeting.concat(", World!"))
  }
}
```

**Arguments**. A transaction can accept zero or more arguments that are passed into the Cadence script. The arguments on the transaction must match the number and order declared in the Cadence script. Sample script from above accepts a single `String` argument.

**Proposal key** must be provided to act as a sequence number and prevent replay and other potential attacks.

Each account key maintains a separate transaction sequence counter; the key that lends its sequence number to a transaction is called the proposal key.

A proposal key contains three fields:

- Account address
- Key index
- Sequence number

A transaction is only valid if its declared sequence number matches the current on-chain sequence number for that key. The sequence number increments by one after the transaction is executed.

**Payer** is the account that pays the fees for the transaction. A transaction must specify exactly one payer. The payer is only responsible for paying the network and gas fees; the transaction is not authorized to access resources or code stored in the payer account.

**Authorizers** are accounts that authorize a transaction to read and mutate their resources. A transaction can specify zero or more authorizers, depending on how many accounts the transaction needs to access.

The number of authorizers on the transaction must match the number of `&Account` parameters declared in the prepare statement of the Cadence script.

Example transaction with multiple authorizers:

```typescript
transaction {
  prepare(authorizer1: &Account, authorizer2: &Account) { }
}
```

**Gas limit** is the limit on the amount of computation a transaction requires, and it will abort if it exceeds its gas limit.
Cadence uses metering to measure the number of operations per transaction. You can read more about it in the [Cadence documentation](https://cadence-lang.org/docs).

The gas limit depends on the complexity of the transaction script. Until dedicated gas estimation tooling exists, it's best to use the emulator to test complex transactions and determine a safe limit.

**Reference block** specifies an expiration window (measured in blocks) during which a transaction is considered valid by the network.
A transaction will be rejected if it is submitted past its expiry block. Flow calculates transaction expiry using the _reference block_ field on a transaction.
A transaction expires after `600` blocks are committed on top of the reference block, which takes about 10 minutes at average Mainnet block rates.
