# @onflow/react-core

**Internal private package** - Platform-agnostic React hooks and utilities for Flow blockchain.

This package provides shared functionality for:

- `@onflow/react-sdk` (Web)
- `@onflow/react-native-sdk` (React Native)

## Not Published

This package is **private** and used only within the monorepo. It is never published to npm.

## Contents

- **Hooks**: All Flow blockchain React hooks (useFlowClient, useFlowMutate, etc.)
- **Core**: Contexts, types, and interfaces
- **Utils**: Helper functions (deepEqual, flowscan)
- **Constants**: Contract addresses and configuration

## Usage

Do not import directly from this package. Import from the platform SDK:

```typescript
// Web
import {useFlowClient} from "@onflow/react-sdk"

// React Native
import {useFlowClient} from "@onflow/react-native-sdk"
```
