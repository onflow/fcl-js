# @onflow/six-stakingcollection-setup-staking-collection

Stored Interaction for setting up a Staking Collection for an account.

# Status

- **Last Updated:** April 14 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-setup-staking-collection

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as setupStakingCollection } from "@onflow/six-stakingcollection-setup-staking-collection"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    setupStakingCollection({
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