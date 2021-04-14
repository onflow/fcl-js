# @onflow/six-stakingcollection-request-unstaking

Stored Interaction for requesting unstaking for a stake held in a StakingCollection

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-request-unstaking

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as requestUnstaking } from "@onflow/six-stakingcollection-request-unstaking"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    requestUnstaking({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeId: "abc123",            
        delegatorId: null,    
        amount: "123.456"                                
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```