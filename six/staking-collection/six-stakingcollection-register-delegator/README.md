# @onflow/six-stakingcollection-register-delegator

Stored Interaction for registering a delegator held in a StakingCollectioni

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-register-delegator

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as registerDelegator } from "@onflow/six-stakingcollection-register-delegator"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    registerDelegator({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123"             
        amount: "100.0",                                    
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```