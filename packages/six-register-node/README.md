# @onflow/six-register-node

Stored Interaction for registering a node on Flow

# Status

- **Last Updated:** August 31 2020
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-register-node

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as registerNode } from "@onflow/six-register-node"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    registerNode({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        nodeID: "1",
        address: "0x123ABC456DEF"                                           
        amount: "123.456",                                   
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```