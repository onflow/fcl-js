# @onflow/ix-tag-get-account

Exports a tag constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-tag-get-account
const {TAG: GET_ACCOUNT} = require("@onflow/ix-tag-get-account")

// ESM
// npm install --save @onflow/ix-tag-get-account
import {TAG as GET_ACCOUNT} from "@onflow/ix-tag-get-account"

// Typescript
// npm install --save @onflow/ix-tag-get-account
import {TAG as GET_ACCOUNT} from "@onflow/ix-tag-get-account"

// Browser
<script type="module">
  import {TAG as GET_ACCOUNT} from "https://unpkg.com/@onflow/ix-tag-get-account/tag.js"
</script>

// Deno
import {TAG as GET_ACCOUNT} from "https://unpkg.com/@onflow/ix-tag-get-account/tag.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isTag} from "https://unpkg.com/@onflow/ix-is-tag/is-tag.js"
import {makeTag} from "https://unpkg.com/@onflow/ix-make-tag/make-tag"
import {TAG} from "https://unpkg.com/@onflow/ix-tag-get-account/tag.js"

Deno.test("Example", () => {
  const ix = makeTag(interaction(), TAG)
  assert(isTag(ix, TAG))
})
```
