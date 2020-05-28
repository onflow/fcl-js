# @onflow/ix-is-tag

Exports a function that checks if an interaction has the supplied tag

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-is-tag
const {isTag} = require("@onflow/ix-is-tag")

// ESM
// npm install --save @onflow/ix-is-tag
import {isTag} from "@onflow/ix-is-tag"

// Typescript
// npm install --save @onflow/ix-is-tag
import {isTag} from "@onflow/ix-is-tag"

// Browser
<script type="module">
  import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
</script>

// Deno
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG: TRANSACTION} from "https://unpkg.com/@onflow/ix-tag-transaction/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TRANSACTION)
  assert(isTag(ix, TRANSACTION))
})
```
