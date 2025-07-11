---
"@onflow/sdk": minor
---

Decoupled SDK functions from the global state and created a `createSdkClient` function which constructs a new SDK client instance bound to a custom context.

This allows for better modularity and helps support multiple SDK clients in the same application.

All SDK functions will continue to work as before, but now you can create a custom SDK client with its own context.