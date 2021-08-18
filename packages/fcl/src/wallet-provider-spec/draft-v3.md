## Status

- **Last Updated:** August 18th 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Medium
- **Compatibility:** `>= @onflow/fcl@0.0.77`

## Definitions

This document is written with the perspective that _you_ who are reading this right now are an FCL Wallet Developer. All references to _you_ in this doc are done with this perspective in mind.

# Overview

Flow Client Library (FCL) approaches the idea of blockchain wallets on Flow in a different way than how wallets may be supported on other blockchains. For example, with FCL, a wallet is not necessarily limited to being a browser extention or even a native application on a users device. FCL offers wallet developers the flexibility and freedom to build many different types of applications. Since wallet applications can take on many forms, we needed to create a way for these varying applications to be able to communicate and work together.

FCL acts in many ways as a protocol to facilitate communication and configuration between the different parties involved in a blockchain application. An _Application_ can use FCL to _authenticate_ users, and request _authorizations_ for transactions, as well as mutate and query the _Blockchain_. An application using FCL offers it's _Users_ a way to connect and select any number of Wallets Providers and their Wallet Services. A selected _Wallet_ provides an Applications instance of FCL with configuration information about itself and its Wallet Services, allowing the _User_ and _Application_ to interact with them.

In the following paragraphs we'll explore ways in which you, as a wallet developer, can integrate with FCL by providing implementataions of various FCL services. 

The following services will be covered:
- Authentication (Authn) Service
- Authorization (Authz) Service
- User Signature Service
- Pre-Authz Service

# Service Methods

FCL Services are your way as a Wallet Provider of configuring FCL. In accomplishing these service, FCL employs various Service Methods. Services Methods are the ways FCL can talk to your wallet. You as a Wallet Provider get to decide which of these service methods each of your services use to communicate with you.

Sometimes services just configure FCL and thats it. An example of this case can be seen with the Authentication Service and the OpenID Service.
With those two services you are simply telling FCL "here is a bunch of info about the current user". (You will see that those two services both have a `method: "DATA"` field in them.
Currently these are the only two cases that can be a data service.)

Other services can be a little more complex. For example, they might require a back and forth communication between FCL and the Service in question.
Ultimately we want to do this back and forth via a secure back-channel (https requests to servers), **but in some situations that isn't a viable option, so there is also a front-channel option**.
Where possible, you should aim to provide a back-channel support for services, and only fall back to a front-channel if absolutely necessary.

Back-channel communications use `method: "HTTP/POST"`, while front-channel communications use `method: "IFRAME/RPC"`, `method: "POP/RPC"` or `method: "TAB/RPC`.

| Service Method | Front  |  Back |
|----------------|--------|-------|
| HTTP/POST      |   ⛔   |   ✅   |
| IFRAME/RPC     |   ✅   |   ⛔   |
| POP/RPC        |   ✅   |   ⛔   |
| TAB/RPC        |   ✅   |   ⛔   |

It's important to note that regardless of the method of communication, the data that is sent back and forth between the parties involved is the same.

### IFRAME/RPC

`IFRAME/RPC` is the easiest to explain, so we will start with it:

- An iframe is rendered (comes from the `endpoint` in the service).
- The rendered frames says its ready `WalletUtils.sendMsgToFCL("FCL:VIEW:READY")`.
- FCL will send the data to be dealt with: `WalletUtils.sendMsgToFCL("FCL:VIEW:READY:RESPONSE", {...body, service: {params, data} })`
  - Where `body` is the stuff you care about, `params` and `data` are additional information you can provide in the service object.
- The wallet sends back an Approved or Declined post message. (It will be a `f_type: "PollingResponse"`, which we will get to in a bit)
  - If it's approved, the polling responses data field will need to be what FCL is expecting.
  - If it's declined, the polling responses reason field should say why it was declined.

![IFRAME/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/iframe-rpc.png)

### POP/RPC

`POP/RPC` works in an almost entirely similar way to `IFRAME/RPC`, except instead of rendering the `method` in an iframe, we render it in a popup. The same communication protocol between the rendered view and FCL applies:

- A popup is rendered (comes from `endpoint` in the service).
- The rendered popup says its ready `WalletUtils.sendMsgToFCL("FCL:VIEW:READY")`.
- FCL will send the data to be dealt with `WalletUtils.sendMsgToFCL("FCL:VIEW:READY:RESPONSE", { ...body, service: {params, data} })`
  - Where `body` is the stuff you care about, `params` and `data` are additional information you can provide in the service object.
