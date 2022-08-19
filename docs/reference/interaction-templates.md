# Interaction Templates

> Interaction Templates are a concept established in FLIP-934. Read the FLIP [here](https://github.com/onflow/flips/blob/main/flips/20220503-interaction-templates.md)

> "Interaction" in this context refers to the higher order term establised in FLIP-934 that encompases a transaction and script, things that _interact_ with the blockchain.

## Overview

Interaction Templates establish a format for metadata that exists about an interaction. Interaction Templates can include:

- Human readable, internationalized messages about the interaction
- The Cadence code to carry out the interaction
- Information about arguments such as internationalized human readable messages and what the arguments act upon
- Contract dependencies the Interaction engages with, pinned to a version of them and their dependency tree

Applications and Wallets can use Interaction Templates and it's interaction metadata. 

For example Applications and Wallets can extract the internationalized human readable messaging from an Interaction Template to display to their users prior to execution of the interaction.

## For Applications

FCL `mutate` and `query` can accept an Interaction Template. FCL `mutate` and `query` will use the Interaction Template to:

- Extract the Cadence code to carry out the interaction
- Extract dependency configuration for the interaction (eg: Information about contract import addresses)

Here is an example of using `mutate` with an Interaction Template:
```javascript
import * as fcl from "@onflow/fcl"
import myTransactionTemplate from "./my-transaction-template.template.json"

const txId = await fcl.mutate({
  template: myTransactionTemplate
})
```

An Interaction Template can also be used with `query`:
```javascript
import * as fcl from "@onflow/fcl"
import myScriptTemplate from "./my-script-template.template.json"

const info = await fcl.query({
  template: myScriptTemplate
})
```

Interaction Templates can be resolved from remote locations:

```javascript
import * as fcl from "@onflow/fcl"

const txId = await fcl.mutate({
  template: "http://interactions.awesome-crypto-project.com/buy-nft"
})

const nftInfo = await fcl.query({
  template: "http://interactions.awesome-crypto-project.com/read-nft",
  args: (arg, t) => [arg("nft-id", t.String)]
})
```

FCL will resolve the template from the remote location before using it to execute its underlying transaction or script.

> 💡 By requesting an Interaction Template from an external location, applications have a mechanism to always retrieve the most up to date way of accomplishing an interaction.

By default FCL supports resolving Interaction Templates over http/https, but FCL can also be configured with various other ways to resolve Interaction Templates:

```javascript
import * as fcl from "@onflow/fcl"

await fcl.config().put("document.resolver.ipfs", async ({ url }) => {
  const jsonTemplate = getDocumentFromIPFS(url) // resolve interaction template from ipfs
  return jsonTemplate
})

const txId = await fcl.mutate({
  template: "ipfs://IPFSHASHGOESHERE"
})
```

## For Wallets

Wallets can use Interaction Templates to:
- Display internationalized human readable information about a transaction to their users during signing
- Verify the dependencies of an Interaction Template have not changed since when the Interaction Template was created
- Using Interaction Template Audits, gain confidence in the correctness and safety of an Interaction Template and it's underlying transaction

When recieving a transaction to sign, wallets can query for an Interaction Template that corresponds to it.

Flow operates an "Interaction Template Discovery Service" which wallets can use to query for Interaction Templates. Anyone can run an "Interaction Template Discovery Service" and wallets can choose to query from any of them.

```javascript
const cadence = cadenceFromTransactionToSign
const network = "mainnet" // "mainnet" | "testnet"

const cadenceBase64 = btoa(cadence)

const interactionTemplate = await fetch(
  `https://flow-ix-template-svc.herokuapp.com/v1/templates?network=${network}&cadence=${cadenceBase64}`
)
```

> 📖  For more on the "Interaction Template Discovery Service" that Flow operates, see [here](https://github.com/onflow/flow-interaction-template-service)

> ❗️ Not all transactions will have a corresponding Interaction Template. Wallets are encouraged to always support signing transactions that do not have a corresponding Interaction Template, or if they fail to discover one.

Once a wallet has a corresponding Interaction Template for a given transaction, they may also may wish to verify that the transaction it represents is safe to sign, and that the Interaction Template is accurate for that transaction.

To do so, wallets can rely on themselves, along with external Interaction Template Auditors to gain confidence in the Interaction Template and it's underlying transaction. Interaction Template Auditors are entities that audit Interaction Templates for correctness and safety.

> 💡 Anyone can be an Interaction Template Auditor. Wallets can choose auditors they trust, if any.

Wallets can specify auditors it trusts to FCL by configuring FCL with the address of each auditor:

```javascript
import * as fcl from "@onflow/fcl"

