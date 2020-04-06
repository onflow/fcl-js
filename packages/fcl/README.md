# FCL

> This module provides a high level opinionated use of various parts of the Flow SDK.

## Exposed

### `config/1` and `config/2`

> Key/Value Store used to configure the internals of fcl.

**Progress**
- [ ] `fcl.config/1`
- [ ] `fcl.config/2`


**config/1**

> Asynchronously fetches the config value

**config/2**

> Sets the value for a given key in the config.


```javascript
import { config } from "@onflow/fcl"

config("foo", "bar")
await config("foo") // "bar"

// you can remove values by setting them to undefined

config("foo", undefined)
await config("foo") // undefined
```

### "currentUser/0"

> `fcl.currentUser/0` returns things you can do with the current user.

**Progress**
- [ ] `fcl.currentUser/0`
- [ ] `fcl.currentUser/0.subsribe/1`
- [ ] `fcl.currentUser/0.authorization/n`
- [ ] `fcl.currentUser/0.payerAuthorization/n`

**`fcl.currentUser/0.subscribe/1`**

> Reactively calls the callback with the identity of the current user anytime the knowledge of the currentUser changes. Returns an unsubscribe function.

```javascript
import React, {useState, useEffect} from "react"
import {currentUser} from "@onflow/fcl"

export const CurrentUser = () => {
  const [user, setUser] = useState({})
  useEffect(() => currentUser.subscribe(setUser), [])

  return user.DID == null
    ? null
    : <div>
        <img src={user.avatar || "https://fallback.avatar.com"}/>
        <div>{user.name || "Anonymous"}</div>
      </div>
}
```

**`fcl.currentUser/0.authorization` and `fcl.currentUser/0.payerAuthorization/n`**

> Used in conjunction with `fcl.send/n` to specify a required authorization by the currentUser.

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const runTransaction = async (to, amount) =>
  fcl.send([
    sdk.transaction`
      transaction(to: Address, amount: UFix64) {
        prepare(from: AuthAccount) { … }
        execute { … }
      }
    `,
    sdk.params([
      fcl.user(to).param,
      sdk.param(amount, t.UFix64),
    ]),
    sdk.authorizations([
      fcl.currentUser().authorization
    ]),
    sdk.payer(fcl.currentUser().payerAuthorization)
  ])
```

### "user/1"

> `fcl.user/1` returns things you can do with the supplied user.

**Progress**
- [ ] `fcl.user/1`
- [ ] `fcl.user/1.subscribe/1`
- [ ] `fcl.user/1.authorization/n`
- [ ] `fcl.user/1.payerAuthorization/n`

**`fcl.user/1.subscribe`**

> Reactively calls the callback with the identity of the supplied user anytime the knowledge of the supplied user changes. Returns an unsubscribe function.

```javascript
import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export const User = ({ flowAcctNumber }) => {
  const [user, setUser] = userState({})
  useEffect(() => fcl.user(flowAcctNumber).subscribe(setUser), [])

  return user.DID == null
    ? null
    : <div>
        <img src={user.avatar || "https://fallback.avatar.com"}/>
        <div>{user.name || "Anonymous"}</div>
      </div>
}
```

**`fcl.user/1.authorization/n` and `fcl.user/1.payerAuthorization`**

> Used in conjunction with `fcl.send/n` to specify a required authorization by a supplied user.

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const runTransaction = async (from, amount) =>
  fcl.send([
    sdk.transaction`
      transaction(to: Address, amount: UFix64) {
        prepare(from: AuthAccount) { … }
        execute { … }
      }
    `,
    sdk.params([
      fcl.currentUser().param,
      sdk.param(amount, t.UFix64),
    ]),
    sdk.authorizations([
      fcl.user(from).authorization,
    ]),
    sdk.payer(fcl.user(from).payerAuthorization)
  ])
```

### `transaction/1`

> EARLY WIP

**Progress**
- [ ] `fcl.transaction/1`
- [ ] `fcl.transaction/1.subscribe/1`

### `event/1`, `event/2` and `event/3`

> EARLY WIP

**Progress**
- [ ] `fcl.events/1`
- [ ] `fcl.events/2`
- [ ] `fcl.events/3`
- [ ] `fcl.events/n.subscribe/1`

### "authenticate/0" and `unauthenticate/0`

> Authenticates and unauthenticates the currentUser.

**Progress**
- [ ] `fcl.authenticate/0`
- [ ] `fcl.unauthenticate/0`

```javascript
import React, {useState, useEffect} from "react"
import { currentUser, authenticate, unauthenticate } from "@onflow/fcl"

export const AuthButton = () => {
  const [user, setUser] = useState({})
  useEffect(() => currentUser().subscribe(setUser), [])

  return user.DID != null
    ? <button onClick={unauthenticate}>Log Out</button>
    : <button onClick={authenticate}>Log In</button>
}
```

### `send/1` and `send/2`

> An opinionated use of the build/resolve/send pipeline. Comes preconfigured to work with params, async remote signing and payer.

**Progress**
- [x] `fcl.send/1`
- [x] `fcl.send/2`

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

fcl.config("accessNode.api", "https://my.access.node")
fcl.config("accessNode.key", process.env.FLOW_ACCESS_NODE_API_KEY)

const runTransaction = async (to, amount) =>
  fcl.send([
    sdk.transaction`
      transaction(to: Address, amount: UFix64) {
        prepare(from: AuthAccount) { … }
        execute { … }
      }
    `,
    sdk.params([
      fcl.user(to).param,
      sdk.param(amount, t.UFix64),
    ]),
    sdk.authorizations([
      fcl.currentUser().authorization
    ]),
    sdk.payer(fcl.currentUser().payerAuthorization)
  ])
```

### `decode/1`

> An opinionated use of the decode function. Allows for global configuration of custom resources.

**Progress**
- [ ] `fcl.decode/1`

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"

class MyCustomResource {
  consturctor(data) {
    this.name = data.name || "Anonymous"
    this.age = data.age || 0
  }
}

fcl.config("decode.MyCustomResource", data => new MyCustomResource(data))

const getStuff = async () => {
  const response = await fcl.send([
    sdk.script`
      import MyCustomResource from 0x___

      pub fun main(): @[MyCustomResource] {
        ...
      }
    `
  ])

  const arrayOfMyCustomResource = await fcl.decode(response)

  …
}

```