- The wallet sends back an Approved or Declined post message (It will be a `f_type: "PollingResponse"`, we will get to that in a bit)
  - If it's approved, the polling responses data field will need to be what FCL is expecting.
  - If it's declined, the polling responses reason field should say why it was declined.

![POP/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/pop-rpc.png)

### TAB/RPC

`TAB/RPC` works in an almost entirely similar way to `IFRAME/RPC` and `POP/RPC`, except instead of rendering the `method` in an iframe or a popup, we render it in a new tab. The same communication protocol between the rendered view and FCL applies:

- A new tab is rendered (comes from `endpoint` in the service).
- The rendered tab says its ready `WalletUtils.sendMsgToFCL("FCL:VIEW:READY")`.
- FCL will send the data to be dealt with `WalletUtils.sendMsgToFCL("FCL:VIEW:READY:RESPONSE", { ...body, service: {params, data} })`
  - Where `body` is the stuff you care about, `params` and `data` are additional information you can provide in the service object.
- The wallet sends back an Approved or Declined post message (It will be a `f_type: "PollingResponse"`, we will get to that in a bit)
  - If it's approved, the polling responses data field will need to be what FCL is expecting.
  - If it's declined, the polling responses reason field should say why it was declined.

![TAB/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/tab-rpc.png)

### HTTP/POST

`HTTP/POST` initially sends a post request to the `endpoint` specified in the service, which should imediately return a `f_type: "PollingResponse"`.

Like the `IFRAME/RPC` or `POP/RPS`, our goal is to eventually get an `APPROVED` or `DECLINED` polling response, and technically this endpoint could return one of those immediately.

But more than likely that isn't the case and it will be in a `PENDING` state (`PENDING` is not available to `IFRAME/RPC` or `POP/RPC`).
When the polling response is `PENDING` it requires an `update` field that includes a service, `BackChannelRpc`, that FCL can use to request an updated `PollingResponse` from.
FCL will use that `BackChannelRpc` to request a new `PollingResponse` which itself can be `APPROVED`, `DECLINED` or `PENDING`.
If it is `APPROVED` FCL will return, otherwise if it is `DECLINED` FCL will error. However, if it is `PENDING`, it will use the `BackChannelRpc` supplied in the new `PollingResponse` update field. It will repeat this cycle until it is either `APPROVED` or `DECLINED`.

There is an additional feature that `HTTP/POST` enables in the first `PollingResponse` that is returned.
This feature is the ability for FCL to render an iframe, popup or new tab, and it can be triggered by supplying a service `type: "VIEW/FRAME"`, `type: "VIEW/POP"` or `type: "VIEW/TAB"` and the `endpoint` that the wallet wishes to render in the `local` field of the `PollingResponse`. This is a great way for a wallet provider to switch to a webpage if displaying a UI is necessary for the service it is performing.

![HTTP/POST Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/http-post.png)

### Polling Response

Each response back to FCL must be "wrapped" in a Polling Response. Each Polling Response can have it's status as `"APPROVED"`, `"DECLINED"`, or `"PENDING"`.

It is entirely acceptible for your service to immediately return an `"APPROVED"` Polling Reponse, skipping a `"PENDING"` state.

`"DECLINED"` Polling Responses must include a human readable reason for why it was declined.

```javascript
// APPROVED
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: ___, // what the service needs to send to FCL
}

// Declined
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "DECLINED",
  reason: "Declined by user."
}

// Pending - Simple
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "PENDING",
  updates: {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "back-channel-rpc",
    endpoint: "https://____", // where post request will be sent
    method: "HTTP/POST",
    data: {},   // will be included in the requests body
    params: {}, // will be included in the requests url
  }
}

// Pending - First Time with Local
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "PENDING",
  updates: {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "back-channel-rpc",
    endpoint: "https://____", // where post request will be sent
    method: "HTTP/POST",
    data: {},   // included in body of request
    params: {}, // included as query params on endpoint
  },
  local: {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "view/frame",
    endpoint: "https://____", // the iframe that will be rendered,
    data: {}, // sent to frame when ready
    params: {}, // included as query params on endpoint
  }
}
```

#### data and params

`data` and `params` are information that the wallet can provide in the service config that FCL will pass back to the service.
- `params` will be added onto the `endpoint` as query params.
- `data` will be included in the body of the `HTTP/POST` request or in the `FCL:VIEW:READY:RESPONSE` for a `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`.

# Authentication Service

In the following examples, we'll walk you through the process of building an authentication service.

In FCL, wallets are configured by passing in a wallet provider's authentication URL as the `discovery.wallet` config variable.

