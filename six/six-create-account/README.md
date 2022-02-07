# @onflow/six-create-account

Stored Interaction for creating an Account on Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-create-account

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as createAccount } from "@onflow/six-create-account"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    createAccount({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
        publicKey: "abc123",
        signatureAlgorithm: 1,
        hashAlgorithm: 2,
        weight: "1000.0"
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```