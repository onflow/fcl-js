# @onflow/ix-make-tag

Exports a function that makes an interaction a supplied tag

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-make-tag
const {makeTag} = require("@onflow/ix-make-tag")

// ESM
// npm install --save @onflow/ix-make-tag
import {makeTag} from "@onflow/ix-make-tag"

// Typescript
// npm install --save @onflow/ix-make-tag
import {makeTag} from "@onflow/ix-make-tag"

// Browser
<script type="module">
  import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag.js"
</script>

// Deno
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag.js"
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
