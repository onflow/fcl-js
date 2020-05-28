# @onflow/ix-tag-get-transaction-status

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-get-transaction-status
const {TAG: GET_TRANSACTION_STATUS} = require("@onflow/ix-tag-get-transaction-status")

// ESM
// npm install --save @onflow/ix-tag-get-transaction-status
import {TAG as GET_TRANSACTION_STATUS} from "@onflow/ix-tag-get-transaction-status"

// Typescript
// npm install --save @onflow/ix-tag-get-transaction-status
import {TAG as GET_TRANSACTION_STATUS} from "@onflow/ix-tag-get-transaction-status"

// Browser
<script type="module">
  import {TAG as GET_TRANSACTION_STATUS} from "https://unpkg.com/@onflow/ix-tag-get-transaction-status/tag.js"
</script>

// Deno
import {TAG as GET_TRANSACTION_STATUS} from "https://unpkg.com/@onflow/ix-tag-get-transaction-status/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-get-transaction-status/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
