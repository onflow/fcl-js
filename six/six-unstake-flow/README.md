# @onflow/six-unstake-flow

Stored Interaction for Unstaking Flow.

# Status

- **Last Updated:** August 31 2020
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-unstake-flow

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as unstakeFlow } from "@onflow/six-unstake-flow"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    unstakeFlow({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```