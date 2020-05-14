# @onflow/fcl

A high level abstraction (built on top of [@onflow/sdk](../sdk)) that enables development of browser based dApps.

# Status

- **Last Updated:** May 7th 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low

The things that exists probably won't be chainging much externally, we will be adding new functionality in the near future.

# Install

```bash
npm install --save @onflow/fcl
```

# Overview

Having trouble with something? Reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are more than happy to help.

- [Quick Start](#flow-app-quickstart) -- From zero to users interacting with the Flow blockchain using a dapp you made.
- [Configuration](./src/config) -- Configure FCL.
- [Authentication](./src/authentication) -- Authenticate Users using FCL wallet providers.
- [Scripts](./src/scripts) -- Query data from the Flow blockchain.
- [Transactions](./src/transactions) -- Send transactions to the Flow blockchain.
- [Emulator Docs](https://github.com/onflow/flow/blob/master/docs/emulator.md) -- Documentation for the Emulator.
- [Dev Wallet Docs](../dev-wallet) -- Documenation for the Dev Wallet.
- [FCL Wallet Provider Spec](./src/wallet-provider-spec) -- **WIP** Documentation for Wallet Providers.
  - [Wallet Discovery](./src/wallet-provider-spec/wallet-discovery.md) -- **Coming Soon** How FCL discovers wallets providers.
  - [Custodial Wallet Provider](./src/wallet-provider-spec/custodial.md) -- Documentation for Custodial Wallet Providers.
  - [Non-Custodial Wallet Provider](src/wallet-provider-spec/non-custodial.md) -- **Coming Soon** Documentation for Non-Custodial Wallet Providers.

# Todo List

- [ ] Persistent Current User Session
- [ ] `fcl.events(...)`-- Subscribging to onchain events
- [ ] `fcl.user(addr)` -- Subscribing to onchain public identity info

# Flow App Quickstart

**Last Updated:** May 7th 2020

Follow this guide to understand the basics of how to build an app that interacts with the Flow blockchain using `@onflow/fcl`

 

This guide uses `create-react-app` and does not require any server-side code. `@onflow/fcl` is not tied to any front-end framework.

In this quickstart you will

- Use `@onflow/fcl`  to  perform authentication and authorization of Flow accounts
- Use `@onflow/fcl`  to send scripts and transactions to the Flow blockchain emulator
- Install and use  the Flow blockchain emulator (`flow`)
- Install and use the FCL Dev Wallet (`fcl-wallet`) to simulate connection between your app, `@onflow/fcl` and a user's 3rd party key management software
- Configure `@onflow/fcl` for a production deployment

Once complete, this example application will be deployable to the Flow test/main networks with only small changes to configuration values. Let's begin.

## Create the React App

Run the following command to generate a React app. (Must have `npm` installed)

```bash
npx create-react-app my-dapp
```

## Install `@onflow` Dependencies

From the root directory of your new react app, run the following commands to install `@onflow/fcl` and the `@onflow/dev-wallet`

```bash
npm install --save @onflow/fcl
npm install --save-dev @onflow/dev-wallet
```

### What we installed

- `@onflow/fcl` is the library we'll use to interact with the Flow blockchain.
- `@onflow/dev-wallet` A "custodial" wallet that can authenticate and authorize transactions. It will simulate 3rd party key-management software necessary for interacting with the Flow blockchain on behalf of a specific Flow account.

**A Note on Wallets:**  Flow is designed to support most wallet types–– fully-custodial wallets, browser-based (extensions), hardware and other managed decentralized wallet options.

`@onflow/fcl` uses a handshake protocol to enable wallets to manage Flow identities, and perform authentication and authorization. Any wallet that supports the protocol can be used by your users automatically without any configuration in the application.

### Additional Project Dependencies

In this guide, we'll  use `@emotion/styled` to write css. (You can skip this step, or install your own preferred css tools)

```bash
npm install --save @emotion/styled
```

## Install the Flow Emulator

The Flow emulator is a lightweight tool that emulates the behaviour of the real Flow network. The emulator comes bundled with the [Flow CLI](https://github.com/onflow/flow/blob/master/docs/cli.md). Install the emulator by following these [instructions](https://github.com/onflow/flow/blob/master/docs/cli.md#installation).

## Start the Flow Emulator

From the root directory of your React app, run the following command to start the emulator

```bash
flow emulator start --init
```

**Note:** You don't need to use the `--init` flag if you start the emulator from a directory that already contains the `flow.json` file.

Running the above command starts the emulator and generates a `flow.json` file similar to this

```json
{
  "accounts": {
    "root": {
      "address": "0000000000000000000000000000000000000001",
      "privateKey": "e19081c8964b8dcf3902cc71e37d1f07f86fb357d79dd2fb57006419e0f95e95",
      "sigAlgorithm": "ECDSA_P256",
      "hashAlgorithm": "SHA3_256"
    }
  }
}

```

The emulated network is running and contains a single *root* account we can use to authorize transactions. We will connect the private key from this account to the `dev-wallet`.

## Start the Dev Wallet

Create a `scripts` entry in your `package.json` with the following command. Copy and paste the private key from your root account in `flow.json` and attach it to an environment variable named `PK`

```json
{
  "scripts": {
    "dev:wallet": "PK=e19081c8964b8dcf3902cc71e37d1f07f86fb357d79dd2fb57006419e0f95e95 fcl-wallet"
  }
}
```

Use the new command to run the Dev Wallet

```bash
npm run dev:wallet
```

If all is well you should see

```
@onflow/dev-wallet@0.0.4
*** *** *** *** *** *** ***

🎉 FCL Dev Wallet has started:
* Origin:       <http://localhost:8701>
* FCL Authn:    <http://localhost:8701/flow/authenticate>
* GraphiQL:     <http://localhost:8701/graphql>
* Access Node:  <http://localhost:8080>
* Root Address: 01
* Private Key:  e19081c8964b8dcf3902cc71e37d1f07f86fb357d79dd2fb57006419e0f95e95

Include this code in development to configure fcl:

import * as fcl from "@onflow/fcl"

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

*** *** *** *** *** *** ***

```

## Start the React App

We're ready to start building our new app. Start the React app to begin building the UI and interacting with the emulator using `@onflow/fcl`

```
npm start
```

# Build the Example Application

Now that we have the Flow emulator, Dev Wallet and our React app up and running we're ready to build our application. 

## Configure `@onflow/fcl`

Before we can use `@onflow/fcl` to interact with Flow we'll need to tell it how to connect to the Dev Wallet we started earlier. Add the following code to `src/App.js`

```diff
import React from "react";
+ import * as fcl from "@onflow/fcl";

import logo from "./logo.svg";
import "./App.css";

+ fcl.config()
+    .put("challenge.handshake", "<http://localhost:8701/flow/authenticate>")

function App() {
  // ...
}

```

`@onflow/fcl` is now configured to connect to the Dev Wallet. For more information about how `@onflow/fcl` interacts with Wallet providers, you can view documentation [../dev-wallet](dev wallet)

## Authenticate Users

Once configured, all that is needed is to call `fcl.authenticate()` in your code to authenticate Flow accounts. 

### Login & Signup

Attach the `fcl.authenticate` function to the `onClick` handler of a button

```jsx
<Button onClick={() => fcl.authenticate()}>Sign In/Up</Button>
```

### Logout

To allow users to sign out of your application, simply call `fcl.unauthenticate()`

```jsx
<Button onClick={() => fcl.unauthenticate()}>Sign Out</button>
```

### Changes to the Authenticated State

To receive a reactive update when a user has signed in/out you can subscribe to changes

```jsx
fcl.currentUser().subscribe((user) => {
  console.log(user)
})
```

## **Build the Login Form**

Here is the code for the completed component containing the UI and logic for authenticating users using `@onflow/fcl`. Add this code to `CurrentUser.js` in the `src` directory of your app

```jsx
import React, {useState, useEffect} from "react"
import styled from "@emotion/styled"
import * as fcl from "@onflow/fcl"

const Root = styled.div``

const Img = styled.img`
  width: 35px;
  height: 35px;
`
const Button = styled.button``

const SignInButton = () => {
  const [user, setUser] = useState(null)

  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  if (user == null) return null
  if (user.loggedIn) return null

  return <Button onClick={fcl.authenticate}>Sign In/Up</Button>
}

const UserProfile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  if (user == null) return null

  if (!user.loggedIn) return null
  return (
    <>
      {user.identity.avatar && <Img src={user.identity.avatar} />}
      <Name>{user.identity.name || "Anonymous"}</Name>
      <Button onClick={fcl.unauthenticate}>Sign Out</button>
    </>
  )
}

const CurrentUser = () => {
  return (
    <Root>
      <SignInButton />
      <UserProfile />
    </Root>
  )
}

export default CurrentUser
```

And display the `CurrentUser` component in your app

```diff
+ import CurrentUser from "./CurrentUser"

fcl.config()
 .put("challenge.handshake", "<http://localhost:8701/flow/authenticate>")

function App() {
  return (
    <div className="App">
+     <CurrentUser/>
    </div>
  )
}

```

## Run a Cadence Script

Cadence scripts allow you to run computations on Flow that are not recorded on the blockchain. You'll mainly use scripts as a way of querying Flow for information about accounts and their **[resources](notion://www.notion.so/dapperlabs/resources).** A script is not signed by any account and cannot modify an account's state.

### Simple Script

Using a simple script is a useful way to test your connection to Flow

```jsx
const resp = await fcl.send([
  sdk.script`
    pub fun main(): Int {
      return 42 + 6
    }
  `
])

const value = await fcl.decode(response)

// value === 48
```

To call A Cadence script from your React app, create another component and wire-up the UI. Here is an example component you can use. Create a file named `ScriptOne` in the `src` directory of your app with the following content

```jsx
import React, {useState} from "react"
import styled from "@emotion/styled"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Header = styled.div``
const Button = styled.button``
const Results = styled.pre``

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async e => {
    e.preventDefault()
    const response = await fcl.send([
      fcl.script`
        pub fun main(): Int {
          return 42 + 6
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Root>
      <Header>Script One</Header>
      <Button onClick={runScript}>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
    </Root>
  )
}

```

And display the component in your app

```diff
// ...
+ import ScriptOne from "./ScriptOne"

fcl.config()
 .put("challenge.handshake", "<http://localhost:8701/flow/authenticate>")

function App() {
  return (
    <div className="App">
      <CurrentUser/>
+     <ScriptOne/>
    </div>
  )
}
```

Go ahead and test out your new script!

### Query Flow Accounts

A common use for Cadence scripts is to acquire information about a Flow account's public state and its **[resources](notion://www.notion.so/dapperlabs/resources)**. Here is an example of a script you might use to query and use another account's public resources.

```jsx
const response = await fcl.send([
    sdk.script`
	import HelloWorld from 0x02

	pub fun main() {
	    let helloAccount = getAccount(0x02)
	    let helloCapability = helloAccount.getCapability(/public/Hello)
	    let helloReference = helloCapability!.borrow<&HelloWorld.HelloAsset>()

	    log(helloReference?.hello())
	}
    `,
])
```

### Register and Use a Custom Decoder

Cadence scripts can return complex Cadence data-types. These return values are sent over-the-wire to your JavaScript code. You'll handle parsing and transforming custom Cadence data-types using **custom decoders**.

Given this Cadence script that returns `[SomeStruct(x: 1, y: 2), SomeStruct(x: 3, y: 4)]` 

```jsx
 const response = await fcl.send([
      fcl.script`
      pub struct SomeStruct {
        pub var x: Int
        pub var y: Int

        init(x: Int, y: Int) {
          self.x = x
          self.y = y
        }
      }

      pub fun main(): [SomeStruct] {
        return [SomeStruct(x: 1, y: 2), SomeStruct(x: 3, y: 4)]
      }
    `,
  ])
```

We would like to transform `SomeStruct(x: 1, y: 2)` into a JavaScript data-structure.

```jsx
class Point {
  constructor ({ x, y }) {
    this.x = x
    thix.y = y
  }
}
```

Registering a decoding function using the code below will ensure that the response from `fcl.send` will contain  `Point` objects wherever a `SomeStruct` Cadence type is returned.

```diff
+ import MyObjectDecoder from "./MyObjectDecoder"
// ...

fcl.config()
  .put("challenge.handshake", "<http://localhost:8701/flow/authenticate>")
+ .put("decoder.SomeStruct", data => new Point(data))

// ...
```

Here is a completed component that contains the script that will trigger our new decoding function. Create a file named `ScriptTwo` in the `src` directory of your app.

```jsx
import React, {useState} from "react"
import styled from "@emotion/styled"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Header = styled.div``
const Button = styled.button``
const Results = styled.pre``

export default function ScriptTwo() {
  const [data, setData] = useState(null)

  const runScript = async e => {
    e.preventDefault()
    const response = await fcl.send([
      fcl.script`
        pub struct SomeStruct {
          pub var x: Int
          pub var y: Int

          init(x: Int, y: Int) {
            self.x = x
            self.y = y
          }
        }

        pub fun main(): [SomeStruct] {
          return [SomeStruct(x: 1, y: 2), SomeStruct(x: 3, y: 4)]
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Root>
      <Header>Script Two</Header>
      <Button onClick={runScript}>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
      <span>{data && data !== null && data[0].constructor.name} 1 </span> <!-- "Point 1" -->
      <span>{data && data !== null && data[1].constructor.name} 2 </span> <!-- "Point 2" -->
    </Root>
  )
}
```

Display the `ScriptTwo` component in your app

```diff
// ...

import CurrentUser from "./CurrentUser"
import ScriptOne from "./ScriptOne"
import ScriptTwo from "./ScriptTwo"

// ...

function App() {
  return (
    <div className="App">
      <CurrentUser/>
      <ScriptOne/>
+     <ScriptTwo/>
    </div>
  )
}

```

## Execute a Cadence Transaction

Flow Transactions are used to *move* **[resources](notion://www.notion.so/dapperlabs/resources)** and interact with smart contracts on behalf of Flow accounts. `@onflow` provides flexible primitives composing authorizing and paying for Transactions on Flow.

`@onflow` allows for specifying the **payer**, **proposer** and **authorizer** of transactions on Flow. 

Describing the specifics of how to compose Flow transactions is beyond the scope of this guide. For more information about how to build Flow transactions you can read the [https://docs.onflow.org/docs/cadence#transactions](docs).

### Simple Transaction

To send a transaction you must supply a **payer** and **proposer**. In the following transaction the current user we authenticated earlier is used for each. `@onflow/fcl` will use the configured wallet to sign this transaction on behalf of the current user.

```jsx
const response = await fcl.send([
  fcl.transaction`
    transaction {
      execute {
        log("A transaction happened")
      }
    }
  `,
  fcl.proposer(fcl.currentUser().authorization),
  fcl.payer(fcl.currentUser().authorization),
])
```

You can subscribe to the result of a transaction in your client code.

```jsx
 const unsub = fcl.tx(response).subscribe(transaction => {
     if (fcl.tx.isSealed(transaction)) {
       setState("Transaction Confirmed: Is Sealed")
       unsub()
     }
})
```

Here is a completed component that contains the transaction above. Create a file named `TransactionOne` in the `src` directory of your app.

```jsx
import React, {useState, useEffect} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Button = styled.button``
const Status = styled.pre``

export default function TransactionOne() {
  const [status, setStatus] = useState("Not Started")
  const runTransaction = async e => {
    e.preventDefault()
    setStatus("Resolving...")
    
    const response = await fcl.send([
      fcl.transaction`
        transaction {
          execute {
            log("A transaction happened")
          }
        }
      `,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
    ])

    setStatus("Transaction Sent, Waiting for Confirmation")

    const unsub = fcl.tx(response).subscribe(transaction => {
      if (fcl.tx.isSealed(transaction)) {
        setStatus("Transaction Confirmed: Is Sealed")
        unsub()
      }
    })
  }

  return (
    <Root>
      <Button onClick={runTransaction}>Run Transaction</Button>
      <Status>{status}</Status>
    </Root>
  )
}

```

Display the `TransactionOne` component in your app

```diff
// ...

import CurrentUser from "./CurrentUser"
import ScriptOne from "./ScriptOne"
import ScriptTwo from "./ScriptTwo"
+ import TransactionOne from "./Transaction"

// ...

function App() {
  return (
    <div className="App">
      <CurrentUser/>
      <ScriptOne/>
      <ScriptTwo/>
+     <TransactionOne/>
    </div>
  )
}
```

# Moving to Production

Our application is complete!

To deploy your app, you'll need to modify your configuration. Once the Flow Mainnet is live you'll be able to obtain an production Access Node API url and API Key. More on this soon!

```jsx
if(process.env.NODE_ENV === 'development') {
    fcl.config()
       .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
}

if (process.env.NODE_ENV === "production") {
    fcl.config()
       .put("accessNode.api", process.env.ACCESS_NODE_API)
       .put("accessNode.key", process.env.ACCESS_NODE_KEY)
} 
```

# Final Thoughts

Congratulations you've completed a tour of the basic functionality of `@onflow/fcl` by completing the following tasks

- Use `@onflow/fcl`  to  perform authentication and authorization of Flow accounts
- Use `@onflow/fcl`  to send scripts and transactions to the Flow blockchain emulator
- Install and use  the Flow blockchain emulator (`flow`)
- Install and use the FCL Dev Wallet (`fcl-wallet`) to simulate connection between your app, `@onflow/fcl` and a user's 3rd party key management software
- Configure `@onflow/fcl` for a production deployment

Hopefully this give you a head start developing your idea on Flow! Thanks for reading.
