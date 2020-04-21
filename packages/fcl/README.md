# @onflow/fcl

A high level abstraction (built on top of [@onflow/sdk](../sdk)) that enables development of browser based dApps.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** No
- **Risk of Breaking Change:** Medium

We are currently confident in how to consume this package and how to build it, but this module is currently in a very incomplete state and not everything works yet.

# Install

```bash
npm install --save @onflow/fcl
```

You will probably also want: [`@onflow/sdk`](../sdk) and [`@onflow/types`](../types)

# Overview

- [x] [`fcl.config()`](./src/config) _(done)_
  - [x] `fcl.config().put(key, value)` _(done)_
  - [x] `fcl.config().get(key)` _(done)_
  - [x] `fcl.config().get(key, fallback)` _(done)_
  - [x] `fcl.config().update(key, transform)` _(done)_
  - [x] `fcl.config().delete(key)` _(done)_
  - [x] `fcl.config().where(regexp)` _(done)_
  - [x] `fcl.config().subscribe(callback)` _(done)_
- [ ] `fcl.authenticate()` _(wip)_
- [ ] `fcl.unauthenticate()` _(wip)_
- [ ] `fcl.currentUser()` _(wip)_
  - [ ] `fcl.currentUser().snapshot()` _(wip)_
  - [ ] `fcl.currentUser().subscribe(callback)` _(wip)_
  - [ ] `fcl.currentUser().authorization` _(wip)_
  - [ ] `fcl.currentUser().payerAuthorization` _(wip)_
  - [ ] `fcl.currentUser().proposerAuthorization` _(wip)_
  - [ ] `fcl.currentUser().param(key)` _(wip)_
- [ ] [`fcl.user(addr)`](./src/user) _(wip)_
  - [ ] `fcl.user(addr).snapshot()` _(wip)_
  - [ ] `fcl.user(addr).subscribe(callback)` _(wip)_
  - [ ] `fcl.user(addr).authorization` _(wip)_
  - [ ] `fcl.user(addr).payerAuthorization` _(wip)_
  - [ ] `fcl.user(addr).proposerAuthorization` _(wip)_
  - [ ] `fcl.user(addr).param(key)` _(wip)_
- [ ] `fcl.transaction(transactionId)` _(wip)_
  - [ ] `fcl.transaction(transactionId).snapshot()` _(wip)_
  - [ ] `fcl.transaction(transactionId).subscribe(callback)` _(wip)_
- [ ] `fcl.events(...)` _(EARLY VERY UNSTABLE)_
  - [ ] `fcl.events(...).subscribe(callback)` _(EARLY VERY UNSTABLE)_
- [ ] [`fcl.send(builders)`](./src/send) _(WIP)_
  - [ ] Configure `fcl.send` _(WIP)_
- [ ] `fcl.decode(response)` _(WIP)_
  - [ ] Configure `fcl.decode` _(WIP)_
    - [ ] Custom qualified decoders _(WIP)_
    - [ ] Custom unqualified decoders _(WIP)_

# Usage

**Authentication Example**

```javascript
import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

fcl.config().put("challenge.scope", "email+publicKey")

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
