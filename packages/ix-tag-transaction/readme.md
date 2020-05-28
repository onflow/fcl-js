# @onflow/ix-tag-transaction

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-transaction
const {TAG: TRANSACTION} = require("@onflow/ix-tag-transaction")

// ESM
// npm install --save @onflow/ix-tag-transaction
import {TAG as TRANSACTION} from "@onflow/ix-tag-transaction"

// Typescript
// npm install --save @onflow/ix-tag-transaction
import {TAG as TRANSACTION} from "@onflow/ix-tag-transaction"

// Browser
<script type="module">
  import {TAG as TRANSACTION} from "https://unpkg.com/@onflow/ix-tag-transaction/tag.js"
</script>

// Deno
import {TAG as TRANSACTION} from "https://unpkg.com/@onflow/ix-tag-transaction/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-transaction/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
