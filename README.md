# Flow Javascript SDK

**EARLY ALPHA**

## Introduction

The goal of the Flow Javascript SDK is to enable people to create incredible things on top of the [Flow blockchain](https://onflow.org).

To make developing on Flow as easy as possible, the Flow Javascript SDK needs to make it extremely easy to interact with Flow. The below snippet of code is the type of code we are aiming for:

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

const response = await fcl.send([
  sdk.params([
    param("to", "0x02", t.Address),
    param("amount", 10, t.Int),
  ]),

  sdk.authorization([
    fcl.currentUser().authorization // We dont think dapp developers should need to get into the details of how 
  ]),                             // a transaction is signed. Of course, you can always drop down to the sdk to
                                  // learn more if you really want to.

  sdk.payer(fcl.currentUser().payerAuthorization), // A feature of Flow is the people doing the transactions don't need to be
                                    // the ones paying for them. In this case it's going to be the same as the
                                    // account that is authorizing the transaction. FCL will aim to make this
                                    // as painless as possible.

  // Flow doesn't need ABIs, you can send Cadence code directly to the chain.
  // You can also read directly from the chain when you want to get stuff back out.
  sdk.transaction`
    import FungibleToken, FlowToken from 0x01
    
    // Above we specified an array of params.
    // Those params are passed into the transaction in the same order they are declared above.
    transaction(to: Address, amount: Int) {
      var temporaryVault: @FlowToken.Vault

      // Similar to the params, the accounts that are authorizating this transaction
      // are passed into the prepare statement in the same order they are declared above.
      prepare(acct: Account) {
        self.temporaryVault <- acct.storage[FlowToken.Vault]?.withdraw(amount: amount) ?? panic("No Vault!")
      }

      execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.published[&FungibleToken.Receiver] ?? panic("No receiver!")
        receiverRef.deposit(from: <-self.temporaryVault)
      }
    }
  `,
])
```

The above example highlights our strategy to hide complexity via composition.

The Flow Client Library (`FCL`) is there to provide an opinionated use of the tools supplied by the `SDK`.
This strategy should provide people new to blockchain, and people who wish to build fast a way to ship quickly and easily.

The Flow ecosystem itself is built in layers.

At the very base is Flow itself, we can access it via an `Access Node`. For local development you can start up the Flow Emulator and point your dapps at that.

Above Flow and the `Access Node` is a collection of various small packages, which we call `libs`. You can think of these small packages as low level operators which are used to round off the sharp edges of the Access Nodes API. They give us a layer of indirection in case the Access Nodes change in the future. 

Above them is the `SDK`, which pulls all those pieces together into commonly used/needed tools. For example, tools that are needed to build up, resolve, and send a transaction to Flow.

Further above the SDK comes the `FCL`, where possible it provides default opinionated ways of interacting with Flow. It consumes the SDK and provides some other helpful tools.

Our goal with this stack is the further up it you go, the less Flow specific knowledge you need, and the faster it should be to build things. If for whatever reason you need more ability or customization, you can always drop down a layer.

| Layer | Knowledge Required | Speed of Development  |
|------:|:------------------:|:---------------------:|
| fcl   |         10         |         x1000         |
| sdk   |        100         |          x100         |
| libs  |       1000         |           x10         |
| api   |      10000         |            x1         |

# Build Resolve Send Decode

Most things in the **SDK** follow the pattern `build->resolve->send->decode`.

![build resolve send decode](./assets/build-resolve-send-decode.png)

When you `build` something you are declaring what you want to happen.
It can help to think about it like a sentence: "As these two accounts, I want to perform this transaction where the first account pays for the transaction".
Now that we have said what we want to do, we need to make sure we have everything that we need to do it.

That is where `resolve` comes in, resolve needs to know how to take that description and turn it into something that can be sent to Flow. It checks things like the accounts needed to sign the transaction and it encodes the instructions you supplied in build.
Once `resolve` has finished, we then should have something that can be sent to Flow. Using `send` we can send it to one of Flow's Access Nodes, which will return a response.

If what we sent is supposed to return some sort of structured data, we can then turn that data into JavaScript types using `decode`, no ABIs necessary.

```javascript
import * as sdk from "@onlfow/sdk"

// describe what we want to do
const builtInteraction = await sdk.build([
  // As these two accounts
  sdk.authorizations([
    sdk.authorization("0x01", acct1SigningFunction),
    sdk.authorization("0x02", acct2SigningFunction),
  ]),
  // I want to perform this transaction
  sdk.transaction`
    // cadence code that requires two accounts to sign
    transaction {
      prepare(acct1: Account, acct2: Account) {...}
    }
  `,
  // where the first accounts pays for the transaction
  sdk.payer(sdk.authorization("0x01", acct1SigningFunction)),
])

// resolve the interaction so we can send it
const resolvedInteraction = await sdk.resolve(builtInteraction, [
  // turn the transaction code into a format send understands
  sdk.encodePayload,
  // sign the payload using both of the authorizations
  sdk.authorizePayload,
])

// send our interaction to our access node
const response = await sdk.send(resolvedInteraction, {
  node: "https://our.access.node#not-a-real-access-node",
})

// transactions dont return anything so there is nothing to decode
// But if there was we could do this
const data = sdk.decode(response)
```

One of the first things `FCL` aims to do is hide the build and the resolve steps.
`FCL` will come with a preconfigured resolver that knows how to deal with many of the most common interactions, like encoding transactions and resolving paramaters.
This would allow us to write the above example like so:

```javascript
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"

fcl.config("accessNode", "https://our.access.node#not-a-real-access-node")

const response = await fcl.send([
  sdk.authorizations([
    sdk.authorization("0x01", acct1SigningFunction),
    sdk.authorization("0x02", acct2SigningFunction),
  ]),
  sdk.transaction`
    transaction {
      prepare(acct1: Account, acct2: Account) {...}
    }
  `,
  sdk.payer(sdk.authorization("0x01", acct1SigningFunction)),
])

const data = fcl.decode(response)
```

## Interacting with Wallets and Signing Transactions

> We always welcome feedback, but in particular we would love to hear all your thoughts and as much feedback as you can give on this section.

We want to enable an ecosystem where the ownership and the choices are in the users hands, while at the same time making the user experience as close to (hopefully eventually even surpassing) every other non-blockchain application. The dapp developer experience has to be good too. We think we have figured out some of the building blocks for this, but we are still quite a ways away from that dream.

Some areas we'd specifically love ideation around and feedback on (feel free to create an issue to add/discuss these thoughts):
- Keys needs to live and exist outside of the dapp. Dapps should never know the keys.
- Browser extensions aren't viable in mobile browsers, but some people may want to use browser extensions.
- People might have multiple accounts/wallets/providers, including some the dapp developers have never heard of.
- Some private keys are stored on hardware devices like Ledgers and Trazors.
- Iframes are a security nightmare.
- Custodial Wallets are becoming more common, but advanced users might want to do the signing themselves.

### Our Current Strategy/Approach

**Step 1:** Remote Asynchronous Signing

Remote Aysnc Signing is all about being able to sign transactions remotely elsewhere, like on the servers of a custodial wallet.
```javascript
  const remoteAsyncSigner = async (acct, payloadToSign, fullInteraction) => {
    // resultHook will be covered in the Result Hook Step
    // the important detail to know here is this http request should return
    // imediately, and the result hook will tell us (the signature) if it's signed
    // the current status of the signature, and where to poll for another resultHook
    // which might have a different status, and possibly the signature.
    const resultHook = await fetch("https://custodial.wallet/.....", {
      method: "POST",
      body: JSON.stringify({ payloadToSign, acct })
    })

    return resultHook
  }

  sdk.authorizations([
    sdk.authorization("05", remoteAsyncSigner)
  ])
```
The remote async signing function should return what we are calling `resultHook`, which is composed of the current status of the remote request, the signature if its ready, where to poll to get updates (should return another `remoteHook` response that is the same as the current one, but with any updates), and possible other ways of resolving the signature (browser extension hook, new tab, ...).

**Step 2:** Hooks

In short Hooks are abilities attached to a Flow account.

The ultimate goal is for them to live on chain. Imagine if there was some information like this, stored on chain, for flow account `0x09`.

```javascript
const hooks = {
  authorization: [
    {
      label: "Dapper Service",
      type: "HTTPS::POST",
      uri: "https://.../api/authorize",
    },
    {
      label: "Dapper Browser Extension Authorization",
      type: "BROWSER::EXTENSION::EVENT",
      event: "DAPPER::AUTHORIZE",
      response: "DAPPER::AUTHORIZED",
    },
    // ... other authorization strategies
  ],
  // ... other hooks
}
```

Where each of those authorization hooks represents a way `0x09` can authorize a transaction. If we know the hooks, or can get the hooks, for a given account, we can write a general purpose `asyncRemoteSigning` function that can use those hooks to do a fan out, first success wins, approach.


**Step 3:** Result Hooks

When our `asyncRemoteSigning` function returns it should return something like this:

```javascript
const resultHook = {
  status: "PENDING",
  signature: null,
  hooks: [
    {
      label: "Dapper Browser Extension Authorization Approval",
      type: "BROWSER::EXTENSION::EVENT",
      event: "DAPPER::AUTHORIZE::APPROVAL",
      response: "DAPPER::AUTHORIZED",
      data: { uid: 923847290102 }
    }
  ],
  update: {
    label: "Dapper Authorization Update",
    type: "HTTPS::GET",
    uri: "https://....../api/authorization/update/923847290102",
  }
}
```

If our resolver were to then poll that update hook, once the user has authorized or rejected the transaction we should see an updated `resultHook` with the result.

**Step 4:** Identity

Who is the current user? Who are the other users? You can think of identiy as a hook that lets the user decide what information is available to dapps, things like what name they want to display, where the dapp can find the chosen avatar, maybe a bio. Everything is optional though. Because many users will be using custodial wallets, their Flow Accounts will be created via said custodial wallets, we hope encouraging custodial wallets to also provide identity serverices can tie the concept of identity to the wallet and therefore the Flow account(s).

**Step 5:** Authentication

We see "proving you are who you say you are" as a specific/specialized form of authorization and therefore the responsibility falls on whereever the keys live. The hard part here is more than likely the discovery of the authorization providers, and making this initial authorization seamless so the user doesnt need to sign in, then authorize the authentication, and then say the user needed to be authenticated because they were buying something, authorize that transaction, and then authorize the payment of the transaction. We don't want tha! So, figuring out how to merge an authorization with a signup seems pretty critical to a great user experience.
  
**Step 6:** Upgrading [WiP]

People need a designated on-chain account, but we don't believe they should face this onboarding barrier in their first interaction. By providing hooks in your dapp you can give users the option to use the Flow account they were assigned when you created their account now or later. With no Flow account there can't be any hooks on chain, so custodial wallet providers will be responsible for supplying the hooks (including a special `upgrade` hook) themselves for a given account. Later when the custodial wallet upgrades the account to have a coresponding Flow account we are expecting them to add the hooks to it.

**Step 7:** Discovery

We believe this can live on chain too. A Flow account with some public resources that lists out all of the different providers that are available. We are planning to host an open source static html/javascript application that can handle some redirects and surface this information.
