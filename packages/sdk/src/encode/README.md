# Encode

Encoding utilities for [Flow](https://onflow.org) entities. Produces the values that need to be signed for successful transactions.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low

This package is fairly close to its first major version release.
As we propogate some of the terms used in this module to other things they might break, but unless the Flow blockchain needs different things signed nothing should really change here.

# Install

```bash
npm install --save @onflow/sdk
```

# Usage

```javascript
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "@onflow/encode"

const payloadMsg = encodeTransactionPayload({
  cadence: `transaction { execute { log("Hello, World!") } }`,
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  computeLimit: 42,
  proposalKey: {
    address: "01",
    keyId: 7,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
})

const envelopeMsg = encodeTransactionEnvelope({
  cadence: `transaction { execute { log("Hello, World!") } }`,
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  computeLimit: 42,
  proposalKey: {
    address: "01",
    keyId: 7,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
  payloadSigs: [
    {
      address: "01",
      keyId: 7,
      sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    },
  ],
})
```
