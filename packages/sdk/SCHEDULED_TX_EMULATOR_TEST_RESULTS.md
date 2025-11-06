# Scheduled Transaction Indexing Test Results - Emulator (Forked Mainnet)

**Test Date:** November 5, 2025  
**Access Node:** `http://localhost:8888`  
**Network:** Flow Emulator (Forked Mainnet State)  
**Test Account:** `0xa470920a30c770a5`

## Test Results Summary

```
PASS src/scheduled-transactions.integration.test.ts (30.3s)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 2 skipped, 7 total
```

## Individual Test Results

✅ **Initialize Counter Handler** (6.8s)
- Initializes `CounterTransactionHandler` on test account
- Status: SEALED

✅ **Schedule Transaction** (8.9s)
- Schedules transaction with 1 second delay
- Extracts scheduled transaction ID from `FlowTransactionScheduler.Scheduled` event
- Example Scheduled TX ID: `51159`

✅ **Query Scheduled Transaction** (13.6s)
- Waits 10 seconds for execution window
- **Sends dummy transaction to trigger scheduled transaction execution** (required for emulator)
- Waits additional 3 seconds for processing
- Queries scheduled transaction by UInt64 ID using `getTransaction()`
- Verifies transaction script, payer, and arguments
- Indexing feature working correctly

✅ **Query Scheduled Transaction Status** (0.1s)
- Queries status using `getTransactionStatus()`
- Status: SEALED
- Events captured successfully

✅ **Query by Native Transaction Hash** (0.4s)
- Extracts native transaction hash from `FlowTransactionScheduler.Executed` event
- Queries using native hash with both `getTransaction()` and `getTransactionStatus()`
- Example Native Hash: `7abd9aff2cbd66fcfa494f094bc19fb1f5c529b993607440dd3f64ced420a3b8`
- Verifies both query methods return identical transaction data

## Key Achievements

### 1. Scheduled Transaction Indexing on Emulator
✅ Query by scheduled transaction ID (UInt64 format)  
✅ Query by native transaction hash (extracted from events)  
✅ Both methods use standard FCL `getTransaction()` and `getTransactionStatus()` functions  
✅ Handles emulator-specific execution model (requires trigger transaction)

### 2. Emulator-Specific Behavior

**Important:** On the emulator, scheduled transactions don't execute automatically. They require another transaction to trigger block production:

```typescript
// Send a dummy transaction to trigger block production
const dummyTx = await client.send([
  transaction(`
    transaction() {
      prepare(signer: &Account) {
        // Empty transaction just to trigger a block
      }
    }
  `),
  proposer(authz as any),
  payer([authz as any]),
  authorizations([authz as any]),
  limit(100),
])
```

This is automatically handled in the test suite.

### 3. Contract Configuration
```typescript
FlowTransactionScheduler: 0x8c5303eaa26202d6      // Testnet
FlowTransactionSchedulerUtils: 0x8c5303eaa26202d6  // Testnet
CounterTransactionHandler: 0x012e4d204a60ac6f      // Deployed handler
FungibleToken: 0x9a0766d93b6608b7                  // Testnet
FlowToken: 0x7e60df042a9c0868                      // Testnet
```

### 4. Transaction Flow
1. Initialize counter handler on account
2. Schedule transaction with 1-second delay
3. Wait 10 seconds for execution window
4. **Send dummy transaction to trigger execution** (emulator-specific)
5. Wait 3 seconds for processing
6. Query by scheduled TX ID (UInt64)
7. Query by native transaction hash (hex)
8. Verify both methods return same data

## Indexing Feature Confirmation

The scheduled transaction indexing feature works on emulator with forked mainnet state:
- Pass scheduled transaction IDs directly to existing FCL functions
- Query transaction details using `fcl.send([fcl.getTransaction(scheduledTxId)])`
- Query transaction status using `fcl.send([fcl.getTransactionStatus(scheduledTxId)])`
- Extract native transaction hash from execution events for additional queries
- **Note:** Requires trigger transaction on emulator (handled automatically in tests)

No special indexing endpoints needed - uses standard Flow transaction query APIs!

## Test Configuration

**Signing:** ECDSA P256 with SHA3-256  
**Transaction Delay:** 1.0 seconds (for fast testing)  
**Wait Buffer:** 10 seconds + 3 seconds post-trigger  
**Trigger Transaction:** Empty transaction to trigger block production  
**Test File:** `packages/sdk/src/scheduled-transactions.integration.test.ts`

## Differences from Devnet53

| Feature | Devnet53 | Emulator (Forked Mainnet) |
|---------|----------|---------------------------|
| Automatic Execution | ✅ Yes | ❌ No - requires trigger tx |
| Test Duration | ~21s | ~30s (due to trigger wait) |
| Network State | Live testnet | Forked mainnet snapshot |
| Indexing Feature | ✅ Working | ✅ Working |



