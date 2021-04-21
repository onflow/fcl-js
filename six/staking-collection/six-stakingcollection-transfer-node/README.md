# @onflow/six-stakingcollection-transfer-node

Stored Interaction for transferring a node from one Staking Collection to another.

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-transfer-node

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as transferNode } from "@onflow/six-stakingcollection-transfer-node"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    transferNode({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123",            
        to: "0xABC123"                             
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```