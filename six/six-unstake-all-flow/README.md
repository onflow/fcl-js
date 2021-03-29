# @onflow/six-unstake-all-flow

Stored Interaction for Unstaking All Flow.

# Status

- **Last Updated:** December 18 2020
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-unstake-all-flow

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as unstakeAllFlow } from "@onflow/six-unstake-all-flow"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    unstakeAllFlow({
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