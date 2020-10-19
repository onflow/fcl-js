# @onflow/six-unstake-delegated-flow

Stored Interaction for unstaking delegated Flow

# Status

- **Last Updated:** August 31 2020
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-unstake-delegated-flow

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as unstakeDelegatedFlow } from "@onflow/six-unstake-delegated-flow"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    unstakeDelegatedFlow({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
        amount: "123.456",                                    // Amount as a String representing a Cadence UFix64
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```