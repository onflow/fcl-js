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

- [ ] [Quick Start](#quick-start) -- From zero to users interacting with the Flow blockchain using a dapp you made.
- [Configuration](./src/config) -- Configure FCL.
- [ ] [Authentication](./src/authentication) -- Authenticate Users using FCL wallet providers.
- [ ] [Current User](./src/current-user) -- Know things about the Current User.
- [ ] [Scripts](./src/scripts) -- Query data from the Flow blockchain.
- [ ] [Transactions](./src/transactions) -- Send transactions to the Flow blockchain.
- [Emulator Docs](https://github.com/onflow/flow/blob/master/docs/emulator.md) -- Documentation for the Emulator.
- [Dev Wallet Docs](../dev-wallet) -- Documenation for the Dev Wallet.
- [FCL Wallet Provider Spec](./src/wallet-provider-spec) -- **WIP** Documentation for Wallet Providers.
  - [Wallet Discovery](./src/wallet-provider-spec/wallet-discovery) -- **Coming Soon** How FCL discovers wallets providers.
  - [Custodial Wallet Provider Spec](./src/wallet-provider-spec/custodial.md) -- Documentation for Custodial Wallet Provider.
  - [Non-Custodial Wallet Provider Spec](src/wallet-provider-spec/non-custodial.md) -- **Coming Soon** Documentation for Non-Custodial Wallet Providers.

# Todo List

- [ ] Persistent Current User Session
- [ ] `fcl.events(...)`-- Subscribging to onchain events
- [ ] `fcl.user(addr)` -- Subscribing to onchain public identity info

# Quick Start

From zero to users interacting with the Flow blockchain using a dapp you made.

> **NOTE** This quick start will **NOT** go into the deployment of contracts. We will supply a more comprehensive tutorial covering this soon, so stay tuned.

- **Last Updated:** May 7th 2020

### Brief

We are going to:

- Create a small React app that highlights some core FCL concepts
- Install and start the emulator `flow`
- Install and start the FCL Dev Wallet (`fcl-wallet`)

The React App will be representative of the dapp you want to make. Durring development we will be using the `fcl-wallet` to act as a custodial wallet that we can authenticate with as well as authorize transactions, the emulator `flow` will act as an Access Node. Access Nodes are our gateway to the blockchain.
With these three things we can create a dapp in development, and then once there is a Flow Mainnet/Testnet, all we need to do is change some configuration values and our dapp should work there too.

### Creating the React App

In this example we will be using [React](https://reactjs.org/) and [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). But there really isn't anything stopping you from using any other framwork you choose.

To use Create React App to create a React App we need to run:

```bash
npx create-react-app my-dapp
```

This will take a little bit of time but afterwords we will have a bootstrapped directory called `my-dapp` which will have a ready-to-go React App. Once done, lets change into that directory and install some dependencies.

```bash
cd my-dapp
npm install --save @onflow/fcl styled-components
npm install --save-dev @onflow/dev-wallet
```

The above installed two run time dependencies for us (`@onflow/fcl` and `styled-components`), as well as the development dependency `@onflow/dev-wallet`

- `@onflow/fcl` will be the library we use to interact with the Flow blockchain.
- `styled-components` will let us add a little
- `@onflow/dev-wallet` will act as our custodial wallet that can authenticate and authorize transaction.

### Installing and Starting the Emulator

The Flow emulator is a lightweight tool that emulates the behaviour of the real Flow network that we can use during development.

We cannot run the emulator if we do not have the emulator. The emulator comes bundled with the [`Flow CLI`](https://github.com/onflow/flow/blob/master/docs/cli.md) you can install that following these [instructions](https://github.com/onflow/flow/blob/master/docs/cli.md#installation).

After `Flow CLI` has been installed, lets get the emulator up and running.

```bash
flow emulator start --init
```

Running the above should have started the emulator, as well as created a `flow.json` file that configures it. In the future, you will not need to use the `--init` flag if you start the emulator from a directory that already has the `flow.json` file.
At this point in time, you should the emulator running and a `flow.json` file that looks something like this:

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

You will need the value for `accounts.root.privateKey` in the `flow.json` shortly when we go to start up the dev-wallet, which is our next step.

### Starting up the dev-wallet

```json
{
  "scripts": {
    "dev:wallet": "PK=e19081c8964b8dcf3902cc71e37d1f07f86fb357d79dd2fb57006419e0f95e95 fcl-wallet"
  }
}
```

```bash
npm run dev:wallet
```

```
@onflow/dev-wallet@0.0.4
*** *** *** *** *** *** ***

🎉 FCL Dev Wallet has started:
* Origin:       http://localhost:8701
* FCL Authn:    http://localhost:8701/flow/authenticate
* GraphiQL:     http://localhost:8701/graphql
* Access Node:  http://localhost:8080
* Root Address: 01
* Private Key:  e19081c8964b8dcf3902cc71e37d1f07f86fb357d79dd2fb57006419e0f95e95

Include this code in development to configure fcl:

import * as fcl from "@onflow/fcl"

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

*** *** *** *** *** *** ***
```

### Start Up our Dapp

```bash
npm start
```

### Configure FCL to use the dev wallet

```diff
// src/App.js
import React from "react";
import logo from "./logo.svg";
import "./App.css";
+  import * as fcl from "@onflow/fcl";
+
+  fcl.config()
+    .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
+
function App() {
  // ...
}
```

### Authentication

```javascript
// src/CurrentUser.js
import React, {useState, useEffect} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Img = styled.img`
  width: 35px;
  height: 35px;
`
const Button = styled.button``

const SignIn = () => {
  const [user, setUser] = useState(null)
  useEffect(() => fcl.currentUser().subscribe(setUser), [])
  if (user == null) return null

  if (user.loggedIn) return null
  return <Button onClick={fcl.authenticate}>Sign In/Up</Button>
}

const Profile = () => {
  const [user, setUser] = useState(null)
  useEffect(() => fcl.currentUser().subscribe(setUser), [])
  if (user == null) return null

  if (!user.loggedIn) return null
  return (
    <>
      {user.identity.avater && <Img src={user.identity.avatar} />}
      <Name>{user.identity.name || "Anonymous"}</Name>
      <Button onClick={fcl.unauthenticate}>Sign Out</button>
    </>
  )
}

export default function CurrentUser() {
  return (
    <Root>
      <SignIn />
      <Profile />
    </Root>
  )
}
```

```diff
// src/App.js
// ...
+
+  import CurrentUser from "./CurrentUser"
+
fcl.config()
 .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

function App() {
  return (
    <div className="App">
+      <CurrentUser/>
      <header className="App-header">
        {/*...*/}
      </header>
    </div>
  )
}
```

### Our First Script

```javascript
// src/ScriptOne.js
import React, {useState} from "react"
import styled from "styled-components"
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
          return 7 + 4
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Root>
      <Header>Script One</Header>
      <Button>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
    </Root>
  )
}
```

```diff
// src/App.js
// ...
import CurrentUser from "./CurrentUser"
+  import ScriptOne from "./ScriptOne"

// ...

function App() {
  return (
    <div className="App">
      <CurrentUser/>
+      <ScriptOne/>
      <header className="App-header">
        {/*...*/}
      </header>
    </div>
  )
}

```

### A more complex Script

```javascript
// woot.js
export function Woot({x, y}) {
  this.x = x
  this.y = y
}
```

```diff
// App.js
+ import Woot from "./woot"
// ...
fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
+  .put("decoder.Woot", woot => new Woot(woot))

// ...
```

```javascript
// src/ScriptTwo.js
import React, {useState} from "react"
import styled from "styled-components"
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
        pub struct Woot {
          pub var x: Int
          pub var y: Int

          init(x: Int, y: Int) {
            self.x = x
            self.y = y
          }
        }

        pub fun main(): [Woot] {
          return [Woot(x: 1, y: 2), Woot(x: 3, y: 4)]
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Root>
      <Header>Script Two</Header>
      <Button>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
    </Root>
  )
}
```

```diff
// src/App.js
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
+      <ScriptTwo/>
      <header className="App-header">
        {/*...*/}
      </header>
    </div>
  )
}
```

### Transaction Time

```javascript
// src/Transaction.js
import React, {useState, useEffect} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Button = styled.button``
const Status = styled.pre``

export default function Transaction() {
  const [status, setStatus] = useState("Not Started")
  const runTransaction = async e => {
    e.preventDefault()
    setState("Resolving...")
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
    setState("Transaction Sent, Waiting for Confirmation")
    const unsub = fcl.tx(response).subscribe(transaction => {
      if (fcl.tx.isSealed(transaction)) {
        setState("Transaction Confirmed: Is Sealed")
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

```diff
// src/App.js
// ...
import CurrentUser from "./CurrentUser"
import ScriptOne from "./ScriptOne"
import ScriptTwo from "./ScriptTwo"
+ import Transaction from "./Transaction"

// ...

function App() {
  return (
    <div className="App">
      <CurrentUser/>
      <ScriptOne/>
      <ScriptTwo/>
+      <Transaction/>
      <header className="App-header">
        {/*...*/}
      </header>
    </div>
  )
}
```
