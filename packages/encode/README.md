# @onflow/encode

Encoding utilities for [Flow](https://onflow.org) entities.

# Install

```bash
npm install --save @onflow/encode
```

# Usage

```javascript
import {
  encodeTransactionPayload,
  encodeTransactionEnvelope,
} from "@onflow/encode"

const payloadMsg = encodeTransactionPayload({
  script: `transaction { execute { log("Hello, World!") } }`,
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  gasLimit: 42,
  proposalKey: {
    address: "01",
    key: 7,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
})

const envelopeMsg = encodeTransactionEnvelope({
  script: `transaction { execute { log("Hello, World!") } }`,
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  gasLimit: 42,
  proposalKey: {
    address: "01",
    key: 7,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
  payloadSigs: [{
    address: "01",
    key: 7,
    sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
  }],
})
```
