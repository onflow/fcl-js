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

- [x] [`fcl.config()`](./src/config)
  - [x] `fcl.config().put(key, value)`
  - [x] `fcl.config().get(key)`
  - [x] `fcl.config().get(key, fallback)`
  - [x] `fcl.config().update(key, transform)`
  - [x] `fcl.config().delete(key)`
  - [x] `fcl.config().where(regexp)`
  - [x] `fcl.config().subscribe(callback)`
- [x] [`fcl.authenticate()`](./src/current-user)
- [x] [`fcl.unauthenticate()`](./src/current-user)
- [ ] [`fcl.currentUser()`](./src/current-user)
  - [x] `fcl.currentUser().snapshot()`
  - [x] `fcl.currentUser().subscribe(callback)`
  - [x] `fcl.currentUser().authenticate()`
    - [ ] Current User Persistent Session
  - [x] `fcl.currentUser().unauthenticate()`
  - [x] `fcl.currentUser().authorization`
  - [x] `fcl.currentUser().param(key)`
  - [x] `fcl.currentUser().info()`
- [x] `fcl.tx(transactionId)`
  - [x] `fcl.tx(transactionId).snapshot()`
  - [x] `fcl.tx(transactionId).subscribe(callback)`
  - [x] `fcl.tx(transactionId).onceSealed()`
- [ ] `fcl.events(...)` _(Not MVP)_
  - [ ] `fcl.events(...).subscribe(callback)` _(Not MVP)_
- [x] [`fcl.send(builders)`](./src/send)
  - [x] Configure `fcl.send`
- [x] [`fcl.decode(response)`](./src/decode)
  - [x] Configure `fcl.decode`
    - [x] Custom unqualified decoders
    - [ ] Custom qualified decoders _(Not MVP)_
- [ ] [`fcl.user(addr)`](./src/user) _(blocked)_
  - [ ] `fcl.user(addr).snapshot()` _(blocked)_
  - [ ] `fcl.user(addr).subscribe(callback)` _(blocked)_
  - [ ] `fcl.user(addr).authorization` _(blocked)_
  - [ ] `fcl.user(addr).param(key)` _(blocked)_
  - [ ] `fcl.user(addr).info()` _(blocked)_

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
