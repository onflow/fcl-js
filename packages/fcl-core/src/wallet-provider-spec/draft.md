# Second Generation FCL Compatible Wallet Provider Docs

## Status

- **Last Updated:** Sept 3rd 2020
- **Stable:** No
- **Risk of Breaking Change:** Medium

This is a rough draft, the concepts here are an extension and refinement on the First
Generation FCL Compatible Wallet Provider Docs. We will try as hard as possible to not
introduce any breaking changes for wallets that already exist, but this is not a document
that should be built against quite yet.

# Overview

Currently, at a minimum, there are two main aspects that wallet providers need to supply
in order to be considered an FCL compatible wallet: Authentication and Authorization.

Authentication configures FCL, telling it which Flow account to use and how FCL can
perform certain tasks (like authorizing a transaction) once the user initiates them
via the application.

Authorization is an ability that allows FCL to authorize transactions. FCL knows how
to send the data that needs to be signed and how to retrieve the signature with the
FCL compatible wallet provider because it was configured to know how during the
authentication step.

We aim to add more abilities (services) than Authentication and Authorization in the future, as
well as expanding on transport strategies and various ways in which FCL can be configured
to communicate with various services like wallets.

```
  Note: Wallet Providers act as both           Currently only Authentication and Authorization
    - an Authentication Service (authn)        Serivices have been spec'd out. Other services
    - an Authorization Service (authz)         listed below are just ideas of possible services.

  +-----------------+   +-----------------+   +-----------------+   +-----------------+
  | Wallet Provider |   | Wallet Provider |   | Wallet Provider |   | Wallet Provider |
  +-------+---------+   +-------+---------+   +-------+---------+   +-------+---------+
          |                     |                     |                     |
          +---------------------+--------------------------------------------
                                |
                        +-------+---------+                             +----------------------+
  +-------------+   +-->| Wallet Discovery|<--+   +-------------+   +-->| Private Info Service |
  | Application |   |   +-----------------+   |   | Application |   |   +----------------------+
  |  (Minimal)  |   |                         |   |  (Advanced) |   |
  | +---------+ |   |   +-----------------+   |   | +---------+ |   |   +--------------+
  | |   FCL   |<----+-->| Profile Service |<--+---->|   FCL   |<----+-->| IPFS Service |
  | +---------+ |       +-----------------+       | +---------+ |   |   +--------------+
  |      ^      |                                 |      ^      |   |
  |      |      |       +-----------------+       |      |      |   |   +----------------------+
  |      |      |   +-->|   Access Node   |<--+   |      |      |   +-->| Notification Service |
  |      v      |   |   +-----------------+   |   |      v      |   |   +----------------------+
  | +---------+ |   |            ^            |   | +---------+ |   |
  | |   SDK   |<----+            |            +---->|   SDK   | |   |   +-----------------+
  | +---------+ |                v                | +---------+ |   +-->| Payment Service |
  + ------------+       +-----------------+       + ------------+       +-----------------+
                        | Flow Blockchain |
                        +-----------------+
```

# General User Flow

### User signs up or in.

`fcl.authenticate()` is triggered. It looks up the **Challenge Handshake Url** with
`config().get("challenge.handshake")`. FCL will render an iframe using the **Challenge
Handshake Url** at the src, also passing in a couple query paramaters.

> During development (and on mainnet) FCL can be configured to use the wallet directly by
> setting the **Challenge Handshake Url** to the wallet providers **Authentication Endpoint**
> by configuring fcl like this `config().put("challenge.handshake", "https://my-awesome-wallet-provider.com/fcl/authenticate")`.
> On mainnet though our idea is this configuration can be removed and FCL will fallback to
> a **Challenge Handshake** that enables the discovery of FCL compatible wallets, meaning
> users on mainnet should be able to use the same FCL compatible wallet they trust on any
> application that uses FCL.

This iframe is responsible for the **Authentication** process, the wallet , it
needs to be able to send (via `postMessage`) the users **Flow Address** and some
configuration (and/or instructions on how to get configuration) that tells FCL
how to **Authorize Transactions**.

