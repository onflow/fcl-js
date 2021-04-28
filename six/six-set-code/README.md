# @onflow/six-set-code

Stored Interaction for setting an Accounts Code on Flow

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-set-code

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as setCode } from "@onflow/six-set-code"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    setCode({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
        code: "my-cadence-code",                            // Cadence code as a utf8 encoded string.
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```