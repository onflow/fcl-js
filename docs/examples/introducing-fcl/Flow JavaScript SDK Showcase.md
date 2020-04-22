# Flow JavaScript SDK

# Introduction

We think that a blockchain platform should enable decentralization and help developers focus on building. `@onflow` is all you need to interact with the Flow blockchain and Cadence smart contracts from your JavaScript client code.

# Installation

**NPM**

    npm i -S @onflow/sdk @onflow/fcl @onflow/types

**Yarn**

    yarn add @onflow/sdk @onflow/fcl @onflow/types

### `@onflow/sdk` vs `@onflow/fcl`

`@onflow/sdk`

- Is responsible for building, sending and resolving interactions with the Flow network. It exposes a composable interface for creating any kind of interaction with the Flow Access API, exposed by the access node. Basically, it speaks Flow.

`@onflow/fcl`

- Provides abstractions of common `sdk` patterns, like `send`. It's designed to be user-friendly too. Under-the-hood this library uses `@onflow/sdk` to perform most of its functions.

# Configuration

Anywhere in your code, connect to a Flow access node

```js
fcl.config().put("accessNode", "http://localhost:8080");
```

# Usage

## Imports

```js
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"
```

## Start **Developing**

## Connect to a Wallet

Flow is designed to support most wallet types–– fully-custodial wallets, browser-based (extensions), hardware and other managed decentralized wallet options.

`@onflow` uses a simple protocol to enable wallets to manage identities, and perform authentication and authorization. When making transactions, `@onflow` provides a simple ergonomic interface between wallets and your app.

## Sign a Transaction

We don't think app developers should need to get into the details of how a transaction is signed. Of course, you can always look into the `sdk` package to learn more if you're curious.

To sign a transaction, simply provide `fcl.currentUser().authorization` to use credentials provided by the user's selected wallet.

```js
sdk.authorizations([
  fcl.currentUser().authorization
])
```

If no wallet has been connected, this call will prompt the user to connect a wallet. More details on how wallets will provide connections are coming soon.

A Flow transaction also requires additional information which can be added easily

```js
sdk.proposer(fcl.currentUser().proposerAuthorization)
sdk.payer(fcl.currentUser().payerAuthorization)
```

**Putting it All Together**

Here is an example of a simple transaction where a user's wallet and Flow account is used to propose, pay for and authorize a Flow transaction.

```js
const resp = await fcl.send([

    sdk.authorizations([
        fcl.currentUser().authorization,
    ]),

    sdk.proposer(fcl.currentUser().proposerAuthorization),
    sdk.payer(fcl.currentUser().payerAuthorization),

    sdk.transaction`
        transaction {
          prepare(acct: AuthAccount) {
            // "acct" is from sdk.authorizations above
          }

          execute {
            // ... transaction logic
          }
        }
`
])
```

More on [Transactions](trasnactions) later in the guide.

## Deploy a Smart Contract

Deploying Cadence smart contracts is easy using `@onflow`. You can deploy Cadence smart contracts directly to the blockchain, and will not need to use ABIs to interact with them. Contracts can be deployed to and from any account as long as it is authorized.

**A Note on Contract Deployment:** You'll need to have a Flow account to deploy Cadence smart contracts. Accounts are used to authorize the deployment trasnaction, and store the contract code.

Deploy a contract by supplying the contract code and a public key anywhere in your code

```js
fcl.send([
  sdk.params([
    sdk.param(code, t.Code, "code")
  ]),

  sdk.authorizations([
    fcl.currentUser().authorization
  ]),

  sdk.proposer(fcl.currentUser().proposerAuthorization),
  sdk.payer(fcl.currentUser().payerAuthorization),

  sdk.transaction`
    transaction {
      let account: AuthAccount
      prepare(acct: AuthAccount) {
        account = acct
      }
      execute {
        let code = ${p => p.code}
        AuthAccount(account: account, code: code)
      }
    }
  `
])
```

## `@onflow/types`

