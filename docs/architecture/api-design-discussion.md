# FCL API Design Discussion: Instance vs Context-Passing

**Date:** July 24, 2025  
**Context:** Migration away from global state, evaluating instance-based vs context-passing patterns

## Background

FCL was migrated from global state to an instance-based approach:

```javascript
// Old global approach
mutate(transaction)

// New instance approach  
const fcl = createFCL(config)
fcl.mutate(transaction)
```

The global functions still exist for backward compatibility, but now there are also context-bound functions in the instance.

## Question: Was this the right move vs tree-shakable context-passing?

## Option 1: Instance-Based Approach (Current)

```javascript
import { createFCL } from 'fcl-js'
const fcl = createFCL(config)
fcl.mutate(params)
fcl.query(script)
fcl.authenticate()
```

**Benefits:**
- ✅ Better developer experience (DX)
- ✅ Cleaner, more intuitive API
- ✅ Context binding prevents errors
- ✅ Better IDE autocomplete/TypeScript support
- ✅ Backward compatibility maintained
- ✅ Methods are discoverable on the instance

**Drawbacks:**
- ❌ Potentially larger bundles (imports entire instance)
- ❌ Less tree-shakable

## Option 2: Context-Passing Functions

```javascript
import { mutate, query, authenticate, createContext } from 'fcl-js'
const context = createContext(config)
mutate(context, params)
query(context, script)
authenticate(context)
```

**Benefits:**
- ✅ Better tree-shaking (only import what you use)
- ✅ Functional programming style
- ✅ Better bundle size optimization

**Drawbacks:**
- ❌ More verbose API
- ❌ Easy to forget context parameter
- ❌ Context gets passed everywhere
- ❌ Harder to discover available methods
- ❌ More imports needed

## Option 3: Overloaded Functions (Hybrid)

Support both patterns with function overloads:

```javascript
export function mutate(contextOrFirstArg, ...args) {
  // Check if first arg is a context object
  if (contextOrFirstArg && typeof contextOrFirstArg === 'object' && contextOrFirstArg._isContext) {
    // New API: mutate(context, ...params)
    return mutateFn(contextOrFirstArg, ...args)
  } else {
    // Legacy API: mutate(...params) - use global context
    return mutateFn(getGlobalContext(), contextOrFirstArg, ...args)
  }
}
```

**Usage Examples:**
```javascript
// Legacy (still works)
import { mutate } from 'fcl-js'
mutate(transaction, options)

// New context-passing (tree-shakable)
import { mutate, createContext } from 'fcl-js'
const context = createContext(config)
mutate(context, transaction, options)

// Instance-based (also still works)
const fcl = createFCL(config)
fcl.mutate(transaction, options)
```

**Benefits:**
- ✅ Zero breaking changes
- ✅ Tree-shakable for new users
- ✅ Clear migration path
- ✅ Single function handles both patterns
- ✅ Single API surface

## Option 4: Both Patterns Side-by-Side

```javascript
// Instance-based API
export function createFCL(config) {
  const context = createContext(config)
  
  return {
    mutate: (...params) => mutate(context, ...params),
    query: (...params) => query(context, ...params),
    authenticate: (...params) => authenticate(context, ...params),
  }
}

// Context-passing API (tree-shakable)
export { mutate, query, authenticate } from './core'
export { createContext } from './context'
```

## Analysis & Recommendation

### Tree-Shaking Considerations
- **Context-passing** is more tree-shakable
- **Instance-based** potentially bundles all methods
- For SDK-style libraries like FCL, users typically use multiple functions anyway

### Developer Experience (DX)
- **Instance-based** has significantly better DX
- **Context-passing** is more verbose and error-prone
- IDE support and discoverability favor instance approach

### Library Comparisons
- **React Query**: Uses hooks + context provider pattern
- **Zustand**: Primarily instance-based, supports context for SSR
- **Jotai**: Supports both global and explicit store patterns

### Final Assessment

**For FCL specifically:**

1. **Instance-based approach is better for DX** - the primary consideration for an SDK
2. **Context-passing has minimal tree-shaking benefit** since FCL users typically use multiple functions
3. **Overloaded functions provide best of both worlds** but add complexity
4. **Current instance approach strikes the right balance**

## Decision

**Stick with the instance-based approach** because:
- FCL is a cohesive SDK, not a utility library
- Developer experience is crucial for adoption
- Most users will use several functions together anyway
- Bundle size trade-off is acceptable for the DX benefits
- Maintains clean, intuitive API surface

The migration away from global state to instances was the right architectural choice.

## DX vs Tree-Shaking Trade-off Summary

| Aspect | Instance-Based | Context-Passing |
|--------|---------------|-----------------|
| **DX** | ✅ Excellent | ❌ Verbose |
| **Tree-shaking** | ❌ Limited | ✅ Excellent |
| **Discoverability** | ✅ Great | ❌ Poor |
| **Error-prone** | ✅ Low | ❌ High |
| **Bundle size** | ❌ Larger | ✅ Smaller |
| **API simplicity** | ✅ Clean | ❌ Complex |

**Conclusion:** For FCL, DX wins over tree-shaking optimization.
