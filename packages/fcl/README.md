# @onflow/fcl

A high level abstraction (built on top of [@onflow/sdk](../sdk)) that enables development of browser based dApps.

# Status

- **Last Updated:** May 7th 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

We are currently confident in how to consume this package and how to build it, but this module is currently in a very incomplete state and not everything works yet.

- `config`, `decode` and `send` are in a working state.
- `currentUser` and `tx` are in a working state.
- `authenticate` and `unauthenticate` are working with the dev wallet, but do not yet persist a session
- The authentication portion of `currentUser` is working with the dev wallet
- `user` is currently blocked by not storing public data on chain, we are working towards this, but its currently lower on our priority list.
- Work on `events` hasn't started yet, but should be straight forward once it has, we believe it will be similar to how we did `tx`.
- `@onflow/sdk` has been proxied through the module, so now consumers of `@onflow/fcl` no longer need to worry about keeping versions in sync.

# Install

```bash
npm install --save @onflow/fcl
```

# Overview

- [ ] Docs
  - [ ] [Quick Start](#quick-start) -- From zero to users submitting transactions.
  - [x] [Configuration](./src/config) -- Configure FCL.
  - [ ] [Authentication](./src/authentication) -- Authenticate Users using FCL wallet providers.
  - [ ] [Current User](./src/current-user) -- Know things about the Current User
  - [ ] [Scripts](./src/scripts) -- Query data from the Flow blockchain.
  - [ ] [Transactions](./src/transactions) -- Send transactions to the Flow blockchain.
  - [ ] [Emulator Docs](https://github.com/onflow/flow/blob/master/docs/emulator.md) -- Documentation for the Emulator
  - [ ] [Dev Wallet Docs](../dev-wallet) -- Documenation for the Dev Wallet
  - [ ] [FCL Wallet Provider Spec](./src/wallet-provider-spec) -- Documentation for Wallet Providers
    - [ ] [Wallet Discovery](./src/wallet-provider-spec/wallet-discovery) -- How FCL discovers wallets providers
    - [ ] [Custodial Wallet Provider Spec](./src/wallet-provider-spec/custodial.md) -- Documentation for Custodial Wallet Provider
    - [ ] [Non-Custodial Wallet Provider Spec](src/wallet-provider-spec/non-custodial.md) -- Documentation for Non-Custodial Wallet Providers

# Work in Progress

- [ ] Persistent Current User Session
- `fcl.events(...)` _(Not MVP)_
  - [ ] `fcl.events(...).subscribe(callback)` _(Not MVP)_
- [`fcl.decode(response)`](./src/decode)
  - [ ] Custom qualified decoders _(Not MVP)_
- `fcl.user(addr)` _(blocked)_
  - [ ] `fcl.user(addr).snapshot()` _(blocked)_
  - [ ] `fcl.user(addr).subscribe(callback)` _(blocked)_
  - [ ] `fcl.user(addr).authorization` _(blocked)_
  - [ ] `fcl.user(addr).param(key)` _(blocked)_
  - [ ] `fcl.user(addr).info()` _(blocked)_

# Quick Start

From zero to users submitting transactions.

_This is coming very soon_

# Usage

**Authentication Example**

```javascript
import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

fcl.config().put("challenge.scope", "email")

export const Profile = () => {
  const [user, setUser] = useState(null)
  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  if (user == null) return <div>Loading...</div>

  if (!user.loggedIn)
    return (
      <div>
        <button onClick={fcl.authenticate}>Sign In</button>
      </div>
    )

  return (
    <div>
      <div>
        <button onClick={fcl.authenticate}>Sign Up</button>
      </div>
      <div>
        <div>
          <img
            src={user.avatar || "http://placekitten.com/g/100/100"}
            width="100"
            height="100"
          />
          {user.name || "Anonymous"}
        </div>
        <button onClick={fcl.unauthenticate}>Sign Out</button>
      </div>
    </div>
  )
}
```

**Transaction Example**

```javascript
import * as fcl from "@onflow/fcl"

const response = await fcl.send([
  fcl.transaction`
    transaction {
      execute {
        log("rawr")
      }
    }
  `,
  fcl.proposer(fcl.currentUser().authorization),
  fcl.payer(fcl.currentUser().authorization),
])

const unsub = fcl.tx(response).subscribe(transaction => {
  console.log("Sub -- Transaction Status", transaction)
  if (fcl.tx.isSealed(transaction)) unsub()
})

const transaction = await fcl.tx(response).onceSealed()
console.log("await -- Transaction Sealed", transaction)
```

**Script**

```javascript
import * as fcl from "@onflow/fcl"

function Woot({x, y}) {
  if (!(this instanceof Woot)) return new Woot(...arguments)
  this.x = x
  this.y = y
}

fcl.config().put("decoder.Woot", Woot)

const response = await fcl.send([
  sdk.script`
    pub struct Woot {
      pub var x: Int
      pub var y: Int

      init(x: Int, y: Int) {
        self.x = x
        self.y = y
      }
    }

    pub fun main(): [Woot] {
      return [Woot(x: 1, y: 2), Woot(x: 3, y: 4), Woot(x: 5, y: 6)]
    }
  `,
])

const data = await fcl.decode(response)
console.log("DATA", data)
```