As someone who is making an FCL compatible wallet, you will need to make and expose a webpage or API hosted at an authentication endpoint that FCL will use.

```javascript
// IN APPLICATION
// configuring fcl to point at a wallet looks like this
import {config} from "@onflow/fcl"

config({
  "discovery.wallet": "your-url-that-fcl-will-use-for-authentication",
  "discovery.wallet.method": "IFRAME/RPC" // Available methods are "IFRAME/RPC", "POP/RPC", "TAB/RPC" or "HTTP/POST"
})
```

If the method specified is `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`, then the URL specified as `discovery.wallet` will be rendered as a webpage. Otherwise, if the method specified is `HTTP/POST`, then the authentication process will happen over HTTP requests. (While authentication can be accomplished using any of those service methods, this example will use the `IFRAME/RPC` service method.)

Once the Authentication webpage is rendered, or the API is ready, you then need to tell FCL that it is ready. You will do this by sending a message to FCL, and FCL will send back a message with some additional information that you can use about the application requesting authentication on behalf of the user.

```javascript
// IN WALLET AUTHENTICATION FRAME
import {WalletUtils} from "@onflow/fcl"

function callback({ data }) {
  if (typeof data != "object") return
  if (typeof data.type !== "FCL:VIEW:READY:RESPONSE") return

  ... // Do authentication things ...

  WalletUtils.sendMsgToFCL("PollingResponse", {
    "f_vsn": "1.0.0",
    "status": "APPROVED", // APPROVED | DECLINED
    "data": {
         ...
    }
  })
}
// add event listener first
WalletUtils.onMsgFromFCL("FCL:VIEW:READY:RESPONSE", callback)

// tell fcl the wallet is ready
WalletUtils.sendMsgToFCL("FCL:VIEW:READY")
```

During authentication, the application has a chance to request to you what they would like you to send back to them. These requests are included in the `FCL:VIEW:READY:RESPONSE` messsage sent to the wallet from FCL.

An example of such a request is the OpenID service. The application can request for example that you to send them the email address of the current user. The application requesting this information does not mean you need to send it. It's entirely optional for you to do so. However, some applications may depened on you sending the requested informaation back, and should you decline to do so it may cause the application to not work.

In the config they can also tell you a variety of things about them, such as the name of their application or a url for an icon of their application. You can use these pieces of information to customize your wallet's user experience should you desire to do so.

Your wallet having a visual distinction from the application, but still a seamless and connected experience is our goal here.

Whether your authentication process happens using a webpage with the `IFRAME/RPC`, `POP/RPC` or `TAB/RPC` methods, or using a backchannel to an API with the `HTTP/POST` method, the handshake is the same. The same messages are sent in both methods, however the transport mechanism changes. For `IFRAME/RPC`, `POP/RPC` or `TAB/RPC` methods, the transport is `window.postMessage()`, with the `HTTP/POST` method, the tranport is HTTP post messages. 

As always, you must never trust anything you receive from an application. Always do your due-dilligence and be alert as you are the users first line of defense against potentially malicious applications.

### Authenticate your User 

It's important that you are confident that the user is who the user claims to be.

Have them provide enough proof to you that you are okay with passing their details back to FCL.
Using Blocto as an example, an authentication code is sent to the email a user enters at login.
This code can be used as validation and is everything Blocto needs to be confident in the users identity.

### Once you know who your User is

Once you're confident in the users identity, we can complete the authentication process.

The authentication process is complete once FCL receives back a response that configures FCL with FCL Services for the current user. This response is extremeley important to FCL. At its core it tells FCL who the user is, and then via the included services it tells FCL how the user authenticated, how to request transaction signatures, how to get a personal message signed and the user's email and other details if requested. In the future it may also inlude many more things!

You can kind of think of FCL as a plugin system. But since those plugins exist elsewhere outside of FCL, FCL needs to be configured with information on how to communicate with those plugins.

What you are sending back to FCL is everything that it needs to communicate with the plugins that you are supplying.
Your wallet is like a plugin to FCL, and these details tell FCL how to use you as a plugin.

Here is an example of an authentication resonse:

