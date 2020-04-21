# @onflow/send

Sends [Interactions](../interaction) to [Flow](https://onflow.org) returning a [Response](../response).

Is available as part of [`@onflow/sdk`](../sdk)

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low (If taking into account the known upcoming changes)

Other than taking on the reponsibility of unpacking the JSON-CDC encodedData in the response, this package is nearing its first major release.

Known Upcoming Changes:

- Send will be unpacking the JSON-CDC encodedData

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
