# Flow App Quickstart

---

**Last Updated:** October 5th 2021

FCL-JS is the easiest way to start building decentralized applications. FCL (aka Flow Client Library) wraps much of the logic you'd have to write yourself on other blockchains. Follow this quick start and you'll have a solid overview of how to ship a dapp on Flow.

We're going to make an assumption that you know or understand React, but the concepts should be easy to understand and transfer to another framework. While this tutorial will use Cadence (Flow's smart contract language), you do not need to know it, instead we recommend later diving into [learning the Cadence language](https://docs.onflow.org/cadence/) once you gotten the core FCL concepts down.

In this tutorial, we are going to interact with an existing smart contract on Flow's testnet known as the [Profile Contract](https://testnet.flowscan.org/contract/A.ba1132bc08f82fe2.Profile). Using this contract, we will create a new profile and edit the profile information, both via a wallet. In order to do this, the FCL concepts we'll cover are:

- Installation
- Configuration
- Authentication
- Querying the Blockchain
- Initializing an Account
- Mutating the Blockchain

And if you ever have any questions we're always happy to help on [Discord](https://discord.gg/flow). There are also links at the end of this article for diving deeper into building on Flow.

## Installation

The first step is to generate a React app using [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html). From your terminal, run the following:

```sh
npx create-react-app flow-app
cd flow-app
```

In your terminal, you're going to want to install FCL so we can use it in our app.

```sh
npm install @onflow/fcl --save
```

Next, we'll want to run the app using the following command in your terminal.

```sh
npm start
```

You should now see your React app running.

## Configuration

The first thing you're going to want to do is configure your Dapp with FCL. Let's create a `config.js` file in the `src` directory and add the following.

> **Create file:** `./src/config.js`
```javascript
import { config } from "@onflow/fcl"

config({
  "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"
})
```
📣 **Tip**: It's recommend to replace these values with environment variables for easy deployments across different environments like development/production or Testnet/Mainnet.

The `accessNode.api` key specifies which node we'd like to communicate with on the blockchain and `discovery.wallet` tells FCL the wallet we'd like to use. In this case, we're using Flow FCL's Discovery protocol to find all available wallets for a user. Flow's FCL Discovery service is an open-source service for wallet providers on Flow can add themselves and make themselves 'discoverable' to any dapp that uses the discovery.wallet endpoint. Learn more about configuration values [here](https://docs.onflow.org/fcl/reference/api/#setting-configuration-values).

To finish configuring our dapp, let's import the config file into the top of our `App.js` file, then swap out the default component in `App.js` to look like this:

> **Replace file:** `./src/App.js`
```javascript
import "./config"

function App() {
  return (
    <div>
      <h1>Flow App</h1>
    </div>
  );
}

export default App;
```

Now we're ready to start talking to Flow!

## Authentication

To authenticate a user, all an app has to do is call `fcl.logIn()`. Sign up and unauthenticate are all also as simple as `fcl.signUp()` and `fcl.unauthenticate()`.  Once authenticated, FCL sets an object called `fcl.currentUser` which exposes methods for watching changes in user data, singing transactions, and more. For more information on the `currentUser`, read more [here](https://docs.onflow.org/fcl/reference/api/#current-user).

Let's add in a few buttons for sign up/login and also subscribe to changes on the `currentUser`. When the user is updated (which it will be after authentication), we'll set the user state in our component to reflect this. To demonstrate user authenticated sessions, we'll conditionally render a component based on if the user is or is not logged in.

This is what your file should look like now:

> **Replace file:** `./src/App.js`
```javascript
import "./config"
import { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"

function App() {
  const [user, setUser] = useState({loggedIn: null})

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  );
}

export default App;
```

You should now be able to log in or sign up a user and unauthenticate them. Upon logging in or signing up you'll see a popup where you can choose between wallet providers. Let's select the Blocto wallet for this example to create an account. Upon completing authentication, you'll see the component change and the user's wallet address appear on the screen if you've completed this properly.

## Querying the Blockchain

One of the main things you'll often need to do when building a dapp is query the Flow blockchain and the smart contracts deployed on it for data. Since smart contracts will live on both Testnet and Mainnet, let's put the account address where the smart contract lives into the configuration (remember, it's recommended that you change this later to use environment variables). Let's also give it a key of `Profile` and prefix it with `0x` so that the final key is `0xProfile`. The prefix is important because it tells FCL to pull the corresponding addresses needed from the configuration value.

> **Replace file:** `./src/config.js`
```javascript
import { config } from "@onflow/fcl"

config({
  "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xProfile": "0xba1132bc08f82fe2" // The account address where the smart contract lives
})
```

If you want to see the on chain smart contract we'll be speaking with next, you can view the [Profile Contract](https://testnet.flowscan.org/contract/A.ba1132bc08f82fe2.Profile) source code but again for this tutorial it's not necessary you understand it.

**The first thing we are going to do is query to see what the user's profile name is from the contract.** 

A few things need to happen in order to do that: 
1. We need to import the contract and pass it the user's account address as an argument.
2. Call it with `fcl.query`.
3. Set the result to the app state in React so we can display the profile name in our browser.
4. Display "No Profile" if one was not found.

Take a look at the new code and we'll explain each new piece after. Remember, the cadence code is a separate language from JavaScript used to write smart contracts, so to learn FCL in this tutorial it's okay you only glance at that.

> **Replace file:** `./src/App.js`
```javascript
import "./config"
import { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"

function App() {
  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('') // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

	// NEW
  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setName(profile?.name ?? 'No Profile')
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div> // NEW
        <button onClick={sendQuery}>Send Query</button> // NEW
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  );
}

export default App;
```

A few things happened. In our `AuthedState` component, we added a button to send a query for the profile name and a div to display the result above it. The corresponding `useState` initialization can be seen at the top of the component.

The other thing we did is build out the actual query inside of `sendQuery` method. Let's take a look at it more closely:

```javascript
await fcl.query({
  cadence: `
    import Profile from 0xProfile

    pub fun main(address: Address): Profile.ReadOnly? {
      return Profile.read(address)
    }
  `,
  args: (arg, t) => [arg(user.addr, t.Address)]
})
```

Inside the query you'll see we set two things: `cadence` and `args`. Cadence is Flow's smart contract language we mentioned above. For this tutorial, when you look at it you just need to notice that it's importing the Profile contract from the account we named `0xProfile` earlier in our config file, then taking an account address, and reading it. That's it until you're ready to [learn more Cadence](https://docs.onflow.org/cadence/tutorial/01-first-steps/).

In the `args` section, we are simply passing it our user's account address from the user we set in state after authentication and giving it a type of `Address`.  For more possible types, [see this reference](https://docs.onflow.org/fcl/reference/api/#ftype).

Go ahead and click the "Send Query" button. You should see "No Profile." That's because we haven't initialized the account yet.

## Initializing the Account

In order for an account to access and store resources (a profile being one of them) from a smart contract, the account needs to first give approval to Flow that's it's okay to do that.

To do this account initialization, we're going to add another function called `initAccount`. Inside of that function, we're going to add some more potentially unfamiliar Cadence code which basically says, *"Hey, does this account have a profile? If it doesn't, let's add one."* We do that using something called a "transaction." Transactions occur when you want to change the state of the blockchain. And there is a cost in order to do that; unlike a query, which is read only.

That's where we jump back into FCL code. Instead of `query`, we use `mutate` for transactions. And because there is a cost, we need to add a few fields that tell Flow who is proposing the transaction, who is authorizing it, who is paying for it, and how much they're willing to pay for it. Those fields — not surprisingly — are called: `payer`, `proposer`, `authorizations`, and `limit`.

Let's take a look at what our account initialization function looks like:

```javascript
const initAccount = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import Profile from 0xProfile

      transaction {
        prepare(account: AuthAccount) {
          // Only initialize the account if it hasn't already been initialized
          if (!Profile.check(account.address)) {
            // This creates and stores the profile in the user's account
            account.save(<- Profile.new(), to: Profile.privatePath)

            // This creates the public capability that lets applications read the profile's info
            account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
          }
        }
      }
    `,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50
  })

  const transaction = await fcl.tx(transactionId).onceSealed()
  console.log(transaction)
}
```

You can see the new fields we talked about. You'll also notice `fcl.authz`. That's shorthand for use the current user (you could also write it as `fcl.currentUser.authorization`). If you want to learn more about transactions and signing transactions, you can [view the docs here](https://docs.onflow.org/concepts/accounts-and-keys/#signing-a-transaction). For this example, we'll keep it simple with the user being each of these roles.

You'll also notice we are awaiting a response with our transaction data by using the syntax `fcl.tx(transactionId).onceSealed()`. This will return when the blockchain has sealed the transaction and it's complete in processing it and verifying it.

Now your `App.js` file should look like this (we also added a button for calling the `initAccount` function in the `AuthedState`):

> **Replace file:** `./src/App.js`
```javascript
import "./config"
import { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"

function App() {
  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('')

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setName(profile?.name ?? 'No Profile')
  }

  // NEW
  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <button onClick={sendQuery}>Send Query</button>
        <button onClick={initAccount}>Init Account</button> // NEW
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}