```javascript
// IN WALLET AUTHENTICATION FRAME
import {WalletUtils} from "@onflow/fcl"

WalletUtils.sendMsgToFCL("PollingResponse", {
    f_vsn: "1.0.0",
    status: "APPROVED", // APPROVED | DECLINED
    data: {
        f_type: "FCL:VIEW:RESPONSE",
        f_vsn: "1.0.0",
        addr: "0xUSER",                      // The users flow address

        services: [                          // All the stuff that configures FCL
            
            // Authentication Service - REQUIRED
            {
                f_type: "Service",                                         // Its a service!
                f_vsn: "1.0.0",                                            // Follows the v1.0.0 spec for the service
                type: "authn",                                             // the type of service it is
                method: "DATA",                                            // Its data!
                uid: "amazing-wallet#authn",                               // A unique identifier for the service
                endpoint: "your-url-that-fcl-will-use-for-authentication", // should be the same as was passed into the config
                id: "0xUSER",                                              // the wallets internal id for the user, use flow address if you dont have one
                // The Users Info
                identity: {
                    f_type: "Identity",  // Its an Identity!
                    f_vsn: "1.0.0",      // Follows the v1.0.0 spec for an identity
                    address: "0xUSER",   // The users address
                    keyId: 0,            // OPTIONAL - The Users KeyId they will use
                },
                // The Wallets Info
                provider: {
                    f_type: "ServiceProvider",      // Its a Service Provider
                    f_vsn: "1.0.0",                 // Follows the v1.0.0 spec for service providers
                    address: "0xWallet",            // A flow address owned by the wallet
                    name: "Amazing Wallet",         // OPTIONAL - The name of your wallet. ie: "Dapper Wallet" or "Blocto Wallet"
                    description: "The best wallet", // OPTIONAL - A short description for your wallet
                    icon: "https://___",            // OPTIONAL - Image url for your wallets icon
                    website: "https://___",         // OPTIONAL - Your wallets website
                    supportUrl: "https://___",      // OPTIONAL - An url the user can use to get support from you
                    supportEmail: "help@aw.com",    // OPTIONAL - An email the user can use to get support from you
                },
            },

            // Authorization Service
            {
                f_type: "Service",
                f_vsn: "1.0.0",
                type: "authz",
                uid: "amazing-wallet#authz",
                ...
                // We will cover this at length in the authorization section of this guide
            },
            
            // User Signature Service
            {
                f_type: "Service",
                f_vsn: "1.0.0",
                type: "user-signature",
                uid: "amazing-wallet#user-signature",
                ...
                // We will cover this at length in the user signature section of this guide
            },

            // OpenID Service
            {
                f_type: "Service",
                f_vsn: "1.0.0",
                type: "open-id",
                uid: "amazing-wallet#open-id",
                method: "DATA",
                data: { // only include data that was request, ideally only if the user approves the sharing of data, everything is optional
                    f_type: "OpenID",
                    f_vsn: "1.0.0",
                    profile: {
                        name: "Jeff",
                        family_name: "D", // icky underscored names because of OpenID Connect spec
                        given_name: "Jeffrey",
                        middle_name: "FakeMiddleName",
                        nickname: "JeffJeff",
                        preferred_username: "Jeff",
                        profile: "https://www.jeff.jeff/",
                        picture: "https://avatars.onflow.org/avatar/jeff",
                        website: "https://www.jeff.jeff/",
                        gender: "male",
                        birthday: "1900-01-01", // can use 0000 for year if year is not known
                        zoneinfo: "America/Vancouver",
                        locale: "en",
                        updated_at: "1625588304427"
                    },
                    email: {
                        email: "jeff@jeff.jeff",
                        email_verified: false,
                    }
                },
            }
        ]
    }
  })
```

### Stoping an Authentication Process.

From any frame, you can send a `FCL:VIEW:CLOSE` post message to FCL, which will halt FCL's current routine and close the frame.

```javascript
import {WalletUtils} from "@onflow/fcl"

WalletUtils.sendMsgToFCL("FCL:VIEW:CLOSE")
```

# Authorization Service

Authorization services are depicted with with a `type: "authz"`, and a `method` of either `HTTP/POST`, `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`.
They are expected to eventually return a `f_type: "CompositeSignature"`.

An authorization service is expected to know the Account and the Key that will be used to sign the transaction at the time the service is sent to FCL (during authentication).

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authz",               // say its an authorization service
  uid: "amazing-wallet#authz", // standard service uid
  method: "HTTP/POST",         // can also be `IFRAME/RPC` or `POP/RPC`
  endpoint: "https://____",    // where to talk to the service
  identity: {
    f_type: "Identity",
    f_vsn: "1.0.0",
    address: "0xUser",         // the address that the signature will be for
    keyId: 0,                  // the key for the address that the signature will be for
  },
  data: {},
  params: {},
}
```

FCL will use the `method` provided to request an array of composite signature from authorization service (Wrapped in a `PollingResponse`).
The authorization service will be sent a `Signable`.
The service is expected to construct an encoded message to sign from `Signable.voucher`.
It then needs to hash the encoded message, and prepend a required [transaction domain tag](https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/src/encode/encode.js#L12-L13).
Finally it signs the payload with the user/s keys, producing a signature.
This signature, as a HEX string, is sent back to FCL as part of the `CompositeSignature` which includes the user address and keyID in the data property of a `PollingResponse`.

```elixir
siganture = 
  signable.voucher
    |> encode
    |> hash
    |> tag
    |> sign
    |> convert_to_hex