FCL (and by extension the application) now has a `Current User` and should know
how to talk to the wallet in a way that a transaction can be signed.

```
Application                  FCL                       Wallet Provider      Flow Blockchain
  |                           |                              |                  |
  *---[Authenticate]--------->*---[Render Auth(n) iframe]--->|                  |
  |                           |                              |                  |
  |                           |<---[postMessage(config)]-----*                  |
============ [IFRAME/RPC] =================================================================
  |                           |                              |                  |
  |---[Trigger Tx]----------->*---[Render Auth(z) iframe]--->|                  |
  |                           |                              |                  |
  |                           *---[postMessage(tx)]--------->|                  |
  |                           |                              |                  |
  |                           |<---[postMessage(signature)---*                  |
  |                           |                              |                  |
  |                           *---[send(tx)]----------------------------------->|
  |                           |                                                 |
  |<-----------------[txId]---*<------------------------------[respond(txId)]---*
  |                           |                                                 |
============ [HTTP/POST] ==================================================================
  |                           |                              |                  |
  |---[Trigger Tx]----------->*---[Post(tx)]---------------->|                  |
  |                           |                              |                  |
  |<-[render iframe(status)]--*<-[respond(status): Pending]--*                  |
  |                           |                              |                  |
  |                           *---[getStatus(status)]------->|                  |
  |                           |                              |                  |
  |<---------[close Iframe]---*<------[respond(signature)]---*                  |
  |                           |                              |                  |
  |                           *---[send(tx)]----------------------------------->|
  |                           |                                                 |
  |<-----------------[txId]---*<------------------------------[respond(txId)]---*
  |                           |                                                 |
```

### User performs a transaction.

Currently FCL can be configured in two mutually exclusive ways to handle transactions.
The first is what we call `IFRAME/RPC` while the other is `HTTP/POST`.

> We have plans to expand to more strategies in the future, and if you are building a
> wallet provider and neither of these work for you we would love to have a chat with you.

When a transaction needs a signature from the **Current User** it will first make sure
their is a **Current User**, possibly triggering the **Authentication** flow if needed.
Once it has a **Current User** FCL will look at the configuration it received during
**Authentication**, which as mentioned above will be either an `IFRAME/RPC` or an
`HTTP/POST`. It will then communicate with the wallet (using the configuration) in order
to get the signature it needs.

`IFRAME/RPC` has the least moving parts. When a transaction needs a signature from
the **Current User** it will render an iframe at the url provided by the configuration,
send it a message (via `postMessage`) and wait for a response that contains the signature.

`HTTP/POST` is a little more complex, but opens the door for what we hope to be some
game changing user experiences. When a transaction needs a signature from the
**Current User** it will first post (via an `http` backchannel) what needs to be signed
to an endpoint specified by the configuration. The response of this http request returns
the status of the signature request, instructions on how to get an update on the signature
request, and some optional instructions that can be used to render an iframe. Forgetting
about the iframe for a second, FCL will poll for updates against the configuration supplied
by the response, until the polling returns a signature. Circling back around to the optional
iframe info the back channel returned with, if it is there FCL will render the iframe, and
close it once the back channel polling completes. In this method, because we have decoupled
the approval/signing of the transaction from what the user sees (other than the optional iframe),
we believe this approach should enable user experiences where, as an example, a push message
is sent to a phone, the phone signs the transaction using its HSM, sending the signature back
to the wallet providers servers, then the backchannel polling picking up signature when asking
for the signature status.

# A more in-depth look.

### Authentication -- The Challenge Handshake

Assumptions:

- The Wallet Provider has an FCL Authentication URL: `https://example.wallet/fcl/authn`
- The Application lives at: `https://example.app`

First, FCL needs to be configured to point to the Wallet Providers Authentication URL:

```javascript
import {config} from "@onflow/config"

config().put("challenge.handshake", "https://example.wallet/fcl/authn")
```

