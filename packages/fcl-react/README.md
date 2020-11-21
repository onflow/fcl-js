# @onflow/fcl-react

Helpful FCL Hooks for React

**IMPORTANT** This currently requires `npm install --save @onflow/fcl@alpha`

## Install

> Has two peer dependencies: `@onflow/fcl` and `react`

```sh
npm install --save @onflow/fcl-react @onflow/fcl
```

## Usage

```javascript
// Exposes
// - useCurrentUser
// - useAccount
// - useConfig
// - useScript
// - useTransaction
import {
  useCurrentUser,
  useAccount,
  useConfig,
  useScript,
  useTransaction,
} from "@onflow/fcl-react"
```

### useCurrentUser

Returns the current user and a boolean saying if they are logged in or not.

```javascript
import * as fcl from "@onflow/fcl"
import {useCurrentUser} from "@onflow/fcl-react"

export function Rawr() {
  const [user, loggedIn] = useCurrentUser()

  if (!loggedIn) {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <ul>
        <li>Flow Address: {fcl.display(user.addr)}</li>
        <li>Composite ID: {user.cid}</li>
      </ul>
      <button onClick={fcl.unauthenticate}>Log Out</button>
      <button onClick={fcl.reauthenticate}>Change Account</button>
    </div>
  )
}
```

### useAccount

Given an address, returns the accounts info.

```javascript
import * as fcl from "@onflow/fcl"
import {useCurrentUser, useAccount, fmtFlow} from "@onflow/fcl-react"

export function Rawr() {
  const [user] = useCurrentUser()
  const [acct, refetchAcct] = useAccount(user.addr)

  // prettier-ignore
  if (acct == null) return <div>Loading Account...</div>

  return (
    <div>
      <h3>General Info</h3>
      <ul>
        <li>Address: {fcl.display(acct.address)}</li>
        <li>Balance: {fmtFlow(acct.balance)}</li>
      </ul>
      <h3>Keys</h3>
      <ul>
        {acct.keys.map(key => (
          <li>
            <pre key={key.index}>{JSON.stringify(key, null, 2)}</pre>
          </li>
        ))}
      </ul>
      <h3>Code</h3>
      <pre>{acct.code}</pre>
    </div>
  )
}
```

### useConfig

Returns config values

```javascript
import {useConfig} from "@onflow/fcl-react"

export function Rawr() {
  const env = useConfig("env")
  const accessNode = useConfig("accessNode.api")
  const walletDiscovery = useConfig("challenge.handshake")

  return (
    <ul>
      <li>ENV: {env}</li>
      <li>Access Node: {accessNode}</li>
      <li>Wallet Discovery: {walletDiscovery}</li>
    </ul>
  )
}
```

### useScript

Defines a script, giving the component the ability to trigger the script and retrieve the result

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {useScript, useCurrentUser} from "@onflow/fcl-react"
import {useEffect, useCallback} from "react"

// prettier-ignore
fcl.config()
  .put("env", "testnet")
  .put("0xProfile", "0x1d007d755706c469")

export function Rawr() {
  const [user] = useCurrentUser()
  const [exec, profile] = useScript([
    fcl.script`
      import Profile from 0xProfile

      pub fun main(address: Address): Profile.ReadOnly? {
        return Profile.fetchProfile(address)
      }
    `
  ])

  // fetch the profile if there is a current user
  useEffect(() => {
    // prettier-ignore
    if (user.addr) exec([
      fcl.arg(user.addr, t.Address)
    ])
  }, [user.addr])

  // fetch the profile as needed (if there is a current user)
  const triggerScript = useCallback(() => {
    // prettier-ignore
    if (user.addr) exec([
      fcl.arg(user.addr, t.Address)
    ])
  }, [user.addr])

  // prettier-ignore
  if (profile == null) return <div>Loading Profile...</div>

  return <ul>
    <li><button onClick={triggerScript}>Refresh Profile</button></li>
    <li>Display Name: {profile.displayName}<li>
    <li>Color: {profile.color}</li>
    <li>Avatar: <img src={profile.avatar}/></li>
  </ul>
}
```

### useTransaction

Defines a transaction, giving the component the ability to trigger the transaction and stay updated on its progress.

```javascript
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {useTransaction, IDLE, SUCCESS} from "@onflow/fcl-react"
import {useState, useEffect} from "react"

// prettier-ignore
fcl.config()
  .put("env", "testnet")
  .put("0xProfile", "0x1d007d755706c469")

export function Rawr() {
  const [exec, status, txStatus, details] = useTransaction([
    fcl.transaction`
      import Profile from 0xProfile

      transaction(displayName: String) {
        prepare(account: AuthAccount) {
          account
            .borrow<&{Profile.Owner}>(from: Profile.privatePath)
            .setDisplayName(displayName)
        }
      }
    `,
  ])
  const [displayName, setDisplayName] = useState("")

  const triggerTransaction = callback(() => {
    // prettier-ignore
    exec([
      fcl.arg(displayName, t.String)
    ])
  }, [displayName])

  useEffect(() => {
    if (status === SUCCESS) setDisplayName("")
  }, [status])

  return (
    <div>
      <input
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
      />
      {status === IDLE ? (
        <button onClick={triggerTransaction}>Set DisplayName</button>
      ) : (
        <div>
          {status} -- {txStatus}
        </div>
      )}
      <pre>{JSON.stringify(details, null, 2)}</pre>
    </div>
  )
}
```