```

The eventual response back from the authorization service should resolve to something like this:
```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: {
    f_type: "CompositeSignature",
    f_vsn: "1.0.0",
    addr: "0xUSER",
    keyId: 0,
    signature: "signature as hex value"
  }
}
```

# User Signature Service

User Signature services are depicted with a `type: "user-signature"` and a `method` of either `HTTP/POST`, `IFRAME/RPC` or `POP/RPC`.
They are expected to eventually return an array of `f_type: "CompositeSignature"`.

The User Signature service is a stock/standard service.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "user-signature",               // say its an user-signature service
  uid: "amazing-wallet#user-signature", // standard service uid
  method: "HTTP/POST",                  // can also be `IFRAME/RPC`
  endpoint: "https://___",              // where to talk to the service
  data: {},
  params: {},
}
```

FCL will use the `method` provided to request an array of composite signatures from the user signature service (Wrapped in a `PollingResponse`).
The user signature service will be sent a `Signable`.
The service is expected to tag the `Signable.message` and then sign it with enough keys to produce a full weight.
The signatures need to be sent back to FCL as HEX strings in an array of `CompositeSignatures`.

```javascript
// Pseudocode:
// For every required signature

const taggedMessage = tagMessage(signable.message) // Tag the messsage to sign
const signature = signMessage(taggedMessage) // Sign the message
const hexSignature = signatureToHex(signature) // Convert the signature to hex, if required.

return hexSignature
```

The eventual response back from the user signature service should resolve to something like this:
```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: [
    {
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: "0xUSER",
      keyId: 0,
      signature: "signature as hex value"
    },
    {
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: "0xUSER",
      keyId: 1,
      signature: "signature as hex value"
    }
  ]
}
```

# Pre Authz Service

This is a strange one, but extremely powerful. This service should be used when a wallet is responsible for an account that's signing as multiple roles of a transaction, and wants the ability to change the accounts on a per role basis.

Pre Authz Services are depicted with a `type: "pre-authz"` and a `method` of either `HTTP/POST`, `IFRAME/RPC` or `POP/RPC`.
They are expected to eventually return a `f_type: "PreAuthzResponse"`.

The Pre Authz Service is a stock/standard service.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "pre-authz",               // say its a pre-authz service
  uid: "amazing-wallet#pre-authz", // standard service uid
  method: "HTTP/POST",             // can also be IFRAME/RPC, POP/RPC, TAB/RPC
  endpoint: "https://___",         // where to talk to the service
  data: {},
  params: {},
}
```

FCL will use the `method` provided to request a `PreAuthzReponse` (Wrapped in a `PollingResponse`).
The Authorizations service will be sent a `PreSignable`.
The pre-authz service is expected to look at the `PreSignable` and determine the breakdown of accounts to be used.
The pre-authz service is expected to return `Authz` services for each role it is responsible for.
A pre-authz service can only supply roles it is responsible for.
If a pre-authz service is responsible for multiple roles, but it wants the same account to be responsible for all the roles, it will need to supply an Authz service per role.

The eventual response back from the pre-authz service should resolve to something like this:
```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: {
    f_type: "PreAuthzResponse",
    f_vsn: "1.0.0",
    proposer: {              // A single Authz Service
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authz",
      ...
    },
    payer: [                // An array of Authz Services
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authz",
        ...
      }
    ],
    authorization: [       // An array of Authz Serivces (its singular because it only represents a singular authorization)
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authz",
        ...
      }
    ],
  }
}
```

# Data Structures

FCL employs the following data structures, of which you have previously seen in use throughout this document.

- [CompositeSignature](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/composite-signature.js)
- [PollingResponse](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/polling-response.js)
- [authn](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/authn.js)
- [authz](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/authz.js)
- [pre-authz](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/pre-authz.js)
- [user-signature](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/user-signature.js)
- [local-view](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/local-view.js)
- [frame](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/frame.js)
- [back-channel-rpc](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/back-channel-rpc.js)
- [open-id](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/current-user/normalize/open-id.js)
  