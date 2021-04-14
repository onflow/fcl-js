# @onflow/six-stakingcollection-close-stake

Stored Interaction for closing a stake held in a StakingCollectioni

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-close-stake

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as closeStake } from "@onflow/six-stakingcollection-close-stake"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    closeStake({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123"             
        delegatorId: null,                                    
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```