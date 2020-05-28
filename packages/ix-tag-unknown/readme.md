# @onflow/ix-tag-unknown

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-unknown
const {TAG: UNKNOWN} = require("@onflow/ix-tag-unknown")

// ESM
// npm install --save @onflow/ix-tag-unknown
import {TAG as UNKNOWN} from "@onflow/ix-tag-unknown"

// Typescript
// npm install --save @onflow/ix-tag-unknown
import {TAG as UNKNOWN} from "@onflow/ix-tag-unknown"

// Browser
<script type="module">
  import {TAG as UNKNOWN} from "https://unpkg.com/@onflow/ix-tag-unknown/tag.js"
</script>

// Deno
import {TAG as UNKNOWN} from "https://unpkg.com/@onflow/ix-tag-unknown/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-unknown/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
