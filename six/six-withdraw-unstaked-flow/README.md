# @onflow/six-withdraw-unstaked-flow

Stored Interaction for withdrawing unstaked tokens on Flow.

# Status

- **Last Updated:** April 28 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-withdraw-unstaked-flow

# Configuration 

To use this Stored Interaction, you must configure FCL with certain contract addresses.

| Dependencies          | Mainnet            | Testnet            |
| --------------------- | ------------------ | ------------------ |
| 0xLOCKEDTOKENADDRESS  | 0x8d0e87b65159ae63 | 0x95e019a17d0e23d7 |
| 0xSTAKINGPROXYADDRESS | 0x62430cf28c26d095 | 0x7aad92e5a0715d21 |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xLOCKEDTOKENADDRESS", "0x8d0e87b65159ae63")
  .put("0xSTAKINGPROXYADDRESS", "0x62430cf28c26d095")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xLOCKEDTOKENADDRESS", "0x95e019a17d0e23d7")
  .put("0xSTAKINGPROXYADDRESS", "0x7aad92e5a0715d21")
```

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as withdrawUnstakedFlow } from "@onflow/six-withdraw-unstaked-flow"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    withdrawUnstakedFlow({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,             
        amount: "123.456",                                    // Amount as a String representing a Cadence UFix64
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```