# @onflow/six-usdc-setup

Stored Interaction for transferring USDC between Flow accounts.

# Status

- **Last Updated:** March 21 2022
- **Stable:** No
- **Risk of Breaking Change:** Very High

Known Upcoming Changes:

- Potential changes to all aspects of Stored Interactions

# Install

npm install @onflow/six-usdc-transfer

# Configuration 

To use this Stored Interaction, you must configure FCL with certain account addresses which contain contracts imported by this Stored Interaction.

| Dependencies           | Mainnet            | Testnet            |
| ---------------------- | ------------------ | ------------------ |
| 0xFUNGIBLETOKENADDRESS | 0xf233dcee88fe0abe | 0x9a0766d93b6608b7 |
| 0xUSDCADDRESS          | 0xb19436aae4d94622 | 0x1ab3c177460e1e4a |

Example (for mainnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0xf233dcee88fe0abe")
  .put("0xUSDCADDRESS", "0xb19436aae4d94622")
```

Example (for testnet):

```javascript
fcl.config()
  .put("0xFUNGIBLETOKENADDRESS", "0x9a0766d93b6608b7")
  .put("0xUSDCADDRESS", "0x1ab3c177460e1e4a")
```

Learn more about configuring FCL here: https://github.com/onflow/flow-js-sdk/blob/master/docs/configure-fcl.mdx

# Usage:

```javascript
import * as fcl from "@onflow/fcl"
import { template as usdcSetup } from "@onflow/six-usdc-transfer"

fcl.config().put("accessNode", "http://localhost:8080");

const response = await fcl.send([
    usdcTransfer({
        proposer: fcl.currentUser().authorization,
        authorization: fcl.currentUser().authorization,     
        payer: fcl.currentUser().authorization,        
        amount: "123.456",                                    // Amount as a String representing a Cadence UFix64
        to: "0xABC123DEF456"                                  // The Address of the Account to transfer FUSD to.     
    })
])

```

# Hashing

Hashing Code:
```javascript
    console.log(crypto.createHash('sha256').update(CODE, 'utf8').digest('hex'))
```