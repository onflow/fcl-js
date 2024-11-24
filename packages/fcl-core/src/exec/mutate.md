# Mutate

Programmatically mutate state on Flow. A light, stable and approachable higher level wrapper around the transaction variant of the FCL/JS-SDK interaction.

> The primary idea here is to make mutating the state on the Flow Blockchain more approachable by providing an interface that hides most of the complexity. Eventually this way of mutating the chain will be able to pull stored transaction interactions from on chain repositories of scripts/transaction, this interface provides some initial steps/foundation in that direction.

## Status

- **Last Updated:** Aug 17th 2022
- **Stable:** Yes
- **Risk of Breaking Change:** Low
- **Introduced:** `0.0.73`

## Configuration

`mutate` requires the usage of FCL configuration in order to operate properly.
You can learn more about configuring FCL here: [Configure FCL](https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx)
Configuration only needs to happen once, but it must happen before mutate is called. We always recommend configuring FCL as early in your application as possible/reasonable.

`mutate` requires a few pieces of configuration.

- `accessNode.api` - How to talk to Flow.
- `discovery.wallet` - How to connect to wallets.
- `flow.network` - which network are you on ("mainnet", "testnet", etc).

Below is an example of configuring FCL to talk to Flow (testnet)

```javascript
import * as fcl from "@onflow/fcl"

// prettier-ignore
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("flow.network", "testnet")
```

`mutate` also respects [Address Replacement](https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx#address-replacement-in-scripts-and-transactions) configuration.
This allows you to write your cadence with placeholder addresses like `0xProfile` and then configure FCL to replace it with an actual address before it executes the mutation.

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

We mutate the state on the Flow blockchain by sending a cadence transaction to Flow.
A transaction has a couple pieces.

- The transaction code (written in Cadence).
- Arguments to the transaction code.
- Signatures for three types of signatory roles (Proposer, Payer, Authorizer).

By default `mutate` is going to default to the current user being responsible for all three signatory roles.
This means the current user will act as the proposer, payer and authorizer. You are able to overload this default.

Let's take a look at the following transaction code which transfers FUSD on Flow testnet:

```swift
  import FungibleToken from 0x9a0766d93b6608b7
  import FUSD from 0xe223d8a629e49c68

  // A - Transaction Block & Arguments
  transaction(amount: UFix64, to: Address) {
    let sentVault: @FungibleToken.Vault

    // B - Prepare statement and AuthAccounts
    prepare(signer: AuthAccount) {
      let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow reference to the owner's Vault!")
      self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
      let recipient = getAccount(to)

      let receiverRef = recipient
        .getCapability(/public/fusdReceiver)
        .borrow<&{FungibleToken.Receiver}>() ?? panic("Could not borrow receiver reference to the recipient's Vault")

      receiverRef.deposit(from: <-self.sentVault)
    }
  }
```

There is a lot going on in the above transaction code. For the purposes of this document we care about two major pieces as they are the things we will need to deal with when we write our mutation code.

- `A - Transaction Block & Arguments` - This block is what makes it a transaction. We can also see that we will need to pass in two arguments a `UFix64` followed by an `Address`
- `B - Prepare Statement` - AuthAccounts are what give us access to the valuable things in an accounts storage. We need an AuthAccount to put resources into an accounts storage, interact with resources directly in storage, or remove a resource from storage. We gain access to an AuthAccount by supplying an authorizer. In the above example there is a single AuthAccount, so our transaction will need a single Authorizer, which `mutate` will default to the current user.

We can then take the above transaction code and bring it into javascript like this:

> Let's transfer `10.0 FUSD` from the current users Flow account to `0xba1132bc08f82fe2`.

```javascript
import * as fcl from "@onflow/fcl"

const transactionId = await fcl.mutate({
  cadence: `
    import FungibleToken from 0x9a0766d93b6608b7
    import FUSD from 0xe223d8a629e49c68

    // A - Transaction Block & Arguments
    transaction(amount: UFix64, to: Address) {
      let sentVault: @FungibleToken.Vault

      // B - Prepare statement and AuthAccounts
      prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow reference to the owner's Vault!")
        self.sentVault <- vaultRef.withdraw(amount: amount)
      }

      execute {
        let recipient = getAccount(to)

        let receiverRef = recipient
          .getCapability(/public/fusdReceiver)
          .borrow<&{FungibleToken.Receiver}>() ?? panic("Could not borrow receiver reference to the recipient's Vault")

        receiverRef.deposit(from: <-self.sentVault)
      }
    }
  `,
  args: (arg, t) => [
    arg("10.0", t.UFix64), // Will be the first argument `amount: Ufix64`
    arg("0xba1132bc08f82fe2", t.Address), // Will be the second argument `to: Address`
  ],
})
```

