# @onflow/ix-adt-account

An `Account` is an [ADT](https://en.wikipedia.org/wiki/Abstract_data_type) that represents an account in the context of a transaction.

# Contents

- [Installation](#installation)
- [Usage](#usage)
- [Structure](#structure)

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-adt-account
const {account} = require("@onflow/ix-adt-account")

// ESM
// npm install --save @onflow/ix-adt-account
import {account} from "@onflow/ix-adt-account"

// Typescript
// npm install --save @onflow/ix-adt-account
import {account} from "@onflow/ix-adt-account"

// Browser
<script type="module">
  import {account} from "https://unpkg.com/@onflow/ix-adt-account/account.js"
</script>

// Deno
import {account} from "https://unpkg.com/@onflow/ix-adt-account/account.js"
```

# Usage

### `account()`

Returns an empty `Account` object.

```javascript
import {account} from "https://unpkg.com/@onflow/ix-adt-account/account.js"
const emptyAccount = account()
```

# Structure

- **kind** `String` -- `ACCOUNT` A multi-source instance safe flag used to signify this object is an `Account`
- **tempId** `String` -- A generated id that can be used as a lookup during other resoloving steps.
- **roles** `Object` -- What roles this account is being asked to perform.
  - **proposer** `Boolean` -- The sequence number for the provided key of this account will be used.
  - **authorizer** `Boolean` -- This account is authorizing a permanent change to its storage and resources.
  - **payer** `Boolean` -- This account will be charged the transaction fee.
  - **param** `Boolean` -- This accounts address will be used as a param in the interactions cadance code.
- **addr** `String:Hex` -- The flow address for this `Account`.
- **keyId** `Integer` -- The key on the flow account to use while signing.
- **sequenceNum** `Integer` -- When account is the proposer, this is the sequence number for the key. Conceptually performs the same function as a nonce.
- **signature** `String:Hex` -- The signature proving this accounts approval of its role in the interaction.
- **signingFunction** `Function` -- Is passed data representing the interaction and what to sign, it then returns a composite signature.
- **resolve** `Function` -- Is passed the current knowledge of the account, it can then return a new account with missing information filled in.