The user then decides to authenticate, by clicking a signin link or something. This user
action would then trigger the fcl.authenticate call.

```javascript
import React from "react"

export const Authenticate = () => (
  <button onClick={() => fcl.authenticate()}>Sign In/Up</button>
)
```

When `fcl.authenticate()` is triggered, FCL will render an iframe using
`config().get("challenge.handshake")` as its source. Some additional query params
are added to the url. Inside of this iframe, everything is up to the wallet, once
the wallet is confident the user is who they say they are, they need to send
(via `postMessage`) back to FCL a bunch of information. This information sent back
is then used to configure FCL in the application for future user actions.

Users will be shown a page that the wallet controls inside of an iframe,
that page is responsible to send a message back to the application (via `postMessage`)
that either configures FCL or tells FCL how to find how to configure.

The basic shape of the `postMessage` response looks like this:

```graphql
scalar FlowAddress # Flow Address sans 0x prefix ie: ba1132bc08f82fe2
scalar URL         # A fully qualified url https://example.wallet/fcl/hooks
alias UnixEpoch = number # in seconds

type Data {
  """
  Arbitrary key value data
  """
  [string]: string | number
}

type Handshake {
  """
  The Flow Address of the Current User
  """
  addr:  FlowAddress!

  """
  The Flow Address of the Wallet Provider
  """
  paddr: FlowAddress

  """
  A list of services that FCL will use to configure
  itself for the Current User.
  """
  services: [Service]

  """
  hks and code work together to enable FCL to discover
  how to configure itself for the Current User. If these
  are both supplied an http get request will be made
  to the hks url with the code as a query paramater.
  It should return an array of services. These services
  will be chosen over those returned directly in the
  handshake
  """
  hks: URL
  code: string

  """
  A unix epoch in the future, when the above code expires.
  If the value is 0 or null FCL will assume this code never becomes invalid.
  """
  expires: UnixEpoch
}

interface Service {
  """
  A service is considered the same if there id and type
  match each other. Services that are discovered via
  a hooks call will overload those supplied by the
  handshake. These two fields are always required for
  all services.
  """
  id: string!
  type: string!

  """
  A timestamp for when this service will become invalid.
  If the value is 0 or null FCL will assume this service never becomes invalid.
  """
  expires: UnixEpoch
}

type ServiceAuthn implements Service {
  id: string!
  type: "authn"
  expires: UnixEpoch

  """
  The Flow Address of the provider
  """
  addr: FlowAddress!

  """
  Where FCL can go to attempt to athenticate again.
  This value would be the same as the used in the
  challenge handshake.
  """
  authn: URL!

  """
  Name of the wallet provider
  """
  name: string

  """
  A fully qualified url to an image that an application can
  use to show the wallet provider inside of their interface.
  """
  icon: URL

  """
  An internal id for the wallet provider. If internally
  the wallet
  """
  pid: ID,
}

interface ServiceAuthz implements Service {
  id: string!
  type: "authz"
  expires: UnixEpoch

  """
  Is used by FCL to understand how to utilize the rest of
  the service configuration and talk to the wallet provider
  """
  method: string!

  """
  The Flow Address that should be used to authorize
  the transaction
  """
  addr: FlowAddress!

  """
  The keyId for the Flow Accounts corresponding public
  key that Flow will use to verify the transaction
  """
  keyId: integer!

  """
  data that will be sent back to the wallet during the
  authorization request.
  """
  data: Data
}

type ServiceAuthzIframeRPC implements ServiceAuthz {
  id: string!
  type: "authz"
  method: "IFRAME/RPC"
  addr: FlowAddress!
  keyId: integer!
  params: Data
  expires: UnixEpoch

  """
  The webpage that FCL will render in an iframe
  """
  endpoint: URL!
}

type ServiceAuthzHttpPost implements SerivceAuthz {
  id: string!
  type: "authz"
  method: "HTTP/POST"
  addr: FlowAddress!
  keyId: integer!
  params: Data
  expires: UnixEpoch

  """
  FCL will do a post request to this URL when it
  needs something signed.
  """
  endpoint: URL!
}
```

