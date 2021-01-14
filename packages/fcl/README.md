# @onflow/fcl

If you are making a web application powered by the Flow Blockchain, this is probably the thing you are looking for.

# Status

- **Last Updated:** Jan 14th 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Low

The things that exists probably won't be changing much externally, we will be adding new functionality in the near future.

# Install

```bash
npm install --save @onflow/fcl @onflow/types
```

# Overview

Having trouble with something? Reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are more than happy to help.

- [Quick Start](#flow-app-quickstart) -- From zero to users interacting with the Flow blockchain using a dapp you made.

# Flow App Quickstart

**Last Updated:** Jan 14th 2021

Follow this guide to understand the basics of how to build an app that interacts with the Flow blockchain using `@onflow/fcl`

This guide uses `create-react-app` and does not require any server-side code. `@onflow/fcl` is not tied to any front-end framework.

In this quickstart you will:

- [ ] Configure our app so that:
  - [ ] `@onflow/fcl` can talk to Flow (Testnet).
  - [ ] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [ ] That it knows about our profile contract.
- [ ] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [ ] Talk about resource initialization.
- [ ] Use a script to check if the current acount has a profile resource initialized.
- [ ] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

Let's begin building a decentralized application.

## Create React App and other deps.

Run the following commands to initialize a new FCL project.

```sh
yarn create react-app my-app
cd my-app
yarn add @onflow/fcl @onflow/types
```

Those deps:

- `@onflow/fcl` is the latest build of FCL.
- `@onflow/types` is a conversion layer between javascript and cadence (Flows native language). These are used when we want to pass javascript into Cadence transactions and scripts.

## Configuration

Generally its a good idea to use environment variables for our configuration.
This will allow us to change environments easily and Create React App comes out of the box with fairly good support for them.
We will then need to pass these environment variables to FCL before it talks to anything else.
To achieve this we will create two files (`./.env.local`, `./src/config.js`) one to hold our env variables locally, one to import those env variables and supply them to FCL.
Then we will import our configuration of FCL as the very first thing in our application.

> **Note:** Create React App requires all environment variables to be prefixed with `REACT_APP_*`

```sh
touch .env.local        # Create a .env.local file for us to store our environment variables
touch ./src/config.js   # Create a ./src/config.js file where we will import our environment variables and configure FCL
```

Now that we have our files we should add in our environment variables. Open `.env.local` and add the following to it.

```sh
# File: .env.local

# ACCESS_NODE will be the endpoint our application
# will use to talk to the Flow Blockchain.
REACT_APP_ACCESS_NODE=https://access-testnet.onflow.org

# WALLET_DISCOVERY will be the endpoint our application
# will use to discover available FCL compatible wallets.
REACT_APP_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

# CONTRACT_PROFILE will be the address that has the Profile
# contract we will be using in this guide.
REACT_APP_CONTRACT_PROFILE=0xba1132bc08f82fe2
```

These environment variables should now be available for us to use when we go to configure FCL, which we will do next. Open `./src/config.js` and add the following to it.

```javascript
// File: ./src/config.js

import {config} from "@onflow/fcl"

config()
  .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE) // Configure FCLs Access Node
  .put("challenge.handshake", process.env.REACT_APP_WALLET_DISCOVERY) // Configure FCLs Wallet Discovery mechanism
  .put("0xProfile", process.env.REACT_APP_CONTRACT_PROFILE) // Will let us use `0xProfile` in our cadence
```

We now have a file that configures FCL but... It is not yet being invoked, so FCL still remains unconfigured in our application.
The final step of this section is to import this file as the first thing in our application. Open `./src/index.js` and add the following as the first line.

```javascript
// File: ./src/index.js

import "./config" // Imports environment variables and configures FCL
// Then the rest of ./src/index.js
import React from "react"
import ReactDOM from "react-dom"
```

:tada: Congrats!! You have configured FCL, which is the very first step in having a decentralized application built on Flow (testnet)

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [ ] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [ ] Talk about resource initialization.
- [ ] Use a script to check if the current acount has a profile resource initialized.
- [ ] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Authentication

Believe it or not, our application already has authentication. When we configured the `challenge.handshake` value we got it.
That one piece of configuration tells FCL everything it needs to know in order to authenticate users on Flow (testnet) using FCL compatible wallets.

Let's learn how to interact with our current user by learning about the following:

- How to Sign Up
- How to Log In
- How to Log Out
- Subscribe to the current users info

We will learn about them by building a react component that will show the Users Flow Address and a sign out button when they are authenticated, but when they are unauthenticated it will show sign up and in buttons.

We are going to call this component `AuthCluster` and it will live at `/src/auth-cluster.js`. Here is its code, we will talk about whats going on in it afterwords.

```javascript
// File: ./src/auth-cluster.js

import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export function AuthCluster() {
  const [user, setUser] = useState({loggedIn: null})
  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? "No Address"}</span>
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  } else {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }
}
```

There is a lot going on in there, we should take a closer look, in particular at the following:

- `fcl.currentUser().subscribe(setUser)`
- `fcl.unathenticate`
- `fcl.logIn` and `fcl.signUp`

### `fcl.currentUser().subscribe(setUser)`

Internally and conceptually FCL sort of uses the actor model (as much as anything in really javascript can...), this allows us to reactively subscribe to things, like in this instance, when the current user changes from being unauthenticated to authenticated.
`fcl.currentUser()` returns us the Current Users actor, for the purposes of this guide we can think of it this way: `fcl.currentUser()` is going to return to us an object that has all the thigns we can do with a current user.
One of the things we can do with a Current User is subscribe to its state, passing it a callback function. This means that anytime the state of the current user changes, our callback will be invoked with the current users current state.
This callback is invoked immediately as soon as we subscribe, but do to how `react`, its `useState` and `useEffect` hooks work we need to be sure to give ourselves some default values.

### `fcl.unauthenticate()`

`fcl.unauthenticate()` is a function that is an alias to `fcl.currentUser().unauthenticate()`.
It will trigger the unauthenticate sequence inside of the Current User Actor.

### `fcl.logIn()` and `fcl.signUp()`

`fcl.logIn()` and `fcl.signUp()` are function that are currently both alias to `fcl.currentUser().authenticate()`.
It will trigger the authenticate sequence inside of the Current User Actor.
FCL, by design, considers both of these operations the same.
We will be expanding on this aspect of FCL in the future, and future versions will be able to pass on the intent "User wants to Log In" and "User wants to Sign Up" onto the wallets, so using the respective aliases now will lead to gaining this future intent later.

### Using our `AuthCluster`

We should then import and add our `AuthCluster` component to our application in `./src/App.js`. I've replaced `./src/App.js` to look like the following.

```javascript
// File: ./src/Auth.js

import React from "react"
import {AuthCluster} from "./auth-cluster"

export default function App() {
  return (
    <div>
      <AuthCluster />
    </div>
  )
}
```

:tada: Congrats!! Users of our application can now authenticate and unauthenticate.

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [ ] Talk about resource initialization.
- [ ] Use a script to check if the current acount has a profile resource initialized.
- [ ] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Flow Contracts

I've started to think of Flow Contracts as statefull modules, and have been trying to break them down into a concept which I have been calling Micro Contracts.
To me a Micro Contract is a smaller self contained contract that does a single thing real well, and should be re-usable across various applications with out an additional instance of it being deployed.
As our Flow ecosystem grows and evolves hopefully the more of these building blocks become available, allowing you as the app developers to build on the shoulders of giants, enabling you to focus on the logic that makes your application/contracts special.

The rest of this guide is going to focus on a Profile contract that you can find at [https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile).

The idea behind that Profile contract is that a user can set their public profile once and bring it with them from application to application.
What this means for you as an app developer is that your application can use this functionality.
Not only that but using it should be easy enough to use in this quick start guide.

Now there is **something very important** that you as an application developer needs to keep in mind when developing on Flow.
Generally speaking, Flow Accounts need to have a resource, from a contract, in their storage, in order to interact with said contract.
**We don't get to silently slip this resource into their storage, the user needs to actively authorize this action.**
This resource is usually where we store the accounts speciic data (that statefull part of statefull modules), it also generally acts as the interface into the contract itself.
If we were to use the Profile contract as an example, the resource the Flow Account needs to have acts as the storage where we keep the Profiles details, it also exposes functionality for the owner of the resource to update those details.

It's often not enough to only have the resource, we often need a publically accessible interface too. This publically accessible interface in Cadence terms is called a capability, and is usually a sub-set of what the resource is able to do.
In the case of the Profile contract, this public capability is what allows our application to read the profiles information without the flow account authorizing our access ever time, meaning we don't ever need to store a copy of their info.

We would usuall call setting up a Flow Account with a contracts resources and additional capabilities "Initialization".
As a Flow Application Developer you will need to think about this sort of thing a lot and figure out what this means for your applications UX.

:tada: Contrats!! Their is so much more to learn about the above, but for now the important bit is to remember that your users need to authorize the initialization of your contracts into their Flow Accounts.

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [ ] Use a script to check if the current acount has a profile resource initialized.
- [ ] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## FCL and scripts

In FCL, I almost always start of writing a script like this: `fcl.send([]).then(fcl.decode)`. `fcl.send()` takes an array that lets us describe what we want our script to be, and `fcl.decode` is going to parse out the return value from our script and turn it into javascript values.

Our first script isn't going to have anything to do with our Profile contract, its going to use Cadence, to add two numbers. We are going to hardcode in these numbers to start with, and then pass them in as arguments.
Let's look at our first script.

```javascript
import * as fcl from "@onflow/fcl"

await fcl
  .send([
    fcl.script`
    pub fun main(): Int {
      return 5 + 4
    }
  `,
  ])
  .then(fcl.decode)
```

In Cadence scripts, `pub fun main()` is what gets invoked, in this case it is returning an integer (`Int`).
`fcl.send` sends our script to the chain (via our configured access node) and then `fcl.decode` is decoding the response which should return `9` in this case.

> TIP: If you want to try this out, [flow-view-source](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile) exposes both `fcl` and `t` in the console. Try pasting the above (sans-import) snippet in its console.

The above snipped is fine as a starting point, but we can do so much more here, like replacing those magic numbers with script arguments.

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

await fcl
  .send([
    fcl.script`
    pub fun main(a: Int, b: Int): Int {
      return a + b
    }
  `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode)
```

In the above we have changed `pub fun main(): Int` to `pub fun main(a: Int, b: Int): Int`, this tells Cadence to expect to arguments, in this case both are integers.
`fcl.args([])` allows us to pass in arguments to our Cadence script, the order matters here, the first argument in the array is going to be the first argument to our `main` function.
We then see two `fcl.arg(value, t.Int)` calls passed to `fcl.args([])`, the first will be our `a` argument, and the second will be our `b` argument.
That `t.Int` needs to match the arguments type decloration in Cadence, there is a corresponding `t.*` for every Cadence Type.

I just so happen to know that the [Rawr (testnet) at 0xba1132bc08f82fe2](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Rawr) contract has this add functionality that we are currently using.
Let's import the Rawr contract and use its `add` function instead of writing out our bespoke implementation.

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

await fcl
  .send([
    fcl.script`
    import Rawr from 0xba1132bc08f82fe2

    pub fun main(a: Int, b: Int): Int {
      return Rawr.add(a: a, b: b)
    }
  `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode)
```

So at this point we should be able to import contracts, and execute scripts against them. Lets apply this new found knowledge against our profile contract.
I know for a fact that `0xba1132bc08f82fe2` (It also happens to be where the Profile contract is deployed) has a profile, so lets see if we query the chain for it.

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

await fcl
  .send([
    fcl.script`
    import Profile from 0xba1132bc08f82fe2

    pub fun main(address: Address): Profile.ReadOnly? {
      return Profile.read(address)
    }
  `,
    fcl.args([
      fcl.arg("0xba1132bc08f82fe2", t.Address), // <-- t.Address this time :)
    ]),
  ])
  .then(fcl)
```

We should get back something like this:

```json
{
  "address": "0xba1132bc08f82fe2",
  "name": "qvvg",
  "avatar": "https://i.imgur.com/r23Zhvu.png",
  "color": "#6600ff",
  "info": "Flow Core Team. Creator and Maintainer of FCL and the flow-js-sdk.",
  "verified": true
}
```

A lot of work has been done in the [Profile](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile) contract, to make interacting with it from a web app and FCL a nicer experience, I would highly recommend having a look through it, there are a lot of small lessons in there.

:tada: Congrats!! You just queried a Flow Account on the Flow Blockchain for a Profile thats rules were defined in a contract.

## Checking if the Flow Account is initialized with the Profile

Not all Flow Accounts are going to have a profile though, if you are new to Flow your account right now probably doesn't have one, so being able to check if an account is initialized and then being able initialize an account is extremely important. That is what we will cover

Let's start by creating a directory for our Flow Scripts and Transactions. I generally like to call this directory `flow`, name my scripts with `*.script.js` and name my transactions with `*.tx.js`.
Our first scipt is going to check if a supplied address is initialized with a profile.

```sh
mkdir ./src/flow
touch ./src/flow/is-initialized.script.js
```

The Profile contract exposes a helper function that lets us check if an address is initialized `Profile.check(address)`, it returns a boolean. Let's use that in our new `./src/flow/is-initialized.script.js` file.

```javascript
// File: ./src/flow/is-initialized.script.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function isInitialized(address) {
  if (address == null)
    throw new Error("isInitialized(address) -- address required")

  return fcl
    .send([
      fcl.script`
      import Profile from 0xProfile

      pub fun main(address: Address): Bool {
        return Profile.check(address)
      }
    `,
      fcl.args([fcl.arg(addres, t.Address)]),
    ])
    .then(fcl.decode)
}
```

Something new was introduced in the above file, we used `0xProfile` instead of `0xba1132bc08f82fe2` in the import statement.
Way way way back at the start of this guide we added in the configuration `config().put("0xProfile", "0xba1132bc08f82fe2")`, it turns out that when we are using FCL, that configuration allows us to pull the corresponding addresses from any configuration value where its key starts with `0x`.
This is super convienient when you move from one environment/chain to another, all you should need to do is update your environment variables to reflect your new environment/chain, none of you code should need to change.

Other than that newly introduced import, hopefully the above is looking familliar to you now. Let's put this aside for now and move onto how to initialize an account with a Profile.

:tada: Congrats!! You now have a re-usable script that you can use to check if an account is initialized.

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [x] Use a script to check if the current acount has a profile resource initialized.
- [ ] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Initializing an Account with a Profile

Initializing an Account with a Profile is going to require a transaction. Transactions are very similar to scripts, for example: you supply them with some cadence, they accept arguments. But there is a little more to them...
You need a transaction when you want to permanently change the state of the Flow Blockchain, there is a cost (in FLOW) involved with this (often covered by FCL compatible wallets), a Flow account needs to propose the change (acts as a nonce), and if you need the permission of the owner of the state you are chainging.
Those three aspects we call roles and are as follows, the payer, the proposer, and authorizers (one for each owner of state).
The most common intent will be that the Current User is responsible for all three roles, and by extension the wallet.
What we need is the Current User to Authorize its participation as all three of the roles (payer, proposer, authorizer).
Luckliy for us FCL makes this pretty easy, `fcl.currentUser()` has an `authorization` function that can be used to do just that.
You will need `fcl.currentUser().authorization` in almost every standard transaction, usually multiple times, because of this we have aliased it to `fcl.authz`.

Transactions also require a computation limit. This value will eventually be tied to the cost to the payer of the transaction, its in your best interest to keep it as low as possible.

Just as with the script, a good place to start with for transactions is our good old friend `fcl.send([]).then(fcl.decode)`.
In the case of a transaction the decode is going to supply us the transactions id (or an error) that we can then use to query the status of the transaction.

Let's create a `./src/flow/init-account.tx.js` file with the following FCL transaction that initializes an account.

```javascript
// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function initAccount() {
  const txId = await fcl
    .send([
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
        import Profile from 0xProfile

        transaction {
          // We want the accounts address for later so we can verify if the account was initialized properly
          let address: Address

          prepare(account: AuthAccount) {
            // save the address for the post check
            self.address = account.address

            // Only want to initialize the account if it hasnt already been initialized
            if (!Profile.check(self.address)) {
              // This creates and stores the Profile in the users account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profiles info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }

          // verify the account has been initialized
          post {
            Profile.check(self.address): "Account was not initialized"
          }
        }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}
```

There is a fair bit of stuff going on above, first off that transaction code is rough, no way you can remember that, eventually you will become fairly familiar with that sort of stuff, but in the mean time if you go look at the [contract](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile) I've documented how to do most of things you can possibly want to do with the profile contract.
I forget that sort of stuff all the time, and keeping that documentation with the contract is a good way to remind myself how to use the contract, it also should make the contract more accessible to others, like you.
I hope that this sort of documentation becomes more of a standard practice in Flow Contract Development.

if we assume that the actual cadence code was copy-pasted from the contract, then there isn't much left here, let's break it down as follows:

- `fcl.authz` -- we have already talked about this above, its an alias for `fcl.currentUser().authorization`.
- `fcl.payer(fcl.authz)`, `fcl.proposer(fcl.authz)` -- These are saying the current user is responsible for the payer and proposer roles.
- `fcl.authorizations([fcl.authz])` -- this means that our current user is authorizing the transaction to modifiy the state of things it owns (storage and public capabilities in this case), we gain access to this permission via the first `AuthAccount` passed into the prepare statement of our transaction.
- `fcl.tx(txId)` -- This is a new actor we havent seen before, it keeps track of transaction statuses, in this case for the transaction we just submitted to the chain
- `fcl.tx(txId).onceSealed()` -- This is a promise that will resolve once our change is permanently represented by the chain. It can also error if something goes wrong.

:tada: Congrats!! We now have a function we can all to initialize the current users account with a Profile

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [x] Use a script to check if the current acount has a profile resource initialized.
- [x] Use a transaction to initialize a profile.
- [ ] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Getting an accounts Profile

We actually saw this already, back when we were talking about scripts. So this section is really going to be about adding it to a file we will call `./src/flow/fetch-profile.script.js`

```javascript
// File: ./src/flow/fetch-profile.scripts.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function fetchProfile(address) {
  if (address == null) return null

  return fcl
    .send([
      fcl.script`
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}
```

:tada: Congrats!! We now have a function we can fetch an accounts Profile if it has one

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [x] Use a script to check if the current acount has a profile resource initialized.
- [x] Use a transaction to initialize a profile.
- [x] Query an accounts profile if its there.
- [ ] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Updating a profile

Updating a piece of information in a profile is a transction, the contract has an example of it, and explains a bit better what you can do with it ([Link for the Lazy](https://flow-view-source.com/testnet/account/0xba1132bc08f82fe2/contract/Profile)), so we wont go into all that much detail here.
But you should start to see a pattern with transactions:

- They always have cadence
- They sometimes have arguments
- They always have a payer and proposer
- They usually have authorizations
- Payer, proposer, and first authorization are more often than not the current user
- The more complex the transaction the higher the comput limit

Initialization transactions are often the most scary looking, while also probably the most similar between contracts.
Other transactions like the following that will live in `./src/flow/profile-set-name.tx.js` generally will borrow a resource from the AuthAccount and do some action on the resource.
It is also fairly common to then borrow a public capability from some other account and use something from the borrowed resource on that public capability,
an example of this would be sending FLOW tokens to someone else, the AuthAccount will borrow its Vault resource and withdraw (the action) a temporary Vault resource,
the transaction will then borrow the public capability from the recipient of the FLOW tokens that can receive that temporary FLOW token vault.
In our case we want to act directly on the borrowed Profile Resource.

This transaction to set the name in the profile is substantially smaller than the initialization transaction we have already seen.
Only the owner (AuthAccount) of a resource in storage can borrow it directly, we leverage this fact, and a `Profile.Owner` interface on the resource to make it so the only one who can set the name on this resource is the owner.
Everyone else needs to interact with this resource via the linked public capability which has a limited `Profile.Public` interface.

Below is our `./src/flow/profile-set-name.tx.js` file.

```javascript
// File: ./src/flow/profile-set-name.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function setName(name) {
  const txId = await fcl
    .send([
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(35),
      fcl.args([fcl.arg(name, t.String)]),
      fcl.transaction`
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}
```

:tada: Congrats!! We now have a function we can update the users name in their Profile

We should now be able to check off the following:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [x] Use a script to check if the current acount has a profile resource initialized.
- [x] Use a transaction to initialize a profile.
- [x] Query an accounts profile if its there.
- [x] Use a transaction to update a profile
- [ ] Next Steps
  - [ ] Deployment
  - [ ] Path to Flow (Mainnet)

## Putting it all together

We now have four files, each with their own functionality in them:

- `./src/flow/is-initialized.script.js`
- `./src/flow/init-account.tx.js`
- `./src/flow/fetch-profile.scripts.js`
- `./src/flow/profile-set-name.tx.js`

These files all interact in various ways with the Flow (testnet) Blockchain. This guide isn't really a guide on React, and everyone has all sorts of opinions on how to deal with state in a React Application.
Hopefully from those four files, and the ability to subscribe to the current users authentication status, you can see how it could be integrated into your applications and various frameworks of choice.
It might help to think of them as powerful predefined API calls, that let you query and mutate the state on chain.
I have personally found a nice synergy between FCL and Recoil, it has allowed me to limit the number of queries and calls to the chain I am making. You can find an example of a more complicated application [here](https://github.com/dapperlabs/kitty-items-web).

With what we have done above, deployment should work with anything that allows you to set the environment variables.
I have had pretty good success with hosting applications built like this on IPFS via [https://fleek.co/](https://fleek.co/) and the hash router from `react-router-dom`.
But honestly anything should work.

## Mainnet

Eventually you will think your application is ready for Mainnet, and it probably is.
The first step will be making sure all the contracts you are using are there, currently the Flow team needs to approve all the contracts that get deployed so we have an idea whats out there, but this requirement will go away in the near future.
Second step will be to use all the environment variables, the ones for the contracts, there will also be a new access node value and FCL wallet discovery.
At this point in time, your application should be working on mainnet. YMMV based on how far you stray from only talking to contracts via FCL.

I think that checks everything else off of our list:

- [x] Configure our app so that:
  - [x] `@onflow/fcl` can talk to Flow (Testnet).
  - [x] `@onflow/fcl` can talk to FCL Wallet Discovery.
  - [x] That it knows about our profile contract.
- [x] Use `@onflow/fcl` to authenticate using a Flow (Testnet) Account via a discoverd wallet.
- [x] Talk about resource initialization.
- [x] Use a script to check if the current acount has a profile resource initialized.
- [x] Use a transaction to initialize a profile.
- [x] Query an accounts profile if its there.
- [x] Use a transaction to update a profile
- [x] Next Steps
  - [x] Deployment
  - [x] Path to Flow (Mainnet)

If you have any questions, concerns, comments, just want to say hi, we would love to have your company in our [discord](https://discord.gg/k6cZ7QC).