export default App;
```

If you go ahead and press the "Init Account" button you should see the wallet ask you to approve a transaction. After clicking it, you will see a transaction response appear in your console (make sure to have that open). It may take a few moments. With the transaction result printed, you can use the `transactionId` to look up the details of the transaction the chain has stored via this [block explorer](https://testnet.flowscan.org).

## Mutating the Blockchain

Now that we have the profile initialized, we are going to want to mutate it some more. In this example, we'll use the same smart contract provided to change the profile name.

To do that, we are going to write another transaction that adds some Cadence code which lets us set the name. Everything else looks the same in the following code except for one thing: we'll subscribe to the status changes instead of waiting for it to be sealed after the mutate function returns.

It looks like this:

```javascript
const executeTransaction = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import Profile from 0xProfile

      transaction(name: String) {
        prepare(account: AuthAccount) {
          account
            .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
            .setName(name)
        }
      }
    `,
    args: (arg, t) => [arg("Flow Developer", t.String)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50
  })

  fcl.tx(transactionId).subscribe()
}
```

Here you can see our argument is "Flow Developer" and at the bottom we've called the `subscribe` method instead of `onceSealed`.

Let's see how that works inside our whole `App.js` file. But, let's also set the statuses to our React component's state so we can see on screen what state we're in.

