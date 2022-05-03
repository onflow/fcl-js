# @onflow/six-add-new-key

Stored Interaction for adding a new key to an Account on Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-add-new-key

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as addNewKey } from "@onflow/six-add-new-key"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    addNewKey({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
        publicKey: "abc123",
        signatureAlgorithm: 1,
        hashAlgorithm: 2,
        weight: "1000"
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```