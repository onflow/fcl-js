# @onflow/ix-status-bad

Exports a status constant

# Installation

```javascript
// CommonJS
// npm install --save @onflow/ix-status-bad
const {STATUS: BAD} = require("@onflow/ix-status-bad")

// ESM
// npm install --save @onflow/ix-status-bad
import {STATUS as BAD} from "@onflow/ix-status-bad"

// Typescript
// npm install --save @onflow/ix-status-bad
import {STATUS as BAD} from "@onflow/ix-status-bad"

// Browser
<script type="module">
  import {STATUS as BAD} from "https://unpkg.com/@onflow/ix-status-bad/status.js"
</script>

// Deno
import {STATUS as BAD} from "https://unpkg.com/@onflow/ix-status-bad/status.js"
```

# Usage

```javascript
import {assert} from "https://deno.land/std/testing/asserts.ts"
import {interaction} from "https://unpkg.com/@onflow/ix-adt-interaction/interaction.js"
import {isStatus} from "https://unpkg.com/@onflow/ix-is-status/is-status.js"
import {makeStatus} from "https://unpkg.com/@onflow/ix-make-status/make-status"
import {STATUS} from "https://unpkg.com/@onflow/ix-status-bad/status.js"

Deno.test("Example", () => {
  const ix = makeStatus(interaction(), STATUS)
  assert(isStatus(ix, STATUS))
})
```
