# @onflow/six-stakingcollection-setup-staking-collection

Stored Interaction for setting up a Staking Collection for an account.

# Status

- **Last Updated:** June 21 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-stakingcollection-setup-staking-collection

# Configuration 

To use this Stored Interaction, you must configure FCL with certain account addresses which contain contracts imported by this Stored Interaction.

| Dependencies                | Mainnet            | Testnet            |
| --------------------------- | ------------------ | ------------------ |
| 0xFUNGIBLETOKENADDRESS      | 0xf233dcee88fe0abe | 0x9a0766d93b6608b7 |
| 0xFLOWTOKENADDRESS          | 0x1654653399040a61 | 0x7e60df042a9c0868 |
| 0xIDENTITYTABLEADDRESS      | 0x8624b52f9ddcd04a | 0x9eca2b38b18b5dfe |
| 0xLOCKEDTOKENADDRESS        | 0x8d0e87b65159ae63 | 0x95e019a17d0e23d7 |
| 0xSTAKINGCOLLECTIONADDRESS  | 0x8d0e87b65159ae63 | 0x95e019a17d0e23d7 |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0xf233dcee88fe0abe")
  .put("0xFLOWTOKENADDRESS", "0x1654653399040a61")
  .put("0xIDENTITYTABLEADDRESS", "0x8624b52f9ddcd04a")
  .put("0xLOCKEDTOKENADDRESS", "0x8d0e87b65159ae63")
  .put("0xSTAKINGCOLLECTIONADDRESS", "0x8d0e87b65159ae63")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0x9a0766d93b6608b7")
  .put("0xFLOWTOKENADDRESS", "0x7e60df042a9c0868")
  .put("0xIDENTITYTABLEADDRESS", "0x9eca2b38b18b5dfe")
  .put("0xLOCKEDTOKENADDRESS", "0x95e019a17d0e23d7")
  .put("0xSTAKINGCOLLECTIONADDRESS", "0x95e019a17d0e23d7")
```

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