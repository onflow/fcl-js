# @onflow/six

Stored interactions encapsulating common use cases of flow

# Status

- **Last Updated:** June 8th 2020
- **Stable:** No
- **Risk of Breaking Change:** High

Known Upcoming Changes:
- None at the moment.

# Install

```bash
npm install --save @onflow/six
```

# Usage

```javascript
import * as six from "@onflow/six"

var response = await fcl.send([
  six.sendFlowToken({
    to: "asdfefssfes",
    amount: 74536,
  }),
  fcl.proposer(fcl.currentUser().authorization),
  fcl.authorizations([
    fcl.currentUser().authorization
  ]),
  fcl.payer(fcl.currentUser().authorization)
])
```