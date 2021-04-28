# @onflow/six-register-delegator

Stored Interaction for depositing unlocked tokens on Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-register-delegator

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as registerDelegator } from "@onflow/six-register-delegator"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    registerDelegator({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,     
        id: "delegator-id",        
        amount: "123.456",                                    
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```