# @onflow/six-fusd-transfer

Stored Interaction for transferring FUSD between Flow accounts.

# Status

- **Last Updated:** May 31 2021
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-fusd-setup

# Configuration 

To use this Stored Interaction, you must configure FCL with certain account addresses which contain contracts imported by this Stored Interaction.

| Dependencies           | Mainnet            | Testnet            |
| ---------------------- | ------------------ | ------------------ |
| 0xFUNGIBLETOKENADDRESS | 0xf233dcee88fe0abe | 0x9a0766d93b6608b7 |
| 0xFUSDADDRESS          | 0x3c5959b568896393 | 0xe223d8a629e49c68 |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0xf233dcee88fe0abe")
  .put("0xFUSDADDRESS", "0x3c5959b568896393")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0x9a0766d93b6608b7")
  .put("0xFUSDADDRESS", "0xe223d8a629e49c68")
```

Learn more about configuring FCL here: https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as fusdTransfer } from "@onflow/six-fusd-transfer"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    fusdTransfer({
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