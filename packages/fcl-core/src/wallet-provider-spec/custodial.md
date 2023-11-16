# Introduction

A Wallet Provider handles Authentications and Authorizations. They play a very important role of being the place the users control their information and approve transactions.

One of FCLs core ideals is for the user to be in control of their data, a wallet provider is where many users will do just that.

FCL has been built in a way that it doesn't need to know any intimate details about a wallet provider up front, they can be discovered when the users wishes to let the dapp know about them. This gives us a concept we have been calling Bring Your Own Identity.

# Identity

Conceptually, FCL thinks of identity in two ways: Public and Private.

Public identity will be stored on chain as a resource, it will be publicly available to anyone that knows the Flow Address for the account.

In FCL getting a users public identity will be as easy as:

```javascript
import {user} from "@onflow/fcl"

const identity = await user(flowAddress).snapshot()
//       ^
//       `------ The public identity for `flowAddress`

const unsub = user(flowAddress).subscribe(identity => console.log(identity))
//                                           ^
//                                           `------- The public identity for `flowAddress`
```

Private identity will be stored by the Wallet Provider, it will only be available to the currentUser.

In FCL getting the currentUsers identity will fetch both the public and the private identities, merging the private into the public.

Private info needs to be requested via scopes before the challenge step, more on that later.
We highly recommend Wallet Providers let the user see what scopes are being requested, and decide what scopes to share with the dapp.

Consumers of identities in FCL should always assume all data is optional, and should store as little as possible, FCL will make sure the users always see the latest.

```javascript
import {config, currentUser, authenticate} from "@onflow/fcl"

config.put("challenge.scope", "email") // request the email scope

const unsub = currentUser().subscribe(identity => console.log(identity))
//                                       ^
//                                       `------- The private identity for the currentUser

authenticate() // trigger the challenge step (authenticate the user via a wallet provider)
```

# Identity Data

- All information in Identities are optional and may not be there.
- All values can be stored on chain, but most probably shouldn't be.

We would love to see Wallet Providers enable the user to control the following info publicly, sort of a public profile starter kit if you will.

FCL will always publicly try to fetch these fields when asked for a users information and it will be up to the Wallet provider to make sure they are there and keep them up to date if the user wants to change them.

- **`name`** -- A human readable name/alias/nym for a dapp users display name
- **`avatar`** -- A fully qualified url to a smaller image used to visually represent the dapp user
- **`cover`** -- A fully qualified url to a bigger image, could be used by the dapp for personalization
- **`color`** -- A 6 character hex color, could be used by the dapp for personalization
- **`bio`** -- A small amount of text that a user can use to express themselves

If we can give dapp developers a solid foundation of usable information that is in the direct control of the users from the very start, which we belive the above fields would do, our hopes are they can rely more on the chain and will need to store less in their own database.

Private data on the other hand has more use cases than general data. It is pretty easy to imagine ordering something and needing information like contact details and where to ship something.

Eventually we would love to see that sort of thing handled completely on-chain, securely, privately and safely, but in the interm it probably means storing a copy of data in a database when its needed, and allowed by a user.

The process of a dapp receiving private data is as follows:

1. The dapp requests the scopes they want up front `fcl.config().put("challenge.scope", "email+shippingAddress")`.
2. The User authenticates `fcl.authenticate()` and inside the Wallet Providers authentication process decides its okay for the dapp to know both the `email` and the `shippingAddress`. The User should be able to decide which information to share, if any at all.
3. When the dapp needs the information they can request it from FCLs current cache of data, if it isnt there the dapp needs to be okay with that and adjust accodingly.

Below are the scopes we are thinking of supporting privately:
FCL will only publicly and privately try to fetch these when specified up front by a dapp.

- **`email`**
- **`fullName`**
- **`phone`**
- **`textMessage`**
- **`address`**
- **`shippingAddress`**
- **`location`**
- **`publicKey`**

All of the above are still subject to change as it is still early days, we would like to work closely with Wallet Providers to produce a robust, detailed and consitent spec regarding scopes. Feedback and thoughts are always welcome.

# Authentication Challenge

Authentication can happen one of two ways:

- Iframe Flow
- Redirection Flow

As a Wallet Provider you will be expected to register a URL endpoint (and some other information) with a handshake service (FCL will be launching with one in which registration happens on chain and is completely open source (Apache-2.0 lincense)).
This registered URL will be what is shown inside the iFrame or where the dapp users will be redirected.
For the remainder of this documentation we will refere to it as the _Authentication Endpoint_ and pair it with the `GET https://provider.com/flow/authentication` route.

The Authentication Endpoint will receive the following data as query params:

