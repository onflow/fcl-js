# Third Generation FCL Compatible Wallet Provider Docs

## Status

- **Last Updated:** Dec 1st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium
- **Compatibility:** `>= @onflow/fcl@0.0.67`

This document is a rough draft and very much a work in progress, the concepts here are
an extension and refinement on the Second Generation FCL Compatible Wallet Provider Docs.
We will try as hard as possible to not introduce any breaking changes for wallets that already exist.

# Overview

In general one of the main goals of FCL is to create a system of back-channel communications
between the applications and the service providers. The user should be able to initiate this
back-channel via the application, discover their desired service and then verify the connection
from the service. FCL aims to standardise the discovery and communications between these three
parties (User, Application, Service).

# Table of Contents

- Overview
- Discovery of Identity
- Identity as Configuration
- Key Services
  - authn
  - authz
  - pre-authz
  - back-channel-rpc
  - frame
- Service Methods
  - HTTP/POST
  - HTTP/RPC
  - IFRAME/RPC
- Responses
  - Polling Response
  - Composite Signature
  - PreAuthzResponse

# Discovery of Identity

TODO: Write

# Identity as Configuration

TODO: Write

# Key Services

Services are abilities an account can perform. You can kind of think of them as
a function where its behaviour and input is defined by the service. The returned
value will be dependant on the type of service it is.

## `authn`

> Not yet implemented

Returns a `__TODO__` with a `__TODO__` as the data.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authn",
  uid: "____",
  endpoint: "https://____",
  id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
  identity: {
    address: "0x_____", // users flow address
  },
  provider: {
    address: "0x______", // providers flow address
    name: "Best Wallet", // Name of wallet
    icon: "https://___", // Img url for wallet logo
    description: "Description of the best wallet",
  },
}
```

## `authz`

Returns a `PollingResponse` with a `CompositeSignature` as the data.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "authz",
  uid: "____",
  endpoint: "https://___",
  method: "HTTP/POST", // Service Methods: HTTP/POST | IFRAME/RPC | HTTP/RPC
  identity: {
    address: "0x_________",
    keyId: 0
  },
  data: {},   // included in body of authz request
  params: {}, // included as query params on endpoint url
}
```

## `pre-authz`

Returns a `PollingResponse` with a `PreAuthzResponse` as the data.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "pre-authz",
  uid: "____",
  endpoint: "https://___",
  method: "HTTP/POST", // Service Methods: HTTP/POST | IFRAME/RPC | HTTP/RPC
  data: {},   // included in body of pre-authz request
  params: {}, // included as query params on endpoint url
}
```

## `back-channel-rpc`

Returns a `PollingResponse` with an `inherited return value` as the data.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "back-channel-rpc",
  endpoint: "https://___",
  method: "HTTP/GET", // HTTP/GET | HTTP/POST (these are actual http methods, not a service method)
  data: {},   // included in body of back-channel-rpc request, if supplied method must be "HTTP/POST"
  params: {}, // included as query params on endpoint url
}
```

## `frame`

Returns a `PollingResponse` with an `inherited return value` as the data.

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "frame",
  endpoint: "https://___",
  data: {},   // included in body of ready message
  params: {}, // included as query params on endpoint url
}
```

# Service Methods

## `HTTP/POST`

```
           FCL                               ENDPOINT
            |                                    |
            |---[fetchService(service, body)]--->|
            |                                    |
            |<-[PollingResponse(PENDING)]--------|
            |                                    |
            ?-----[render(resp.local)]           |
            |                                    |
+-PENDING-->|-----[poll(resp.updates)]---------->|
|           |                                    |
+<----------+-------[PollingResponse]------------|
|           |
+-APPROVED->|-----[CONTINUE]
|
+-DECLINED--------[ERROR]
```

```javascript
// Example of calling fetchService with an HTTP/POST Service to showcase endpoint/params/data
async function fetchService(service, body) {
  return fetch(url(service.endpoint, service.params), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...body, data: service.data}),
  }).then(d => d.json())
} // REturns a PollingResonse Data Type
```

## `HTTP/RPC`

> This is currently aliased to HTTP/POST, if you want this functionality return a PollingResponse that is either `APPROVED` or `DECLINED`.

## `IFRAME/RPC`

```
        FCL
         |
         |----------------------------+-[frame(service, body)]--+
         |                            |                         |
         |                            |         ENDPOINT        |
         |                            |            |            |
         |<------[message(FCL:FRAME:READY)]--------|            |
         |                            |            |            |
         |----------[message(fcl:sign)]----------->|  // Will eventually be FCL:FRAME:RPC
         |                            |            |            |
         |<------[message(PollingResponse)]--------|            |
         |                            |            |            |
         |                            |                         |
         |-----[CLOSE]--------------->+-------------------------+
```

```javascript
// Example of calling frame(service, body) to showcase endpoint/params/data
async function frame(service, body) {
  const [sendMessage, on] = renderFrame(url(service.endpoint, service.params))
  on("FCL:FRAME:READY", () => sendMessage({...body, data: service.data}))
}
```

# Responses

## `PollingResponse`

```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "PENDING", // PENDING | APPROVED | DECLINED
  reason: null,      // if status is DECLINED this is a string that specifies why
  data: null,        // if status is APPROVED this is the value FCL needs
  updates: null,     // Optional `back-channel-rpc` Service (Required if status is PENDING)
  local: null,       // Optional `frame` Service
}
```

## `CompositeSignature`

```javascript
{
  f_type: "CompositeSignature",
  f_vsn: "1.0.0",
  addr: "____", // Flow Address (sans-prefix)
  keyId: 3,
  signature: "______", // Signature as a hex string
}
```

## `PreAuthzResponse`

> If the same Flow Address/KeyId pair is used in multiple different roles, they will need to show up in the result once for each role.

```javascript
{
  f_type: "PreAuthzResponse",
  f_vsn: "1.0.0",
  proposer: null,    // Singular Authz Service,
  payer: [],         // Multiple Authz Services (for same Flow Address (different KeyId))
  authorization: [], // Multiple Authz Services (for same Flow Address (different KeyId))
}
```
