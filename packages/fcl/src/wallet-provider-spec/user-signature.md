# User Signature

## Status

- **Last Updated:** June 1st 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Medium
- **Compatibility:** `>= @onflow/fcl@0.0.70`

# Overview and Introduction

**Personally sign data via FCL Compatible Wallets**

**FCL** now incldues **`signUserMessage()`** which allows for the sending of unencrypted message data to a connected wallet provider or service to be signed with a user's private key. 

An application or service can verify a signature against a user's public key on the **Flow Blockchain** providing proof a user controls the account's private key.   

**Use Cases**

- **Authentication**: Cryptographically verify the ownership of a **Flow** account by signing a piece of data using a private key
- **Improved Application Login**
  - **Increased security**: Arguably more secure than proof of ownership by email/password
  - **Simplified UX**: No application password required
  - **Increased privacy**: No email or third party authentication service needed
- **Message Validation**: Assuring that a message sent or received has not been tampered with
- **Multisig contracts**
- **Decentralised exchanges**
- **Meta transactions**


# Config and Authentication

As a prerequisite, **FCL** is configured to point to the Wallet Provider's Authentication Endpoint.

> During development (and on mainnet) FCL can be configured to use the wallet directly by
> setting the **Challenge Handshake Url** to the wallet providers **Authentication Endpoint**
> by configuring fcl like this `config().put("challenge.handshake", "https://my-awesome-wallet-provider.com/fcl/authenticate")`.

1. A user initiates authentication with the wallet provider via application UI
2. The wallet confirms a user's identity and sends back information used to configure **FCL** for future user actions in the application
3. Included in the authentication response should be the provider's [Key Services](#) including a **`user-signature`** service for use with **`signUserMessage()`**


# User Signature Service

A User Signing Service's job is to receive a signable message from **FCL**, and send back a **`Composite Signature`**.

A **`user-signature`** service should conform to the following:

```javascript
{
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "user-signature",
  uid: "uniqueDedupeKey",
  endpoint: "http://rawr.io",
  method: "IFRAME/RPC",
  uid: "____",
  endpoint: "https://____",
  method: "IFRAME/RPC", 
  "id": "____", // wallets internal id for the user
  data: {},   // included in body of user-signature request
  params: {}, // included as query params on endpoint url
}
```

The `user-signature` service returns a **`PollingResponse`** with a **`CompositeSignature`** or `null` as the data.


## `PollingResponse`

```javascript
{
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED", // PENDING | APPROVED | DECLINED
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

# Signing Sequence

1. Application sends message to signing service. **FCL expects a hexadecimal string**
3. Service prepares, hashes, and signs the message
2. Wallet returns Composite Signature consisting of **addr**, **keyId**, **signature**

---

When `signUserMessage()` is called by the application, **FCL** will render an iframe using the authenticated user's signing service as its source.

Users will be shown a page that the wallet controls inside of an iframe,
that page is responsible for sending back a message to the application with a `postMessage` of type **`FCL:FRAME:READY`**

Upon receipt of the ready message, the application responds with a `postMessage` of type **`FCL:FRAME:READY:RESPONSE`**

The wallet iframe can listen for and respond to **`FCL:FRAME:READY:RESPONSE`** message. 

**FCL** responds with a `postMessage` that includes `type`, `body`, and `service` properties:

```javascript
{
	type: "FCL:FRAME:READY:RESPONSE",
	body,
	service: {
	  params: service.params,
	  data: service.data,
	},
}
```
```
        FCL
         |
         |----------------------------+-[frame(service, body)]--+
         |                            |                         |
         |                            |         ENDPOINT        |
         |                            |            |            |
         |<------[message(FCL:FRAME:READY)]--------|            |
         |                            |            |            |
         |----------[message(FCL:FRAME:READY:RESPONSE)]-------->|  
         |                            |            |            |
         |<------[message(PollingResponse)]--------|            |
         |                            |            |            |
         |                            |                         |
         |-----[CLOSE]--------------->+-------------------------+
```
 
*Additional query params can be added to the url based on details from user-signature service.*

**Inside of this iframe, everything is up to the wallet**

---

Given this service:

```javascript
const service = {
  f_type: "Service",
  f_vsn: "1.0.0",
  type: "user-signature",
  uid: "uniqueDedupeKey",
  endpoint: "http://rawr.io",
  method: "IFRAME/RPC",
  uid: "____",
  endpoint: "https://___",
  method: "IFRAME/RPC", // Service Methods: HTTP/POST | IFRAME/RPC
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // wallets internal id for the user
  data: {},   // included in body of user-signature request
  params: {}, // included as query params on endpoint url
}
```

When a user triggers `signUserMessage()`, and **FCL** has the above service.

**FCL** will

- Open an iframe at `http://rawr.io`
- Post a message to the iframe
- Wait for a response back that includes a status and relevant info
- Handle response

On receipt of **`FCL:FRAME:READY:RESPONSE`** the wallet should prompt user to approve, sign the message, and send back a response.

## SIGNING THE MESSAGE

If the user authorizes signing via wallet UI, wallet should hash and sign **`body.message`** before returning a PollingResponse with status **"APPROVED"** and a `CompositeSignature` as data.

### UserDomainTag
Before signing, the wallet may be required to add a specified DOMAIN TAG.  A domain tag is encoded as UTF-8 bytes, right padded to a total length of 32 bytes.

The **`UserDomainTag`** is the prefix of all signed user space payloads.


```javascript
const rightPaddedHexBuffer = (value, pad) =>
    Buffer.from(value.padEnd(pad * 2, 0), "hex")

const USER_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FLOW-V0.0-user").toString("hex"),
    32
  ).toString("hex")

const prependUserDomainTag = msg => USER_DOMAIN_TAG + msg

```

**Example signing function**

```javascript
const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

export function sign(privateKey, msgHex) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

```

If the user approves signing, the message sent back should look as follows:

```javascript

const msg = {
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  reason: null,
  data: {
    f_type: "CompositeSignature",
    f_vsn: "1.0.0",
    addr: 0xf8d6e0586b0a20c7,
    keyId: 0,
    signature: "95ee6929dda9548abbf79802be19400fb717b003476eb1f2e080bf15f7d40b1c087e7ff2b42bea8756c6509a5135c5ee6994897367f669279fadb392f4651d48",
  },
}


window.parent.postMessage(msg)
```

If the user declines signing, the message sent back should look as follows:

```javascript

const msg = {
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "DECLINED",
  reason: "User declined to sign...",
  data: null,
}

window.parent.postMessage(msg)
```

Using **FCL**, the application can now verify the signature on the Flow blockchain.

# TL;DR Wallet Provider

- Register Provider with **FCL** Handshake and provide signing service Endpoint
- On receipt of message, prompt user to approve or decline
- Prepare, hash and sign the message
- Return a `PollingResponse` with `CompositeSignature` as data or `null` if declined

