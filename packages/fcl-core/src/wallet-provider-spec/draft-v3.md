## Status

- **Last Updated:** April 4th 2022
- **Stable:** Yes
- **Risk of Breaking Change:** Medium
- **Compatibility:** `>= @onflow/fcl@1.0.0-alpha.0`

## Definitions

This document is written with the perspective that _you_ who are reading this right now are an FCL Wallet Developer. All references to _you_ in this doc are done with this perspective in mind.

# Overview

Flow Client Library (FCL) approaches the idea of blockchain wallets on Flow in a different way than how wallets may be supported on other blockchains. For example, with FCL, a wallet is not necessarily limited to being a browser extension or even a native application on a users device. FCL offers wallet developers the flexibility and freedom to build many different types of applications. Since wallet applications can take on many forms, we needed to create a way for these varying applications to be able to communicate and work together.

FCL acts in many ways as a protocol to facilitate communication and configuration between the different parties involved in a blockchain application. An _Application_ can use FCL to _authenticate_ users, and request _authorizations_ for transactions, as well as mutate and query the _Blockchain_. An application using FCL offers its _Users_ a way to connect and select any number of Wallet Providers and their Wallet Services. A selected _Wallet_ provides an Application's instance of FCL with configuration information about itself and its Wallet Services, allowing the _User_ and _Application_ to interact with them.

In the following paragraphs we'll explore ways in which you can integrate with FCL by providing implementations of various FCL services.

The following services will be covered:

- Authentication (Authn) Service
- Authorization (Authz) Service
- User Signature Service
- Pre-Authz Service

# Service Methods

FCL Services are your way as a Wallet Provider of configuring FCL with information about what your wallet can do. FCL uses what it calls `Service Methods` to perform your supported FCL services. Service Methods are the ways FCL can talk to your wallet. Your wallet gets to decide which of these service methods each of your supported services use to communicate with you.

Sometimes services just configure FCL and that's it. An example of this can be seen with the Authentication Service and the OpenID Service.
With those two services you are simply telling FCL "here is a bunch of info about the current user". (You will see that those two services both have a `method: "DATA"` field in them.
Currently these are the only two cases that can be a data service.)

Other services can be a little more complex. For example, they might require a back and forth communication between FCL and the Service in question.
Ultimately we want to do this back and forth via a secure back-channel (https requests to servers), **but in some situations that isn't a viable option, so there is also a front-channel option**.
Where possible, you should aim to provide a back-channel support for services, and only fall back to a front-channel if absolutely necessary.

Back-channel communications use `method: "HTTP/POST"`, while front-channel communications use `method: "IFRAME/RPC"`, `method: "POP/RPC"`, `method: "TAB/RPC` and `method: "EXT/RPC"`.

| Service Method | Front  |  Back |
|----------------|--------|-------|
| HTTP/POST      |   ⛔   |   ✅   |
| IFRAME/RPC     |   ✅   |   ⛔   |
| POP/RPC        |   ✅   |   ⛔   |
| TAB/RPC        |   ✅   |   ⛔   |
| EXT/RPC        |   ✅   |   ⛔   |

It's important to note that regardless of the method of communication, the data that is sent back and forth between the parties involved is the same.

## IFRAME/RPC (Front Channel)

`IFRAME/RPC` is the easiest to explain, so we will start with it:

- An iframe is rendered (comes from the `endpoint` in the service).
- The rendered iframe adds a listener and sends the `"FCL:VIEW:READY"` message. This can be simplified `WalletUtils.ready(callback)`
- FCL will send the data to be dealt with:
  - Where `body` is the stuff you care about, `params` and `data` are additional information you can provide in the service object.
- The wallet sends back an `"APPROVED"` or `"DECLINED"` post message. (It will be a `f_type: "PollingResponse"`, which we will get to in a bit). This can be simplified using `WalletUtils.approve` and `WalletUtils.decline`
  - If it's approved, the polling response's data field will need to be what FCL is expecting.
  - If it's declined, the polling response's reason field should say why it was declined.

```javascript
export const WalletUtils.approve = data => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: data,
  })
}

export const WalletUtils.decline = reason => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason: reason,
    data: null,
  })
}
```

![IFRAME/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/iframe-rpc.png)

