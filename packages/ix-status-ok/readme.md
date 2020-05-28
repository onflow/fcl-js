# @onflow/ix-status-ok

Exports a status constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-status-ok
const {STATUS: OK} = require("@onflow/ix-status-ok")

// ESM
// npm install --save @onflow/ix-status-ok
import {STATUS as OK} from "@onflow/ix-status-ok"

// Typescript
// npm install --save @onflow/ix-status-ok
import {STATUS as OK} from "@onflow/ix-status-ok"

// Browser
<script type="module">
  import {STATUS as OK} from "https://unpkg.com/@onflow/ix-status-ok/status.js"
</script>

// Deno
import {STATUS as OK} from "https://unpkg.com/@onflow/ix-status-ok/status.js"
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
