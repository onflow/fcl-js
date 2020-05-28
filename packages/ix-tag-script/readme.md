# @onflow/ix-tag-script

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-script
const {TAG: SCRIPT} = require("@onflow/ix-tag-script")

// ESM
// npm install --save @onflow/ix-tag-script
import {TAG as SCRIPT} from "@onflow/ix-tag-script"

// Typescript
// npm install --save @onflow/ix-tag-script
import {TAG as SCRIPT} from "@onflow/ix-tag-script"

// Browser
<script type="module">
  import {TAG as SCRIPT} from "https://unpkg.com/@onflow/ix-tag-script/tag.js"
</script>

// Deno
import {TAG as SCRIPT} from "https://unpkg.com/@onflow/ix-tag-script/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-script/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