### POP/RPC | TAB/RPC (Front Channel)

`POP/RPC` and `TAB/RPC` work in an almost entirely similar way to `IFRAME/RPC`, except instead of rendering the `method` in an iframe, we render it in a popup or new tab. The same communication protocol between the rendered view and FCL applies.

![POP/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/pop-rpc.png)

![TAB/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/tab-rpc.png)

### HTTP/POST (Back Channel)

`HTTP/POST` initially sends a post request to the `endpoint` specified in the service, which should immediately return a `f_type: "PollingResponse"`.

Like `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`, our goal is to eventually get an `APPROVED` or `DECLINED` polling response, and technically this endpoint could return one of those immediately.

But more than likely that isn't the case and it will be in a `PENDING` state (`PENDING` is not available to `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`).
When the polling response is `PENDING` it requires an `updates` field that includes a service, `BackChannelRpc`, that FCL can use to request an updated `PollingResponse` from.
FCL will use that `BackChannelRpc` to request a new `PollingResponse` which itself can be `APPROVED`, `DECLINED` or `PENDING`.
If it is `APPROVED` FCL will return, otherwise if it is `DECLINED` FCL will error. However, if it is `PENDING`, it will use the `BackChannelRpc` supplied in the new `PollingResponse` updates field. It will repeat this cycle until it is either `APPROVED` or `DECLINED`.

There is an additional optional feature that `HTTP/POST` enables in the first `PollingResponse` that is returned.
This optional feature is the ability for FCL to render an iframe, popup or new tab, and it can be triggered by supplying a service `type: "VIEW/IFRAME"`, `type: "VIEW/POP"` or `type: "VIEW/TAB"` and the `endpoint` that the wallet wishes to render in the `local` field of the `PollingResponse`. This is a great way for a wallet provider to switch to a webpage if displaying a UI is necessary for the service it is performing.

![HTTP/POST Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/http-post.png)

### EXT/RPC (Front Channel)

`EXT/RPC` is used to enable and communicate between FCL and an installed (Chrome) browser extension. Usage of `EXT/RPC` is a bit more complex and relies on 3 key scripts to allow message passing between an installed extension and FCL. The global separation of context created by Chrome between the two and the availability of Chrome APIs within those contexts require these scripts to be setup in a particular sequence so that the communication channels needed by FCL's `EXT/RPC` service method will work.

The following is an overview of these scripts and the functionality they need to support FCL:

- `background.js`: Used to launch the extension with `chrome.windows.create` if selected by the user from Discovery or set directly via `fcl.config.discovery.wallet`
- `content.js`: Used to proxy messages between the dapp to the extension via `chrome.runtime.sendMessage`.
- `script.js`: Injected by `content.js` into the dapp's HTML page. It adds the extension authn service to `window.fcl_extensions` list on page load. This allows FCL to confirm installation and send extension details to Discovery or launch your wallet as the default wallet.

An example and guide showing how to build an FCL compatible wallet extension on Flow can be found [here](https://github.com/onflow/wallet-extension-example).

Once the extension is enabled, the same communication protocol between the rendered view and FCL applies:

- A extension is rendered in a popup or new tab (comes from `endpoint` in the service).
- The rendered popup says it's ready by sending a `"FCL:VIEW:READY"` message to the content script in the specified tab.
- FCL will send the service data via `window.postMessage()` including the `type`: `"FCL:VIEW:READY:RESPONSE"`, `body`, and optional `params` or `data`.
- The wallet sends back an `"APPROVED"` or `"DECLINED"` response via `chrome.tabs.sendMessage()` (It will be a `f_type: "PollingResponse"`)
  - If it's approved, the polling response's data field will need to be what FCL is expecting.
  - If it's declined, the polling response's reason field should say why it was declined.

```javascript
  chrome.tabs.sendMessage(tabs[0].id, {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: {
      f_type: "AuthnResponse",
      f_vsn: "1.0.0",
      addr: address,
      services: services,
    },
  });
```

![EXT/RPC Diagram](https://raw.githubusercontent.com/onflow/flow-js-sdk/master/packages/fcl/assets/service-method-diagrams/ext-rpc.png)

### Polling Response

Each response back to FCL must be "wrapped" in a Polling Response. Each Polling Response can have its status as `"APPROVED"`, `"DECLINED"`, or `"PENDING"`.

It is entirely acceptable for your service to immediately return an `"APPROVED"` Polling Response, skipping a `"PENDING"` state.

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
    data: {},   // will be included in the request's body
    params: {}, // will be included in the request's url
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
    endpoint: "https://____", // the iframe that will be rendered,
    method: "VIEW/IFRAME",
    data: {}, // sent to frame when ready
    params: {}, // included as query params on endpoint
  }
}
```

A `PollingResponse` can alternatively be constructed using `WalletUtils` when sending `"APPROVED"` or `"DECLINED"` responses.

```javascript
import {WalletUtils} from "@onflow/fcl"

