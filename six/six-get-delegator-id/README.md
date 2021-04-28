# @onflow/six-get-delegator-id

Stored Interaction for getting a delegators id.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-get-delegator-id

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as getDelegatorID } from "@onflow/six-get-delegator-id"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    getDelegatorID({       
        account: "0x123ABC456DEF",
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```