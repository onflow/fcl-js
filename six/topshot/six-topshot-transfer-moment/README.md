# @onflow/six-topshot-setup-collection

Stored Interaction for setting up an account with an NBA TopShot collection.

# Status

- **Last Updated:** Sept 22 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-topshot-setup-collection

# Configuration 

To use this Stored Interaction, you must configure FCL with certain account addresses which contain contracts imported by this Stored Interaction.

| Dependencies          | Mainnet            | Testnet            |
| --------------------- | ------------------ | ------------------ |
| 0xTOPSHOT             | 0x0b2a3299cc857e29 | 0x877931736ee77cff |
| 0xNONFUNGIBLETOKEN    | 0x1d7e57aa55817448 | 0x631e88ae7f1d7c20 |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xTOPSHOT", "0x0b2a3299cc857e29")
  .put("0xNONFUNGIBLETOKEN", "0x1d7e57aa55817448")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xTOPSHOT", "0x877931736ee77cff")
  .put("0xNONFUNGIBLETOKEN", "0x631e88ae7f1d7c20")
```

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as topshotTransferMoment } from "@onflow/six-topshot-transfer-moment"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    topshotTransferMoment({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,
        recipient: "0xABC123DEF456",  // Address of the account to transfer the moment to
        withdrawID: "123"             // ID of the moment to transfer
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```