// Approving a PollingResponse
// Example using an AuthnResponse as the PollingResponse data
WalletUtils.approve({
  f_type: "AuthnResponse",
  f_vsn: "1.0.0"
  ...
})

// Rejecting a PollingResponse
// Supplies a reason for declining
const reason = "User declined to authenticate."
WalletUtils.decline(reason)
```

### `data` and `params`

`data` and `params` are information that the wallet can provide in the service config that FCL will pass back to the service.
- `params` will be added onto the `endpoint` as query params.
- `data` will be included in the body of the `HTTP/POST` request or in the `FCL:VIEW:READY:RESPONSE` for a `IFRAME/RPC`, `POP/RPC`, `TAB/RPC` or `EXT/RPC`.

# Authentication Service

In the following examples, we'll walk you through the process of building an authentication service.

In FCL, wallets are configured by passing in a wallet provider's authentication URL or extension endpoint as the `discovery.wallet` config variable.

You will need to make and expose a webpage or API hosted at an authentication endpoint that FCL will use.

```javascript
// IN APPLICATION
// configuring fcl to point at a wallet looks like this
import {config} from "@onflow/fcl"

config({
  "discovery.wallet": "url-or-endpoint-fcl-will-use-for-authentication", // FCL Discovery endpoint, wallet provider's authentication URL or extension endpoint
  "discovery.wallet.method": "IFRAME/RPC" // Optional. Available methods are "IFRAME/RPC", "POP/RPC", "TAB/RPC", "EXT/RPC" or "HTTP/POST", defaults to "IFRAME/RPC".
})
```

If the method specified is `IFRAME/RPC`, `POP/RPC` or `TAB/RPC`, then the URL specified as `discovery.wallet` will be rendered as a webpage. If the configured method is `EXT/RPC`, `discovery.wallet` should be set to the extension's `authn` `endpoint`. Otherwise, if the method specified is `HTTP/POST`, then the authentication process will happen over HTTP requests. (While authentication can be accomplished using any of those service methods, this example will use the `IFRAME/RPC` service method.)

Once the Authentication webpage is rendered, the extension popup is enabled, or the API is ready, you then need to tell FCL that it is ready. You will do this by sending a message to FCL, and FCL will send back a message with some additional information that you can use about the application requesting authentication on behalf of the user.

The following example is using the `IFRAME/RPC` method. Your authentication webpage will likely resemble the following code:

```javascript
// IN WALLET AUTHENTICATION FRAME
import {WalletUtils} from "@onflow/fcl"

function callback(data) {
  if (typeof data != "object") return
  if (data.type !== "FCL:VIEW:READY:RESPONSE") return

  ... // Do authentication things ...

  // Send back AuthnResponse
  WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    data: {
      f_type: "AuthnResponse",
      f_vsn: "1.0.0"
      ...
    }
  })
  
  // Alternatively be sent using WalletUtils.approve (or WalletUtils.decline)
  // which will wrap AuthnResponse in a PollingResponse
  WalletUtils.approve({
    f_type: "AuthnResponse",
    f_vsn: "1.0.0"
    ...
  })
}
// add event listener first
WalletUtils.onMsgFromFCL("FCL:VIEW:READY:RESPONSE", callback)

// tell fcl the wallet is ready
WalletUtils.sendMsgToFCL("FCL:VIEW:READY")

