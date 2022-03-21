# Provable Authn

In order to improve UX/DX and encourage seamless integration with App backends and services, `fcl.authenticate` has been upgraded.

Additional data is sent in the body of `FCL:VIEW:READY:RESPONSE`. This data includes what the wallet needs to build a message for signing with the user’s private key/s.
The signature can be returned as part of an optional `account-proof` service with the `FCL:VIEW:RESPONSE`.

When provided by the wallet, this **signature** and additional **account-proof data** is available to the App via `fcl.currentUser` services. The service data can be used to recreate the message, and verify the signature on the Flow Blockchain.

For example, it can be sent to the App’s backend and after validating the signature and the other account-proof data, it can safely associate the included account address to a user and log them in.

---

## TL;DR Wallet Provider

1. Wallet receives Authn `FCL:VIEW:READY:RESPONSE` request and parses out the `appIdentifier`, and `nonce`.
2. The wallet authenticates the user however they choose to do, and determines the user's account `address`
3. Wallet prepares and signs the message:
      - Encodes the `appIdentifier`, `nonce`, and `address` along with the `FLOW-V0.0-user` domain separation tag, [using the encoding scheme described below](#account-proof-message-encoding).
      - Signs the message with the `signatureAlgorithm` and `hashAlgorithm` specified on user's key. **It is highly recommended that the wallet display the message data and receive user approval before signing.**
4. Wallet sends back this new service and data along with the other service configuration when completing Authn.

### Account Proof Message Encoding

The account proof message is encoded as follows:

```text
MESSAGE = 
  USER_DOMAIN_TAG ||
  RLP_ENCODE([
    APP_IDENTIFIER, 
    ADDRESS, 
    NONCE
  ])
```

with the following values:

- `USER_DOMAIN_TAG` is the constant `"FLOW-V0.0-user"`, encoded as UTF-8 byte array and right-padded with zero bytes to a length of 32 bytes.
- `APP_IDENTIFIER` is an arbitrary length string.
- `ADDRESS` is a byte array containing the address bytes, left-padded with zero bytes to a length of 8 bytes.
- `NONCE` is an byte array with a minimum length of 32 bytes.

`RLP_ENCODE` is a function that performs [RLP encoding](https://eth.wiki/fundamentals/rlp) and returns the encoded value as bytes.

### JavaScript Example

```jsx
// Signing procedure

// Using WalletUtils
import {WalletUtils, withPrefix} from "@onflow/fcl"
const message = WalletUtils.encodeMessageForProvableAuthnSigning(
      appIdentifier, 
      address, // Flow address of the user authenticating
      nonce, // minimum 32-btye nonce
)
sign(privateKey, message)

// Without using FCL WalletUtils
import {withPrefix} from "@onflow/fcl"
const message =  rlp([appIdentifier, address, nonce])
const prependUserDomainTag = (message) => USER_DOMAIN_TAG + message
sign(privateKey, prependUserDomainTag(message))

// Authentication Proof Service
{
  f_type: "Service",  // Its a service!
  f_vsn: "1.0.0",  // Follows the v1.0.0 spec for the service
  type: "account-proof",  // the type of service it is
  method: "DATA",  // Its data!
  uid: "awesome-wallet#account-proof",  // A unique identifier for the service            
  data: {
    f_type: "account-proof",
    f_vsn: "1.0.0"

    // The user's address (8 bytes, i.e 16 hex characters)
    address: "0xf8d6e0586b0a20c7",                 

    // Nonce signed by the current account-proof (minimum 32 bytes in total, i.e 64 hex characters)
    nonce: "75f8587e5bd5f9dcc9909d0dae1f0ac5814458b2ae129620502cb936fde7120a",

    signatures: [CompositeSignature],
  }
```
