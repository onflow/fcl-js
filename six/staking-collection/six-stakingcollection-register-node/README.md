# @onflow/six-stakingcollection-register-node

Stored Interaction for registering a node held in a StakingCollectioni

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-register-node

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as registerNode } from "@onflow/six-stakingcollection-register-node"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    registerNode({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeID: "1",
        nodeRole: 1,
        networkingAddress: "abc123",
        networkingKey: "abc123",
        stakingKey: "abc123",                                        
        amount: "123.456",                                        
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```