await fcl.config().put("flow.network", "mainnet")

const auditorA_FlowAddress = "0xABC123DEF456"
const auditorB_FlowAddress = "0xFFAA1212DEFF"

await fcl.config().put("fcl.auditors", [
  auditorA_FlowAddress,
  auditorB_FlowAddress
])
```

Wallets can check if the auditors they configured FCL with have audited a given Interaction Template:

```javascript
import * as fcl from "@onflow/fcl"
import myTransactionTemplate from "./my-transaction-template.template.json"

const audits = await fcl.InteractionTemplateUtils
  .getInteractionTemplateAudits({
    template: myTransactionTemplate
  })

/**
 * audits = {
 *   "0xABC123DEF456": true,
 *   "0xFFAA1212DEFF": false
 * }
 ** /
```

Since not all auditors that a wallet trusts may have audited a given Interaction Template, trusting multiple auditors can increase the chance that at least one of the trusted auditors has audited the Interaction Template.

> ❗️ Auditors can revoke audits at any time, so be sure to always check an Interaction Template's audit status. 

Since contracts on Flow are mutable, wallets may additionally wish to verify that none of the dependency tree for the transaction an Interaction Template represents has changed since when it was created and of what it was audited against.

```javascript
import * as fcl from "@onflow/fcl"
import myTransactionTemplate from "./my-transaction-template.template.json"

const hasDependencyTreeChanged = await fcl.InteractionTemplateUtils
  .verifyDependencyPinsSameAtLatestSealedBlock({
    template: myTransactionTemplate
  })
```

If the dependency tree has changed, wallets may choose to disregard the Interaction Template (and it's audits).

Once the Interaction Template has been sufficiently audited by auditors the wallet trusts, and it's dependency tree determined unchanged since the interaction was created and audited against, then the wallet can use the Interaction Template with greater confidence in it's correctness and safety.

The wallet may then decide to render human readable information about the transaction such as:
- Internationalized 'title' and 'description' of the transaction
- Internationalized 'title' for each of the transactions arguments alongside the arguments value

The wallet may then also make the status of it's audits known to the user in their UI. This allows the user to have greater confidence in the safety of the transaction. 

## Data Structure

The following is an example Interaction Template that corresponds to a "Transfer FLOW" transaction:

```json
{
  "f_type": "InteractionTemplate",
  "f_version": "1.0.0",
  "id": "290b6b6222b2a77b16db896a80ddf29ebd1fa3038c9e6625a933fa213fce51fa",
  "data": {
    "type": "transaction",
    "interface": "",
    "messages": {
      "title": {
        "i18n": {
          "en-US": "Transfer Tokens"
        }
      },
      "description": {
        "i18n": {
          "en-US": "Transfer tokens from one account to another"
        }
      }
    },
    "cadence": "import FungibleToken from 0xFUNGIBLETOKENADDRESS\ntransaction(amount: UFix64, to: Address) {\nlet vault: @FungibleToken.Vault\nprepare(signer: AuthAccount) {\nself.vault <- signer\n.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n.withdraw(amount: amount)\n}\nexecute {\ngetAccount(to)\n.getCapability(/public/flowTokenReceiver)!\n.borrow<&{FungibleToken.Receiver}>()!\n.deposit(from: <-self.vault)\n}\n}",
    "dependencies": {
      "0xFUNGIBLETOKENADDRESS": {
        "FungibleToken": {
          "mainnet": {
            "address": "0xf233dcee88fe0abe",
            "fq_address": "A.0xf233dcee88fe0abe.FungibleToken",
            "contract": "FungibleToken",
            "pin": "83c9e3d61d3b5ebf24356a9f17b5b57b12d6d56547abc73e05f820a0ae7d9cf5",
            "pin_block_height": 34166296
          },
          "testnet": {
            "address": "0x9a0766d93b6608b7",
            "fq_address": "A.0x9a0766d93b6608b7.FungibleToken",
            "contract": "FungibleToken",
            "pin": "83c9e3d61d3b5ebf24356a9f17b5b57b12d6d56547abc73e05f820a0ae7d9cf5",
            "pin_block_height": 74776482
          }
        }
      }
    },
    "arguments": {
      "amount": {
        "index": 0,
        "type": "UFix64",
        "messages": {
          "title": {
            "i18n": {
              "en-US": "The amount of FLOW tokens to send"
            }
          }
        }
      },
      "to": {
        "index": 1,
        "type": "Address",
        "messages": {
          "title": {
            "i18n": {
              "en-US": "The Flow account the tokens will go to"
            }
          }
        }
      }
    }
  }
}
```