- `l6n` _(required)_ -- location (origin) of dapp
- `nonce` _(required)_ -- a random string supplied by the FCL
- `scope` _(optional)_ -- the scopes requested by the dapp
- `redirect` _(optional)_ -- where to redirect once the authentication challenge is complete

```
GET https://provider.com/flow/authenticate
  ?l6n=https%3A%2F%2Fdapp.com
  &nonce=asdfasdfasdf
  &scope=email+shippingAddress
  &redirect=https%3A%2F%2Fdapp.com%2Fflow%2Fcallback

The values will use javascripts `encodeURIComponent` function and scopes will be `+` deliminated.
```

We can tell that this challenge is using the Redirect Flow because of the inclusion of the redirect query param.
The Iframe Flow will still need to be supported as it will be the default flow for dapps.

At this point its on the Wallet Provider to do their magic and be confident enough that the user is who they say they are.
The user should then be shown in some form what the dapp is requesting via the scopes and allow them to opt in or out of anything they want.
Once the Wallet Provider is ready to hand back control to the dapp and FCL it needs to complete the challenge by redirecting or emiting a javascript `postMessage` event.

Redirecting will look like this:

```
GET https://dapp.com/flow/callback         # supplied by the redirect query param above
  ?l6n=https%3A%2F%2Fdapp.com              # the l6n supplied by FCL above
  &nonce=asdfasdfasdf                      # the nonce supplied by FCL above
  &addr=0xab4U9KMf                         # address for the users flow account (if available) -- will be used to fetch public identity information and hooks
  &padder=0xhMgqTff86                      # address for the Wallet Providers account -- will be used to fetch provider information
  &code=afseasdfsadf                       # a token supplied to FCL from the Wallet Provider, FCL will use this token when requesting private information and hooks, can be any url safe value
  &exp=1650400809517                       # when the code expires, a value of `0` will be considered as never expires
  &hks==https%3A%2F%2Fprovider.com%2Fhooks # a URL where FCL can request the private information and hooks
```

Iframe will look like this:

```javascript
parent.postMessage(
  {
    type: "FCL::CHALLENGE::RESPONSE", // used by FCL to know what kind of message this is
    addr: "0xab4U9KMf",
    paddr: "0xhMgqTff86",
    code: "afseasdfsadf",
    exp: 1650400809517,
    hks: "https://provider.com/hooks",
    nonce: "asdfasdfasdf",
    l6n: decodeURIComponent(l6n),
  },
  decodeURIComponent(l6n)
)
```

FCL should now have everything it needs to collect the Public, Private and Wallet Provider Info.
The Wallet Provider info will be on chain so its not something that needs to be worried about here by the Wallet Provider.
What does need to be worried about handling the hooks request which was supplied to FCL via the `hks` value in the challenge response `https://provider.hooks`.

The hooks request will be to the `hks` value supplied in the challenge response. The request will also include the code as a query param

```
GET https://povider.com/hooks
  ?code=afseasdfsadf
```

This request needs to happen for a number of reasons.

- If it fails FCL knows something is wrong and will attempt to re-authenticate.
- If is succeeds FCL knows that the code it has is valid.
- It creates a direct way for FCL to "verify" the user against the Wallet Provider.
- It gives FCL a direct way to get Private Identity Information and Hooks.
- The code can be passed to the backend to create a back-channel between the backend and the Wallet Provider.

When users return to a dapp, if the code FCL stored hasnt expired, FCL will make this request again in order to stay up to date with the latest informtaion. FCL may also intermitently request this information before some critial actions.

The hooks request should respond with the following JSON

```javascript
const privateHooks = {
  addr: "0xab4U9KMf",       // the flow address this user is using for the dapp
  keyId: 3,                 // the keyId the user wants to use when authorizing transaction
  identity: {               // the identity information fcl always wants if its there, will be deep merged into public info
    name: "Bob the Builder",
    avatar: "https://avatars.onflow.org/avatar/0xab4U9KMf.svg"
    cover: "https://placekittens.com/g/900/300",
    color: "cccc00",
    bio: "",
  },
  scoped: {                 // the private info request in the original challenge
    email: "bob@bob.bob",   // the user said it was okay for the dapp to know the email
    shippingAddress: null,  // the user said it was NOT okay for the dapp to know the shippingAddress
  },
  provider: {
    addr: "0xhMgqTff86", // the flow address for the wallet provider (used in the identity composite id)
    pid: 2345432,        // the wallet providers internal id for the user (used in the identity composite id)
    name: "Super Wallet",
    icon: "https://provider.com/assets/icon.svg",
    authn: "https://provider.com/flow/authenticate",
  }
}
```

