# @onflow/six-withdraw-rewarded-delegated-flow

Stored Interaction for withdrawing rewarded delegated tokens on Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-withdraw-rewarded-delegated-flow

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as withdrawRewardedDelegatedFlow } from "@onflow/six-withdraw-rewarded-delegated-flow"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    withdrawRewardedDelegatedFlow({
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