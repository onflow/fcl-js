# @onflow/ix-tag-get-latest-block

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-get-latest-block
const {TAG: GET_LATEST_BLOCK} = require("@onflow/ix-tag-get-latest-block")

// ESM
// npm install --save @onflow/ix-tag-get-latest-block
import {TAG as GET_LATEST_BLOCK} from "@onflow/ix-tag-get-latest-block"

// Typescript
// npm install --save @onflow/ix-tag-get-latest-block
import {TAG as GET_LATEST_BLOCK} from "@onflow/ix-tag-get-latest-block"

// Browser
<script type="module">
  import {TAG as GET_LATEST_BLOCK} from "https://unpkg.com/@onflow/ix-tag-get-latest-block/tag.js"
</script>

// Deno
import {TAG as GET_LATEST_BLOCK} from "https://unpkg.com/@onflow/ix-tag-get-latest-block/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-get-latest-lock/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
