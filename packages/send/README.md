# @onflow/send

Sends [Interactions](../interaction) to [Flow](https://onflow.org) returning a [Response](../response).

Is available as part of [`@onflow/sdk`](../sdk)

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low (If taking into account the known upcoming changes)

# Install

```bash
npm install --save @onflow/send
```

# Usage

```javascript
import {send} from "@onflow/send"

const interaction = ...

const response = await send(interaction, {
  node: "Access Node Url"
})
```
