# @onflow/six-stakingcollection-transfer-delegator

Stored Interaction for transfering a delegator from one StakingCollection to another.

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-transfer-delegator

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as transferDelegator } from "@onflow/six-stakingcollection-transfer-delegator"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    transferDelegator({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123",
        delegatorId: "456def",            
        to: "0xABC123"                             
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```