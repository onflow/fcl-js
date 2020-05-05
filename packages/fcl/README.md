# @onflow/fcl

A high level abstraction (built on top of [@onflow/sdk](../sdk)) that enables development of browser based dApps.

# Status

- **Last Updated:** May 5th 2020
- **Stable:** No
- **Risk of Breaking Change:** Medium

We are currently confident in how to consume this package and how to build it, but this module is currently in a very incomplete state and not everything works yet.

- `config`, `decode` and `send` are in a working state.
- `subscribe`, `snapshot` and `info` are in a working state.
- `authenticate` and `unauthenticate` are working with the dev wallet, but do not yet persist a session
- The authentication portion of `currentUser` is working with the dev wallet
- We are waiting on some upstream changes before we can make the `currentUser` authorization portion work as expected
- `user` is currently blocked by not storing public data on chain, we are working towards this, but its currently lower on our priority list
- Work on `events` and `transactions` hasn't started yet, but should be straight forward once it has.

# Install

```bash
npm install --save @onflow/fcl
```

You will probably also want: [`@onflow/sdk`](../sdk) and [`@onflow/types`](../types)

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
- [ ] [`fcl.currentUser()`](./src/current-user) _(wip)_
  - [x] `fcl.currentUser().snapshot()`
  - [x] `fcl.currentUser().subscribe(callback)`
  - [x] `fcl.currentUser().authenticate()`
    - [ ] Current User Persistent Session
  - [x] `fcl.currentUser().unauthenticate()`
  - [ ] `fcl.currentUser().authorization` _(wip)_
  - [ ] `fcl.currentUser().param(key)` _(Pending Dep Update)_
  - [x] `fcl.currentUser().info()`
- [ ] `fcl.transaction(transactionId)` _(not started)_
  - [ ] `fcl.transaction(transactionId).snapshot()` _(not started)_
  - [ ] `fcl.transaction(transactionId).subscribe(callback)` _(not started)_
  - [ ] `fcl.transaction(transactionId).onceSealed()` _(not started)_
- [ ] `fcl.events(...)` _(not_started)_
  - [ ] `fcl.events(...).subscribe(callback)` _(not started)_
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

  return !user.loggedIn ? (
    <div>
      <button onClick={fcl.authenticate}>Sign In</button>
      <button onClick={fcl.authenticate}>Sign Up</button>
    </div>
  ) : (
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
  )
}
```

**Transaction Example**

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as six from "@onflow/six" // Comming Soon (Saved Interactions)
import * as t from "@onflow/types"

fcl.config().put("send.node", "https://accessNodeUrl")

const response = await fcl.send([
  sdk.transaction(six.SEND_FLOW_TOKENS),
  sdk.params([fcl.user(toAddress).param(), sdk.param(amount, t.UFix64)]),
  sdk.payer(fcl.currentUser().payerAuthorization),
  sdk.proposer(fcl.currentUser().proposerAuthorization),
  sdk.authorizations([fcl.currentUser().authorization]),
])

const unsub = fcl.transaction(response).subscribe(status => {
  if (sdk.isSealed(status)) unsub()
  console.log(status)
})
```

**Script**

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

fcl.config().put("decoder.SomeNFT", d => new SomeToken(d))

// query for onchain nfts
const response = await fcl.send([
  sdk.script`
    import SomeNFT, getAllForAddress from 0x....

    pub fun main(addr: Address): @[SomeNFT] {
      let nfts: [SomeNFT] = getAllForAddress(addr: Address)
      return nfts
    }
  `,
  sdk.params([fcl.currentUser().param()]),
])

const results = await fcl.decode(response)
```
