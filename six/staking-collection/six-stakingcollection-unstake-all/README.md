# @onflow/six-stakingcollection-unstake-all

Stored Interaction for unstaking all tokens for a stake held in a StakingCollection

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-unstake-all

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as unstakeAll } from "@onflow/six-stakingcollection-unstake-all"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    unstakeAll({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123",            
        delegatorId: null                             
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```