# @onflow/send

Sends [Interactions](../interaction) to [Flow](https://onflow.org) returning a [Response](../response).

Is available as part of [`@onflow/sdk`](../sdk)

# Install

```bash
npm install --save @onflow/send
```

# Usage

```javascript
import {send} from "@onflow/send"

const interaction = ...

const response = await send(interaction, {
  node: "accessNode url"
})
```
