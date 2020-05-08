# @onflow/fcl -- authentication

The concept of authentication in FCL is tied closely to FCLs concept of CurrentUser, in fact `fcl.authenticate` and `fcl.unauthenticate` are both aliases to `fcl.currentUser().authenticate()` and `fcl.currentUser().unauthenticate()` respectively. So lets look at current user.

As a dapp developer, using FCL, our current thought is to enable three main pieces of functionality.

- How to know the currentUser and if they are logged in.
- How to log a user in.
- How to log a user out.

Do to the nature of how FCL works, loggin a user in and signing a user up are the same thing.

# Knowing things about the current user

FCL provides two ways of getting the current users information. One way is a promise that returns a snapshot of the info, while the other way allows you to subscribe to info, calling a callback function with the latest info anytime it changes.

### Snapshot of Current User

```javascript
import * as fcl from "@onflow/fcl"

const currentUser = await fcl.currentUser().snapshot()
console.log("The Current User", currentUser)
```

### Subscribe to Current User

```javascript
import * as fcl from "@onflow/fcl"

// Returns an unsubscribe function
const unsubscribe = fcl.currentUser()
  .subscribe(currentUser => {
    console.log("The Current User", currentUser)
  })
```

# Actually Authenticating and Unauthenticating

The TL;DR is to call `fcl.authenticate()` and `fcl.unauthenticate()` respectively.

On Flow mainnet, you wont even need to configure anything for this to work, the users of your dapp will go through the authentication process and be able to use any FCL compatible wallet providers.

During development you will probably want to configure your dapp to use [`@onflow/dev-wallet`](../../../dev-wallet), the [Quick Start](../../#quick-start) guide will walk you through using it.

We know this can all be fairly overwhelming, we are commited to help though. If you run into any problems, reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are more than happy to help out.