// alternatively adds "FCL:VIEW:READY:RESPONSE" listener and sends "FCL:VIEW:READY"
WalletUtils.ready(callback)
```

During authentication, the application has a chance to request to you what they would like you to send back to them. These requests are included in the `FCL:VIEW:READY:RESPONSE` message sent to the wallet from FCL.

An example of such a request is the OpenID service. The application can request for example that you to send them the email address of the current user. The application requesting this information does not mean you need to send it. It's entirely optional for you to do so. However, some applications may depend on you sending the requested information back, and should you decline to do so it may cause the application to not work.

In the config they can also tell you a variety of things about them, such as the name of their application or a url for an icon of their application. You can use these pieces of information to customize your wallet's user experience should you desire to do so.

Your wallet having a visual distinction from the application, but still a seamless and connected experience is our goal here.

Whether your authentication process happens using a webpage with the `IFRAME/RPC`, `POP/RPC` or `TAB/RPC` methods, via an enabled extension using the `EXT/RPC` method, or using a backchannel to an API with the `HTTP/POST` method, the handshake is the same. The same messages are sent in all methods, however the transport mechanism changes. For `IFRAME/RPC`, `POP/RPC`, `TAB/RPC` or `EXT/RPC` methods, the transport is `window.postMessage()`, with the `HTTP/POST` method, the transport is HTTP post messages.

As always, you must never trust anything you receive from an application. Always do your due-diligence and be alert as you are the user's first line of defense against potentially malicious applications.

### Authenticate your User 

It's important that you are confident that the user is who the user claims to be.

Have them provide enough proof to you that you are okay with passing their details back to FCL.
Using Blocto as an example, an authentication code is sent to the email a user enters at login.
This code can be used as validation and is everything Blocto needs to be confident in the user's identity.

### Once you know who your User is

Once you're confident in the user's identity, we can complete the authentication process.

The authentication process is complete once FCL receives back a response that configures FCL with FCL Services for the current user. This response is extremely important to FCL. At its core it tells FCL who the user is, and then via the included services it tells FCL how the user authenticated, how to request transaction signatures, how to get a personal message signed and the user's email and other details if requested. In the future it may also include many more things!

You can kind of think of FCL as a plugin system. But since those plugins exist elsewhere outside of FCL, FCL needs to be configured with information on how to communicate with them.

What you are sending back to FCL is everything that it needs to communicate with the plugins that you are supplying.
Your wallet is like a plugin to FCL, and these details tell FCL how to use you as a plugin.

Here is an example of an authentication response:

```javascript
// IN WALLET AUTHENTICATION FRAME
import {WalletUtils} from "@onflow/fcl"

