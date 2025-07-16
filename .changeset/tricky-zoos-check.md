---
"@onflow/fcl-core": minor
---

Decoupled FCL Core functions from the global state and created a `createFclCore` function which constructs a new SDK client instance bound to a custom context.

This allows for better modularity and helps support multiple FCL instances in the same application.

All FCL functions will continue to work as before, but now you can create a custom FCL instance with its own context.