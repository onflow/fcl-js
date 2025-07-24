# Plugin System Decoupling - Implementation Summary

## Overview

The FCL plugin system has been successfully decoupled from global state while maintaining full backward compatibility. The system now supports both global (legacy) and context-aware (new) usage patterns.

## Changes Made

### 1. Core Plugin Functions Refactored

**File: `packages/fcl-core/src/current-user/exec-service/plugins.ts`**

- `ServiceRegistry` → `createServiceRegistry`: Now creates isolated service registries
- `PluginRegistry` → `createPluginRegistry`: Now creates isolated plugin registries  
- Added `createRegistries()`: Factory function for context-aware registry pairs
- Maintained global registries for backward compatibility

### 2. Context Integration

**File: `packages/fcl-core/src/context/index.ts`**

- Added `serviceRegistry` and `pluginRegistry` to `FCLContext` interface
- Updated `createFCLContext()` to create context-specific registries
- Added optional `coreStrategies` parameter to configuration

**File: `packages/fcl-core/src/client.ts`**

- Added `coreStrategies` to `FlowClientCoreConfig` interface
- Exposed `serviceRegistry` and `pluginRegistry` on the client instance

### 3. Execution Service Updates

**File: `packages/fcl-core/src/current-user/exec-service/index.ts`**

- Added optional `serviceRegistry` parameter to `execService()` and `execStrategy()`
- Functions fall back to global registry when context registry not provided

### 4. Current User Integration

**File: `packages/fcl-core/src/current-user/index.ts`**

- Updated all `execService()` calls to pass context-aware `serviceRegistry`
- Added `serviceRegistry` parameter to current user context interfaces

## Usage Patterns

### 1. Global Registry (Backward Compatible)

```javascript
import { pluginRegistry } from '@onflow/fcl-core'

// This still works exactly as before
pluginRegistry.add({
  name: "MyWalletPlugin",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: [...],
  serviceStrategy: { method: "CUSTOM/RPC", exec: customExecFunction }
})
```

### 2. Context-Aware Registries (New)

```javascript
import { createFlowClientCore } from '@onflow/fcl-core'

// Create client with custom core strategies
const fcl = createFlowClientCore({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  platform: "web",
  storage: myStorage,
  computeLimit: 1000,
  coreStrategies: {
    "HTTP/POST": httpPostStrategy,
    "IFRAME/RPC": iframeRpcStrategy,
    "CUSTOM/RPC": myCustomStrategy
  }
})

// Add plugins to this specific instance
fcl.pluginRegistry.add({
  name: "InstanceSpecificPlugin",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: [...],
  serviceStrategy: { method: "INSTANCE/RPC", exec: instanceExecFunction }
})

// This plugin only affects this FCL instance, not others
```

### 3. Multiple Isolated Instances

```javascript
import { createFlowClientCore } from '@onflow/fcl-core'

// Testnet instance with its own plugins
const testnetFcl = createFlowClientCore({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  platform: "web",
  storage: testnetStorage,
  computeLimit: 1000,
  coreStrategies: testnetStrategies
})

// Mainnet instance with different plugins
const mainnetFcl = createFlowClientCore({
  accessNodeUrl: "https://rest-mainnet.onflow.org", 
  platform: "web",
  storage: mainnetStorage,
  computeLimit: 1000,
  coreStrategies: mainnetStrategies
})

// Add different plugins to each instance
testnetFcl.pluginRegistry.add(testnetSpecificPlugin)
mainnetFcl.pluginRegistry.add(mainnetSpecificPlugin)

// Each instance operates independently
```

### 4. Direct Registry Creation

```javascript
import { createRegistries } from '@onflow/fcl-core'

// Create registries directly for advanced use cases
const { serviceRegistry, pluginRegistry } = createRegistries({
  coreStrategies: {
    "HTTP/POST": myHttpStrategy,
    "WEBSOCKET/RPC": myWebSocketStrategy
  }
})

// Use the isolated registries
pluginRegistry.add(myPlugin)
const services = serviceRegistry.getServices()
```

## Benefits Achieved

1. **Zero Breaking Changes**: All existing code continues to work
2. **Instance Isolation**: Multiple FCL instances can have different plugin configurations
3. **Better Testing**: Each test can use isolated registries
4. **Reduced Global State**: Context-aware usage avoids global pollution
5. **Enhanced Flexibility**: Advanced users can create custom registry configurations

## Backward Compatibility

- Global `pluginRegistry` and `getServiceRegistry()` functions remain unchanged
- All existing plugin code will continue to work without modifications
- Legacy patterns are maintained while new patterns are available

## Migration Path

Developers can gradually migrate from global to context-aware patterns:

1. **Immediate**: Continue using global registries (no changes needed)
2. **Phase 1**: Start using `createFlowClientCore()` with instance-specific plugins
3. **Phase 2**: Gradually move plugin registrations to context-aware patterns
4. **Long-term**: Consider deprecating global registry usage in favor of context-aware patterns

This implementation provides the foundation for advanced FCL usage while maintaining the simplicity that makes FCL accessible to all developers.
