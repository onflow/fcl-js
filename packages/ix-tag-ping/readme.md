# @onflow/ix-tag-ping

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-ping
const {TAG: PING} = require("@onflow/ix-tag-ping")

// ESM
// npm install --save @onflow/ix-tag-ping
import {TAG as PING} from "@onflow/ix-tag-ping"

// Typescript
// npm install --save @onflow/ix-tag-ping
import {TAG as PING} from "@onflow/ix-tag-ping"

// Browser
<script type="module">
  import {TAG as PING} from "https://unpkg.com/@onflow/ix-tag-ping/tag.js"
</script>

// Deno
import {TAG as PING} from "https://unpkg.com/@onflow/ix-tag-ping/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-ping/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