WalletUtils.approve({
  f_type: "AuthnResponse",
  f_vsn: "1.0.0",
  addr: "0xUSER",                      // The user's flow address

  services: [                          // All the stuff that configures FCL
      
      // Authentication Service - REQUIRED
      {
          f_type: "Service",                                         // It's a service!
          f_vsn: "1.0.0",                                            // Follows the v1.0.0 spec for the service
          type: "authn",                                             // the type of service it is
          method: "DATA",                                            // It's data!
          uid: "amazing-wallet#authn",                               // A unique identifier for the service
          endpoint: "your-url-that-fcl-will-use-for-authentication", // should be the same as was passed into the config
          id: "0xUSER",                                              // the wallet's internal id for the user, use flow address if you don't have one
          // The User's Info
          identity: {
              f_type: "Identity",  // It's an Identity!
              f_vsn: "1.0.0",      // Follows the v1.0.0 spec for an identity
              address: "0xUSER",   // The user's address
              keyId: 0,            // OPTIONAL - The User's KeyId they will use
          },
          // The Wallet's Info
          provider: {
              f_type: "ServiceProvider",      // It's a Service Provider
              f_vsn: "1.0.0",                 // Follows the v1.0.0 spec for service providers
              address: "0xWallet",            // A flow address owned by the wallet
              name: "Amazing Wallet",         // OPTIONAL - The name of your wallet. ie: "Dapper Wallet" or "Blocto Wallet"
              description: "The best wallet", // OPTIONAL - A short description for your wallet
              icon: "https://___",            // OPTIONAL - Image url for your wallet's icon
              website: "https://___",         // OPTIONAL - Your wallet's website
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
})
```

### Stopping an Authentication Process

From any frame, you can send a `FCL:VIEW:CLOSE` post message to FCL, which will halt FCL's current routine and close the frame.

```javascript
import {WalletUtils} from "@onflow/fcl"

WalletUtils.sendMsgToFCL("FCL:VIEW:CLOSE")
```

# Authorization Service

Authorization services are depicted with with a `type: "authz"`, and a `method` of either `HTTP/POST`, `IFRAME/RPC`, `POP/RPC`, `TAB/RPC` or `EXT/RPC`.
They are expected to eventually return a `f_type: "CompositeSignature"`.

An authorization service is expected to know the Account and the Key that will be used to sign the transaction at the time the service is sent to FCL (during authentication).

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authz",               // say it's an authorization service
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
It then needs to hash the encoded message, and prepend a required [transaction domain tag](../../../sdk/src/encode/encode.ts#L12-L13).
Finally it signs the payload with the user/s keys, producing a signature.
This signature, as a HEX string, is sent back to FCL as part of the `CompositeSignature` which includes the user address and keyID in the data property of a `PollingResponse`.

```elixir
signature = 
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

A `CompositeSignature` can alternatively be constructed using `WalletUtils`

```javascript
import {WalletUtils} from "@onflow/fcl"

WalletUtils.CompositeSignature(addr: String, keyId: Number, signature: Hex)

```

# User Signature Service

User Signature services are depicted with a `type: "user-signature"` and a `method` of either `HTTP/POST`, `IFRAME/RPC`, `POP/RPC`, `TAB/RPC` or `EXT/RPC`.
They are expected to eventually return an array of `f_type: "CompositeSignature"`.

The User Signature service is a stock/standard service.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "user-signature",               // say it's an user-signature service
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
import {WalletUtils} from "@onflow/fcl"

const encoded = WalletUtils.encodeMessageFromSignable(signable, signerAddress)
const taggedMessage = tagMessage(encoded) // Tag the message to sign
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

Pre Authz Services are depicted with a `type: "pre-authz"` and a `method` of either `HTTP/POST`, `IFRAME/RPC`, `POP/RPC`, `TAB/RPC` or `EXT/RPC`.
They are expected to eventually return a `f_type: "PreAuthzResponse"`.

The Pre Authz Service is a stock/standard service.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "pre-authz",               // say it's a pre-authz service
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
    authorization: [       // An array of Authz Services (it's singular because it only represents a singular authorization)
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

# Authentication Refresh Service

Since synchronization of a user's session is important to provide a seamless user experience when using an app and transacting with the Flow Blockchain, a way to confirm, extend, and refresh a user session can be provided by the wallet.

Authentication Refresh Services should include a `type: "authn-refresh"`, `endpoint`, and supported `method` (`HTTP/POST`, `IFRAME/RPC`, `POP/RPC`, or `EXT/RPC`).

FCL will use the `endpoint` and service `method` provided to request updated authentication data.
The `authn-refresh` service should refresh the user's session if necessary and return updated authentication configuration and user session data.

The service is expected to return a `PollingResponse` with a new `AuthnResponse` as data. If user input is required, a `PENDING` `PollingResponse` can be returned with a `local` view for approval/re-submission of user details.

The Authentication Refresh Service is a stock/standard service.

```javascript
  {
    "f_type": "Service",
    "f_vsn": "1.0.0",
    "type": "authn-refresh",
    "uid": "uniqueDedupeKey",
    "endpoint": "https://rawr",
    "method": "HTTP/POST",  // "HTTP/POST", // HTTP/POST | IFRAME/RPC | HTTP/RPC
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallet's internal id for the user
    "data": {}, // included in body of request
    "params": {}, // included as query params on endpoint url
  }
```

The provided `data` and `params` should include all the wallet needs to identify and re-authenticate the user if necessary.

The eventual response back from the `authn-refresh` service should resolve to an `AuthnResponse` and look something like this:

```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: {
    f_type: "AuthnResponse",
    f_vsn: "1.0.0",
    addr: "0xUSER",
    services: [
      // Authentication Service - REQUIRED
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        ...
      },
      // Authorization Service
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authz",
        ...
      },
      // Authentication Refresh Service
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn-refresh",
        ...
      }
      // Additional Services
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