When FCL requested the Public info from the chain it is expecting something like this.
It will be on the Wallet Provider to keep this information up to date.

```javascript
const publicHooks = {
  addr: "0xab4U9KMf",
  keyId: 2,
  identity: {
    name: "Bob the Builder",
    avatar: "https://avatars.onflow.org/avatar/0xab4U9KMf.svg"
    cover: "https://placekittens.com/g/900/300",
    color: "cccc00",
    bio: "",
  },
  authorizations: [
    {
      id: 345324539,
      addr: "0xhMgqTff86",
      method: "HTTP/POST",
      endpoint: "https://provider.com/flow/authorize",
      data: {
        id: 2345432
      }
    }
  ]
}
```

At this point FCL can be fairly confident who the currentUser is and is ready to initiate transactions the user can authorize.

# Authorization

FCL will broadcast authorization requests to the Public and Private authorization hooks it knows for a User, in a process we call Asynchronous Remote Signing.

The core concepts to this idea are:

- Hooks tell FCL where to send authorization requests (Wallet Provider)
- Wallet Provider responds imediately with:
  - a back-channel where FCL can request the results of the authorization
  - some optional local hooks ways the currentUser can authorize
- FCL will trigger the local hooks if they are for the currentUser
- FCL will poll the back-channel requesting updates until an approval or denial is given

Below is the public authorization hook we received during the challenge above.

```javascript
  {
    id: 345324539,
    addr: "0xhMgqTff86",
    method: "HTTP/POST",
    endpoint: "https://provider.com/flow/authorize",
    data: {
      id: 2345432
    }
  }
```

FCL will take that hook and do the following post requeset:

```
POST https://provider.com/flow/authorize
  ?id=2345432
---
{
  message: "...",     // what needs to be signed (needs to be convered from hex to binary before signing)
  addr: "0xab4U9KMf", // the flow address that needs to sign
  keyId: 3,           // the flow account keyId for the private key that needs to sign
  roles: {
    proposer: true,   // this accounts sequence number will be used in the transaction
    authorizer: true, // this transaction can "move" and "modify" the accounts resources directly
    payer: true,      // this transaction will be paid for by this account (also signifies that they are signing an envelopeMessage instead of a payloadMessage)
  },
  interaction: {...}  // needed to recreate the message if the Wallet Provider wants to verify the message.
}
```

FCL ise expecting something like this in response:

```javascript
{
  status: "PENDING",
  reason: null,
  compositeSignature: null,
  authorizationUpdates: {
    method: "HTTP/POST",
    endpoint: "https://provider.com/flow/authorizations/4323",
  },
  local: [
    {
      method: "BROWSER/IFRAME",
      endpoint: "https://provider.com/authorizations/4324",
      width: "300",
      height: "600",
      background: "#ff0066"
    }
  ]
}
```

That local hook will be consumed by FCL, rendering an iframe with the endpoint as the src. If the user is already authenticated this screen could show them the Wallet Providers transaction approval process directly.
Because FCL isnt relying on any communication to or from the Iframe it can lock it down as much as possible, and remove it once the authorization is complete.
While displaying the local hook, it will request the status of the authorization from the `authorizationUpdates` hook.

```
POST https://provider.com/flow/authorizations/4323
```

Expecting a response that has the same structure as the origin but without the local hooks:

```javascript
{
  status: "PENDING",
  reason: "",
  compositeSignature: null,
  authorizationUpdates: {
    method: "HTTP/POST",
    endpoint: "https://provider.com/flow/authorizations/4323",
  },
}
```

FCL will then follow the new `authorizationUpdates` hooks until the status changes to `"APPROVED"` or `"DECLINED"`.
If the authorization is declined it should include a reason if possible.

```javascript
{
  status: "DECLINED",
  reason: "They said no",
}
```

If the authorization is approved it should include a composite signature:

```javascript
{
  status: "APPROVED",
  compositeSignature: {
    addr: "0xab4U9KMf", // the flow address that needs to sign
    keyId: 3,           // the flow account keyId for the private key that needs to sign
    signature: "..."    // binary signature of message encoded as hex
  }
}
```

FCl can now submit the transaction to the Flow blockchain.

# TL;DR Wallet Provider

Register Provider with FCL Handshake and implement 5 Endpoints.

- `GET flow/authenticate` -> `parent.postMessage(..., l6n)`
- `GET flow/hooks?code=___` -> `{ ...identityAndHooks }`
- `POST flow/authorize` -> `{ status, reason, compositeSignature, authorizationUpdates, local }`
- `POST authorizations/:authorization_id`
- `GET authorizations/:authorization_id`

![diagram showing current fcl authn and authz flow](./assets/fcl-ars-auth-v3.2.png)
