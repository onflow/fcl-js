# Provable Authn

In order to improve UX/DX and encourage seamless integration with App backends and services, `fcl.authenticate` has been upgraded.

Additional data is sent in the body of `FCL:VIEW:READY:RESPONSE` which includes what the wallet needs to build a message for signing with the user’s private key/s.
The signature can be returned as part of an optional service with the Authn `FCL:VIEW:RESPONSE`.

When provided by the wallet, this **signature** and additional **account-proof data** is available to the App via `fcl.currentUser` services. The service data can be used to recreate the message, and verify the signature on the Flow Blockchain.

For example, it can be sent to the App’s backend and after validating the signature and ensuring it has not already been used, it can safely associate the included account address to a user and log them in.

---

## TL;DR Wallet Provider

1. Wallet receives Authn request and parses out the `timestamp`, `message` and `domain tag`
2. The wallet authenticates the user however they choose to do, and figures out the users Account `address`
3. Wallet Prepares and signs the message
      - Combines, and encodes the `timestamp`, `message`, and `address`
      - Prepends the `FLOW-V0.0-user` domain tag + optional custom App domain tag
      - Hashes and signs the message with the signatureAlgorithm specified on user's key
4. Wallet sends back a new service along with the other services when completing Authn

```jsx
// Signing procedure
const message = hash(rlp([timestamp, message, address]))

const prependUserDomainTags = (msg) => FLOW_USER_DOMAIN_TAG CUSTOM_USER_DOMAIN_TAG + msg

sign(privateKey, prependUserDomainTags(message))

// Authentication Proof Service
{
  f_type: "Service",  // Its a service!
  f_vsn: "1.0.0",  // Follows the v1.0.0 spec for the service
  type: "account-proof",  // the type of service it is
  method: "DATA",  // Its data!
  uid: "amazing-wallet#account-proof",  // A unique identifier for the service            
  data: {
    f_type: "account-proof",
    f_vsn: "1.0.0"
    signatures: [CompositeSignture],
    address: "0xUSER",  // The users address
    message: "abc123def456",
    timestamp: 1630705495551, // UNIX timestamp
    domainTag: "AWESOME_DAPP", // Optional, defaults to user signature domain tag `FLOW-V0.0-user`
  }         
}
```