`@onflow/types` are functions for converting from JavaScript values to the appropriate Cadence inputs. In the above example following valid Cadence code will be sent and executed (keys are truncated to save space

```swift
transaction {
    execute {
      let publicKeys = ["F862...".decodeHex()]
      let code = "7075...".decodeHex()
      AuthAccount(publicKeys: publicKeys, code: code)
    }
  }
```

## **Updating a Deployed Contract**

**A Note on Upgradability:** Currently, you may deploy new smart contract code to your account at any time however there are some important limitations. Changes to objects created by old contracts are not updated if modified in a new version of your contract. **In the future, Flow will support a more robust means of updating your contract code.**

This example is the same as the previous, with a slight modification to the trasnaction

```swift
AuthAccount.setCode(account: account, code: code)
```

Here is the complete transaction to update a contract in the current user's account

```js
fcl.send([
  sdk.params([
    sdk.param(code, t.Code, "code")
  ]),

  sdk.authorizations([
    fcl.currentUser().authorization
  ]),

  sdk.proposer(fcl.currentUser().proposerAuthorization),
  sdk.payer(fcl.currentUser().payerAuthorization),

  sdk.transaction`
    transaction {
      let account: AuthAccount
      prepare(acct: AuthAccount) {
        account = acct
      }
      execute {
        let code = ${p => p.code}
        AuthAccount.setCode(account: account, code: code)// <- Update with setCode
      }
    }
  `
])
```

## Execute a Transaction

Flow Transactions are used to _move_ **[resources](resources)** and interact with smart contracts on behalf of Flow accounts. `@onflow` provides flexible primitives composing authorizing and paying for Transactions on Flow.

`@onflow` allows for specifying the **payer**, **proposer** and **authorizer** of transactions on Flow.

```js
const response = await fcl.send([
    sdk.payer(fcl.currentUser().payerAuthorization),

  sdk.proposer(fcl.currentUser().proposerAuthorization),

  sdk.authorizations([
     fcl.currentUser().authorization
  ]),

    sdk.transaction`
      import FungibleToken from 0x01

        transaction {
              prepare(acct: AuthAccount) {
            // "acct" is from sdk.authorizations above
              }
              execute {
                // ... execute
              }
        }
    `
])
```


### Parameterized Transactions

Similar to scripts, parameters can be passed to your Cadence transactions using `sdk.param`

```js
const response = await fcl.send([
    sdk.payer(fcl.currentUser().payerAuthorization),

    sdk.proposer(fcl.currentUser().proposerAuthorization),

    sdk.authorizations([
     fcl.currentUser().authorization
  ]),

    sdk.params([sdk.param("Cadence", t.String, "name")]),

  sdk.transaction`
    transaction {
        prepare(acct: AuthAccount) {}
        execute {
          log("Hello ${param => param.name}") //<- Logs "Hello Cadence"
        }
    }
  `
])
```

### Transaction Inputs

The following Cadence transaction has 2 inputs: `to` and `amount` . The Cadence types are `Address` and `Int`. `@onflow` provides functions for supply these values as valid Cadence inputs

```js
const response = await fcl.send([

  sdk.params([
    sdk.param("0x02", t.Address, "to"),
    sdk.param(10, t.Int, "amount"),
  ]),

  sdk.authorization([
    fcl.currentUser().authorization
  ]),

  sdk.payer(fcl.currentUser().payerAuthorization),

  sdk.transaction`
    import FungibleToken, FlowToken from 0x01

    // Above we specified an array of params.
    // Those params are passed into the transaction in the same order they are declared above.
    transaction(to: Address, amount: Int) {
      var temporaryVault: @FlowToken.Vault

      // Similar to the params, the accounts that are authorizating this transaction
      // are passed into the prepare statement in the same order they are declared above.
      prepare(acct: Account) {
        self.temporaryVault <- acct.storage[FlowToken.Vault]?
                                   .withdraw(amount: ${p => p.amount}) ?? panic("No Vault!")
      }

      execute {
        let recipient = getAccount(${p => p.to})
        let receiverRef = recipient.published[&FungibleToken.Receiver] ?? panic("No receiver!")
        receiverRef.deposit(from: <-self.temporaryVault)
      }
    }
  `,
])
```

### Listening for Transaction Events

Once a Flow transaction is sealed it may be considered complete. You can subscribe to your transactions settlement using `fcl.transaction`

```js
const response = await fcl.send([
// ...
])

const unsub = fcl.transaction(response).subscribe(status => {
      if (fcl.transaction.isSealed(status)) {
          // Do something based on the transaction status...
        unsub()
      }
})
```

## Run a Cadence Script

Cadence scripts allow you to run computations on Flow. You'll mainly use scripts as a way of querying Flow for information about accounts and their **[resources](resources).** A script is not signed by any account and cannot modify an account's state.

### Simple Script

Using a simple script is a useful way to test your connection to Flow

```js
const resp = await fcl.send([
  sdk.script`
    pub fun main(): Int {
      return 42 + 6
    }
  `
])

const value = await sdk.decodeResponse(response)

// value === 48
```

### Parameterized Script

Adding parameters to your scripts is done using `sdk.param`. The same as when deploying a contract

```js
const response = await fcl.send([
    sdk.params([
            sdk.param("value", t.String, "key")
        ]),
        sdk.script`
        pub fun main(): Int {
          log("${params => params.key}") //<- Logs "value" to emulator output
          return 44 - 2//<- Computed by Flow network
        }
      `,
])

const value = await sdk.decodeResponse(response)

// value === 42;
```

### Query Flow Accounts

Scripts are mainly used to acquire information about an accounts public state and it's **[resources](resources)**. Here is an example of a script you might use to query account balances

```js
const response = await fcl.send([
        sdk.script`
            import FungibleToken from 0x01

                access(all) fun main() {

                    let acct1 = getAccount(0x01)
                    let acct2 = getAccount(0x02)

                    return [
                            acct1.published[&AnyResource{FungibleToken.Receiver}]?.balance,
                            acct2.published[&AnyResource{FungibleToken.Receiver}]?.balance
                        ]
                }
      `,
])

const value = await sdk.decodeResponse(response)

// Cadence optionals return null if nil
// response === [100, null]
```

**A Note about ABIs**: To achieve a similar result using web3 you would normally need an ABI for the contract you wanted to interact with. Using `@onflow` this interface is not necessary. You import and interact with Cadence contracts in Cadence directly!

# Real World Example with React

Here is an example to demonstrate executing a Flow transaction from a React component which would be close a real-world example. It's a tipping dashboard!

```jsx
import React, {useState, useEffect} from 'react'

import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"

import { Root, Avatar, Details, Detail } from './components'

const useCurrentFlowUser = () => {
  const [user, setUser] = useState(null)
  useEffect(() => fcl.currentUser().subscribe(setUser), [])
  return user
}

const useFlowUser = (acct) => {
  const [user, setUser] = useState(null)
  useEffect(() => fcl.user(acct).subscribe(setUser), [])
  return user
}

const UserCard = ({ acct }) => {

  const user = useFlowUser(acct)
  const currentUser = useCurrentFlowUser()

  const [amount, setAmount] = useState(10)
  const [status, setStatus] = useState("DEFAULT")

  const tipUser = useCallback(async (acct, amount) => {
    setStatus("PROCESSING")
    const resp = await fcl.send([
      fcl.transaction`
                import FungibleToken, FlowToken from 0x01
                transaction(amount: UFix64, to: Address) {
                    var temporaryVault: @FlowToken.Vault
                    prepare(from: AuthAccount) {
                        self.temporaryVault <- from.storage[FlowToken.Vault]?
                                                   .withdraw(amount: ${p => p.amount}) ?? panic("No Vault!")
                    }
                    execute {
                        let recipient = getAccount(${p => p.to})
                        let receiverRef = recipient.published[&FungibleToken.Receiver] ?? panic("No receiver!")
                        receiverRef.deposit(from: <-self.temporaryVault)
                    }
                }
            `,
      sdk.params([
        sdk.param(amount, t.UFix64),
        fcl.user(acct).param(),
      ]),
      sdk.authorizations([
        fcl.currentUser().authorization,
      ]),
      sdk.proposer(fcl.currentUser().proposerAuthorization),
      sdk.payer(fcl.currentUser().payerAuthorization),
    ])

    const unsub = fcl.transaction(resp).subscribe(status => {
      if (fcl.transaction.isSealed(status)) {
        setStatus("COMPLETED")
        setTimeout(() => setStatus("DEFAULT"), 3000)
        unsub()
      }
    })
  })

  if (user == null) return <LoadingUserCard/>

  return(
        <Root>
        <Avatar src={user.icon || "fallback"}/>
        <Details>
          <Detail label="Name">{user.name || "anon"}</Detail>
          {user.bio && <Detail label="Bio">{user.bio}</Detail>}
          {status === "PROCESSING" && <div>Processing Tip...</div>}
          {status === "COMPLETED" && <div>Success!!</div>}
          {currentUser && currentUser.address && status === "DEFAULT" && <div>
            <input value={amount} onChange={e => setAmount(e.target.value)}/>
            <button onClick={() => tipUser(acct, amount)}></button>
          </div>}
        </Details>
      </Root>
    )
}
```