An example handshake response:

```javascript
const handshakeResponse = {
  addr: "0xba1132bc08f82fe2", // users flow address
  paddr: "0xf086a545ce3c552d", // wallet providers flow address
  hks: "https://example.wallet/fcl/hooks",
  code: "SOME_TOKEN",
  expires: 1599180117,
  services: [
    {
      type: "authn",
      id: "example-wallet#authn", // used to dedupe services Private > Public
      addr: "0xf086a545ce3c552d", // wallet providers flow address
      authn: "https://example.wallet/fcl/authn",
      name: "Example Wallet",
      icon: "https://example.wallet/assets/icon.png",
      pid: "0609d667-944c-3c2d-9d09-18af5c58c8fb", // wallet providers internal id representation for the user
      // it needs to stay the same every time the user authenticates
    },
    {
      type: "authz",
      id: "example-wallet#authz",
      method: "IFRAME/RPC",
      addr: "0xba1132bc08f82fe2", // users flow address, this is who needs to sign the transaction
      keyId: 3, // which key in the users flow address needs to sign the transaction
      endpoint: "https://example.wallet/fcl/authz",
      data: {
        id: "0609d667-944c-3c2d-9d09-18af5c58c8fb", // data that will be sent to the endpoint along with the signable
      },
    },
  ],
}

window.opener(handshakeResponse)
```

And the same but with an `authz -- HTTP/POST` service:

```javascript
const handshakeResponse = {
  addr: "0xba1132bc08f82fe2",
  paddr: "0xf086a545ce3c552d",
  hks: "https://example.wallet/fcl/hooks",
  code: "SOME_TOKEN",
  expires: 1599180117,
  services: [
    {
      type: "authn",
      id: "example-wallet#authn",
      addr: "0xf086a545ce3c552d",
      authn: "https://example.wallet/fcl/authn",
      name: "Example Wallet",
      icon: "https://example.wallet/assets/icon.png",
      pid: "0609d667-944c-3c2d-9d09-18af5c58c8fb",
    },
    {
      type: "authz",
      id: "example-wallet#authz",
      method: "HTTP/POST", // The change is here
      addr: "0xba1132bc08f82fe2",
      keyId: 3,
      endpoint: "https://example.wallet/fcl/authz",
      data: {
        id: "0609d667-944c-3c2d-9d09-18af5c58c8fb",
      },
    },
  ],
}

window.opener(handshakeResponse)
```

# Authorizing a Transaction

Authorization Services have a sole job. Describing how a wallet can receive a `Signable` from FCL and send back a `Composite Signature`.

```graphql
scalar FlowAddress # Flow Address sans 0x prefix ie: ba1132bc08f82fe2
scalar Hex # A hex representation of a binary array (Buffer)
type Signable {
  message: Hex
  tag: string
  addr: FlowAddress
  keyId: number
  roles: Roles
  interaction: Object
}

type Roles {
  proposer: boolean
  authorizer: boolean
  payer: boolean
}

type CompositeSignature {
  addr: FlowAddress
  keyId: number
  signature: Hex
}
```

### `IFRAME/RPC`

Given this service:

```javascript
const service = {
  type: "authz",
  id: "example-wallet#authz",
  method: "IFRAME/RPC",
  addr: "0xba1132bc08f82fe2",
  keyId: 3,
  endpoint: "https://example.wallet/fcl/authz",
  data: {
    id: "0609d667-944c-3c2d-9d09-18af5c58c8fb",
  },
}
```

When a user triggers a transaction, and FCL has the above service.

FCL will

- Open an iframe at `https://example.wallet/fcl/authz`
- Post a message to the iframe
- Wait for a response back that includes a status and relevant info.
- Handle response

The message FCL will post to the iframe will look like this:

```javascript
const msg = {
  jsonrpc: "2.0",
  id: "6a545ce3c82fe",
  method: "fcl:sign",
  params: [signable, service.data],
}

$frame.targetWindow.postMessage(msg)
```

