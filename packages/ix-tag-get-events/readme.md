# @onflow/ix-tag-get-events

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-get-events
const {TAG: GET_EVENTS} = require("@onflow/ix-tag-get-events")

// ESM
// npm install --save @onflow/ix-tag-get-events
import {TAG as GET_EVENTS} from "@onflow/ix-tag-get-events"

// Typescript
// npm install --save @onflow/ix-tag-get-events
import {TAG as GET_EVENTS} from "@onflow/ix-tag-get-events"

// Browser
<script type="module">
  import {TAG as GET_EVENTS} from "https://unpkg.com/@onflow/ix-tag-get-events/tag.js"
</script>

// Deno
import {TAG as GET_EVENTS} from "https://unpkg.com/@onflow/ix-tag-get-events/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-get-events/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
