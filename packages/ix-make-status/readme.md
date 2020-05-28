# @onflow/ix-make-status

Exports a function that makes an interaction a supplied status

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-make-status
const {makeStatus} = require("@onflow/ix-make-status")

// ESM
// npm install --save @onflow/ix-make-status
import {makeStatus} from "@onflow/ix-make-status"

// Typescript
// npm install --save @onflow/ix-make-status
import {makeStatus} from "@onflow/ix-make-status"

// Browser
<script type="module">
  import {makeStatus} from "https://unpkg.com/@onflow/ix-make-status/make-status.js"
</script>

// Deno
import {makeStatus} from "https://unpkg.com/@onflow/ix-make-status/make-status.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isStatus} from "https://unpkg.com/@onflow/ix-is-status/is-status.js"
import {makeStatus} from "https://unpkg.com/@onflow/ix-make-status/make-status"
import {STATUS: BAD} from "https://unpkg.com/@onflow/ix-status-bad/status.js"

Deno.test("Example", () => {
  const ix = makeStatus(interaction(), BAD)
  assert(isStatus(ix, BAD))
})
```