The [`query`](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#passing-in-arguments) documentation has some a bunch of information on passing in arguments that is worth a read. It goes into quite a bit more detail.

## Signtures that aren't for the current user. (Node)

`mutate` will default to using the current user for all three signatory roles, but that isn't desired all of the time, for example current user doesn't work with Node at all, so we need a way to enable other entities to fulfill those signatory roles required by the transaction.
For something to be able to act as a signatory for a transaction role it requires something called an Authorization Function. Documentation on creating a custom authorization function can be found [here](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/wallet-provider-spec/authorization-function.md).
Once you have your custom authorization function you need to configure `mutate` to use it instead.

```javascript
// Replacing the current user as the default signatory for all three roles

import * as fcl from "@onflow/fcl"
import {myCustomAuthzFn} from "./my-custom-authz-fn"

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("qvvg", t.String)],
  authz: myCustomAuthzFn, // the authz option allows you to overload all three signatory roles at once
})
```

Another option is for you to replace only a single signatory role (ie pay the transaction fees for your users):

```javascript
// Current user will be proposing and authorizing, but you are paying for the transaction

import * as fcl from "@onflow/fcl"
import {myCustomAuthzFn} from "./my-custom-authz-fn"

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("qvvg", t.String)],
  payer: myCustomAuthzFn, // the payer option allows for you to add your custom authorization logic as the payer only.
})
```

Proposer works in the same way as payer, the option is `proposer` though, you might want to use a custom proposer if you are wanting to do a lot transactions in parallel as a single account, which can be achieved by making your custom authorizion function cycle through a number of keys on its Flow account.

You can also overload the authorizations. Like `proposer` and `payer` you will need an authorization function, unlike proposer and payer and similar to arguments there can be more than one, so you need to pass your authorizers in as an array of authorization functions.

```javascript
import * as fcl from "@onflow/fcl"
import {myCustomAuthzFn} from "./my-custom-authz-fn"

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("qvvg", t.String)],
  proposer: myCustomAuthzFn,
  payer: myCustomAuthzFn,
  authorizations: [myCustomAuthzFn], // its an array.
})
```

More specific options overload less specific options. So `payer` will be used over `authz` which will be used over the default of current user.

## Interaction Templates

If you have an Interaction Template, you can use it with `mutate`:

### Using Template JSON 

```javascript
import * as fcl from "@onflow/fcl"
import myTransactionTemplate from "transaction-template.json"

const txId = await fcl.mutate({
  template: myTransactionTemplate,
})
```

### Using Template URL 

In place of a JSON template, you can specify a URL that points to one, and FCL will retrieve it from the remote location:

```javascript
import * as fcl from "@onflow/fcl"

const txId = await fcl.mutate({
  template: "https://interactions.my-project.com/buy-nft",
})
```

`muatate` will use the Interaction Template to carry out it's underlying transaction. Read more on Interaction Templates with FCL [here](https://github.com/onflow/fcl-js/blob/master/docs/reference/interaction-templates.mdx)