The wallet should then sign the `signable.message` and send back a response that looks similar to this:

```javascript
const msg = {
  jsonrpc: "2.0",
  id: "6a545ce3c82fe",
  result: {
    status: "APPROVED",
    reason: null,
    compositeSignature: {
      addr: "0xba1132bc08f82fe2",
      keyId: 3,
      signature:
        "95ee6929dda9548abbf79802be19400fb717b003476eb1f2e080bf15f7d40b1c087e7ff2b42bea8756c6509a5135c5ee6994897367f669279fadb392f4651d48",
    },
  },
}

window.opener.postMessage(msg)
```

If the user declines the transaction the message sent back should look as follows:

```javascript
const msg = {
  jsonrpc: "2.0",
  id: "6a545ce3c82fe",
  result: {
    status: "DECLINED",
    reason: "They didn't want to sign that...",
    compositeSignature: null,
  },
}

window.opener.postMessage(msg)
```

### `HTTP/POST`

Given this service:

```javascript
const service = {
  type: "authz",
  id: "example-wallet#authz",
  method: "HTTP/POST",
  addr: "0xba1132bc08f82fe2",
  keyId: 3,
  endpoint: "https://example.wallet/fcl/authz",
  data: {
    id: "0609d667-944c-3c2d-9d09-18af5c58c8fb",
  },
}
```

When a user triggers a transaction, and FCL has the above service.

FCL will

- Post the `Signable` to `https://example.wallet/fcl/authz`
- Receive a StatusResponse that includes an AuthzUpdates and a Status
- (Optional Side Effect) If Status includes local instructions follow them
- If Status is PENDING use AuthzUpdates to fetch a new Status Response and repeat this step
- If Status is APPROVED continue with `Composite Siganture`

With the above service FCL will make a `application/json` POST request to
`https://example.wallet/fcl/authz?id=0609d667-944c-3c2d-9d09-18af5c58c8fb`
with the `Signable` as the body and expect to receive something like this back:

```javascript
const statusResponse = {
  status: "PENDING",
  reason: null,
  compositeSignature: null,
  authorizationUpdates: {
    method: "HTTP/POST",
    endpoint: "https://example.wallet/fcl/authz/736",
  },
  local: [
    {
      method: "BROWSER/IFRAME",
      endpoint: "https://example.wallet/authz/736",
    },
  ],
}
```

FCL will first see that there is an optional local side effect of `BROWSER/IFRAME`,
so FCL will render an iframe that renders `https://example.wallet/authz/736`.
This iframe is probably showing a convienence interface the user can authorize the
transaction from inside the application.

Next FCL will next notice that the signature requeset is `PENDING`, so it will then
use the data in `authorizationUpdates` to request a new status. Which could return
something like this:

```javascript
const statusResponse = {
  status: "PENDING",
  reason: null,
  compositeSignature: null,
  authorizationUpdates: {
    method: "HTTP/POST",
    endpoint: "https://example.wallet/fcl/authz/736",
  },
}
```

Once again FCL received back a `PENDING` status response, so its going to request
the status again and again and again until the status is either `APPROVED` or `DECLINED`.

> It is **IMPORTANT** to note that using an `HTTP/POST` service means the wallet provider
> is responsible for getting the signature and making it available via subsequent
> `authorizationsUpdates` calls.

An `APPROVED` status response looks like this:

```javascript
const statusResponse = {
  status: "APPROVED",
  compositeSignature: {
    addr: "0xba1132bc08f82fe2",
    keyId: 3,
    signature:
      "95ee6929dda9548abbf79802be19400fb717b003476eb1f2e080bf15f7d40b1c087e7ff2b42bea8756c6509a5135c5ee6994897367f669279fadb392f4651d48",
  },
}
```

While a `DECLINED` status response looks like this:

```javascript
const statusResponse = {
  status: "DECLINED",
  reason: "They said no",
}
```

If FCL opened an optional local side effect iframe, it will
automatically close it once the status response is something
other than `PENDING`.
