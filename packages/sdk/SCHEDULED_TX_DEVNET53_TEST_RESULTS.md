# Scheduled Transaction Indexing Test Results - Devnet53

**Test Date:** November 5, 2025  
**Access Node:** `http://access-003.devnet53.nodes.onflow.org:8070`  
**Network:** Flow Testnet (Devnet53)  
**Test Account:** `0xa470920a30c770a5`

## Test Results Summary

```
PASS src/scheduled-transactions.integration.test.ts (21.58s)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 2 skipped, 7 total
```

## Individual Test Results

✅ **Initialize Counter Handler** (6.8s)
- Initializes `CounterTransactionHandler` on test account
- Status: SEALED

✅ **Schedule Transaction** (8.6s)
- Schedules transaction with 1 second delay
- Extracts scheduled transaction ID from `FlowTransactionScheduler.Scheduled` event
- Example Scheduled TX ID: `35194`

✅ **Query Scheduled Transaction** (5.2s)
- Queries scheduled transaction by UInt64 ID using `getTransaction()`
- Verifies transaction script, payer, and arguments
- Indexing feature working correctly

✅ **Query Scheduled Transaction Status** (0.1s)
- Queries status using `getTransactionStatus()`
- Status: SEALED
- Events captured successfully

✅ **Query by Native Transaction Hash** (0.3s)
- Extracts native transaction hash from `FlowTransactionScheduler.Executed` event
- Queries using native hash with both `getTransaction()` and `getTransactionStatus()`
- Example Native Hash: `7131978db923eaecffa82556ba62829aaba6905628cf2c0b50135cbedc47e26e`
- Verifies both query methods return identical transaction data

## Key Achievements

### 1. Scheduled Transaction Indexing
✅ Query by scheduled transaction ID (UInt64 format)  
✅ Query by native transaction hash (extracted from events)  
✅ Both methods use standard FCL `getTransaction()` and `getTransactionStatus()` functions

### 2. Contract Configuration
```typescript
FlowTransactionScheduler: 0x8c5303eaa26202d6      // Testnet
FlowTransactionSchedulerUtils: 0x8c5303eaa26202d6  // Testnet
CounterTransactionHandler: 0x012e4d204a60ac6f      // Deployed handler
FungibleToken: 0x9a0766d93b6608b7                  // Testnet
FlowToken: 0x7e60df042a9c0868                      // Testnet
```

### 3. Transaction Flow
1. Initialize counter handler on account
2. Schedule transaction with 1-second delay
3. Wait for transaction to execute
4. Query by scheduled TX ID (UInt64)
5. Query by native transaction hash (hex)
6. Verify both methods return same data

## Indexing Feature Confirmation

The scheduled transaction indexing feature allows developers to:
- Pass scheduled transaction IDs directly to existing FCL functions
- Query transaction details using `fcl.send([fcl.getTransaction(scheduledTxId)])`
- Query transaction status using `fcl.send([fcl.getTransactionStatus(scheduledTxId)])`
- Extract native transaction hash from execution events for additional queries

No special indexing endpoints needed - uses standard Flow transaction query APIs!

## Test Configuration

**Signing:** ECDSA P256 with SHA3-256  
**Transaction Delay:** 1.0 seconds (for fast testing)  
**Wait Buffer:** 5 seconds before query  
**Test File:** `packages/sdk/src/scheduled-transactions.integration.test.ts`



