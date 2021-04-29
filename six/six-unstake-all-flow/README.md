# @onflow/six-unstake-all-flow

Stored Interaction for Unstaking All Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-unstake-all-flow

# Configuration 

To use this Stored Interaction, you must configure FCL with certain account addresses which contain contracts imported by this Stored Interaction.

| Dependencies          | Mainnet            | Testnet            |
| --------------------- | ------------------ | ------------------ |
| 0xSTAKINGPROXYADDRESS | 0x62430cf28c26d095 | 0x7aad92e5a0715d21 |
| 0xLOCKEDTOKENADDRESS  | 0x8d0e87b65159ae63 | 0x95e019a17d0e23d7 |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xSTAKINGPROXYADDRESS", "0x62430cf28c26d095")
  .put("0xLOCKEDTOKENADDRESS", "0x8d0e87b65159ae63")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xSTAKINGPROXYADDRESS", "0x7aad92e5a0715d21")
  .put("0xLOCKEDTOKENADDRESS", "0x95e019a17d0e23d7")
```

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