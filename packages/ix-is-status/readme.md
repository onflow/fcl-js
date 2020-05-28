# @onflow/ix-is-status

Exports a function that checks if an interaction has the supplied status

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-is-status
const {isStatus} = require("@onflow/ix-is-status")

// ESM
// npm install --save @onflow/ix-is-status
import {isStatus} from "@onflow/ix-is-status"

// Typescript
// npm install --save @onflow/ix-is-status
import {isStatus} from "@onflow/ix-is-status"

// Browser
<script type="module">
  import {isStatus} from "https://unpkg.com/@onflow/ix-is-status/is-status.js"
</script>

// Deno
import {isStatus} from "https://unpkg.com/@onflow/ix-is-status/is-status.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isStatus} from "https://unpkg.com/@onflow/ix-is-status/is-status.js"
import {makeStatus} from "https://unpkg.com/@onflow/ix-make-status/make-status"
import {STATUS} from "https://unpkg.com/@onflow/ix-status-ok/status.js"

Deno.test("Example", () => {
  const ix = makeStatus(interaction(), STATUS)
  assert(isStatus(ix, STATUS))
})
```
