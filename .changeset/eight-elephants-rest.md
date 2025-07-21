---
"@onflow/react-sdk": minor
---

Decoupled React SDK from the global state and include a `FlowClient` instance within the `FlowProvider` context.

This allows for better modularity and helps support multiple FCL instances in the same application.  Additionally, this is part of a larger effort to move towards a cleaner lifecycle less reliant on asynchronous state management prone to race conditions and frequent bugs.

Moving forward, developers wishing to interact directly with the Flow Client (FCL Instance) should use the `useFlowClient` hook provided by the React SDK instead of relying on globally exported functions from the FCL package.