> **Replace file:** `./src/App.js`
```javascript
import "./config"
import { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"

function App() {
  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null) // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setName(profile?.name ?? 'No Profile')
  }

  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

	// NEW
  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [arg("Flow Developer!", t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div> // NEW
        <button onClick={sendQuery}>Send Query</button>
        <button onClick={initAccount}>Init Account</button>
        <button onClick={executeTransaction}>Execute Transaction</button> // NEW
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}

export default App;
```

Now if you click the "Execute Transaction" button you'll see the statuses update next to "Transaction Status." When you see "4" that means it's sealed! Status code meanings [can be found here](https://docs.onflow.org/fcl/reference/api/#transaction-statuses).

That's it! You now have a shippable Flow dapp that can auth, query, init accounts, and mutate the chain. This is just the beginning. There is so much more to know. We have a lot more resources to help you build. To dive deeper, here are a few good places for taking the next steps:

**Cadence**
- [Cadence Playground Tutorials](https://docs.onflow.org/cadence/tutorial/01-first-steps/)
- [Cadence Hello World Video](https://www.youtube.com/watch?v=pRz7EzrWchs)
- [Why Cadence?](https://www.onflow.org/post/flow-blockchain-cadence-programming-language-resources-assets)

**Full Stack NFT Marketplace Example**
- [Beginner Example: CryptoDappy](https://github.com/bebner/crypto-dappy)
- [Advanced Example: Kitty Items](https://github.com/onflow/kitty-items)

**More FCL**
- [FCL API Quick Reference](https://docs.onflow.org/fcl/reference/api/)
- [More on Scripts](https://docs.onflow.org/fcl/reference/scripts/)
- [More on Transactions](https://docs.onflow.org/fcl/reference/transactions/)
- [User Signatures](https://docs.onflow.org/fcl/reference/user-signatures/)
- [Proving Account Ownership](https://docs.onflow.org/fcl/reference/proving-authentication/)