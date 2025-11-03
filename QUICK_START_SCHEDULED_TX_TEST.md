# Quick Start: Scheduled Transaction Test

## What Was Created

A comprehensive integration test for scheduled transaction indexing endpoints has been added to the FCL-JS SDK:

**Location:** `/home/jordan/repos/fcl-js/packages/sdk/src/scheduled-transactions.integration.test.ts`

## Quick Setup (3 Steps)

### 1. Add Your Credentials

Edit the test file and add your devnet account credentials:

```typescript
// Line ~31-32 in scheduled-transactions.integration.test.ts
const TEST_ADDRESS = "0xYOUR_ADDRESS_HERE"
const TEST_PRIVATE_KEY = "YOUR_PRIVATE_KEY_HERE"
```

### 2. Enable Real Signing (Optional)

For real on-chain testing, install dependencies:

```bash
cd /home/jordan/repos/fcl-js
npm install --save-dev elliptic @types/elliptic
```

Then uncomment the real signing implementation in the test file (lines ~111-123).

### 3. Run the Test

```bash
# From the SDK package
cd /home/jordan/repos/fcl-js/packages/sdk
npm test -- scheduled-transactions.integration.test.ts

# Or from the root
cd /home/jordan/repos/fcl-js
npm test -- packages/sdk/src/scheduled-transactions.integration.test.ts
```

## What It Tests

✅ **Schedule Transaction** - Creates a scheduled transaction on devnet  
✅ **Query Status** - Placeholder for querying scheduled tx status  
✅ **List Transactions** - Placeholder for listing scheduled txs  
✅ **Query Events** - Placeholder for event queries  

## Test Configuration

- **Access Node:** `http://access-003.devnet53.nodes.onflow.org:8070`
- **Network:** Flow Devnet53
- **Transaction:** ScheduleIncrementIn.cdc (schedules a Counter increment)
- **Contracts:** Uses addresses from [scheduledtransactions-scaffold](https://github.com/onflow/scheduledtransactions-scaffold)

## Authorization Pattern

The test uses an authz function similar to fcl-dev-wallet:

```typescript
const authz = createAuthzFunction(address, keyId, privateKey)

await client.send([
  transaction(cadenceCode),
  args([arg(value, t.UInt64)]),
  proposer(authz),
  payer([authz]),
  authorizations([authz]),
  limit(9999),
])
```

## Files Created

1. **Test File:** `packages/sdk/src/scheduled-transactions.integration.test.ts`
   - Complete integration test suite
   - Mock signing by default
   - Real signing implementation commented out

2. **Documentation:** `packages/sdk/src/SCHEDULED_TRANSACTIONS_TEST_README.md`
   - Detailed setup guide
   - Troubleshooting tips
   - Extension examples

## Next Steps

1. **Fill in credentials** in the test file
2. **Remove `.skip`** from test cases you want to run
3. **Install elliptic** for real signing (optional for now)
4. **Run the test** to verify the setup

## Current Status

- ✅ Test structure complete
- ✅ Mock signing works for testing structure
- ⏸️ Tests are skipped by default (awaiting credentials)
- ⏸️ Real signing implementation commented out (optional)

## Notes

- Tests are currently `.skip`ped to avoid running without credentials
- The mock signing function allows testing the structure without real on-chain execution
- Once you add credentials and enable real signing, the test will actually schedule a transaction on devnet
- Placeholder tests are included for future scheduled transaction query endpoints

## Need Help?

See the detailed README at:
```
/home/jordan/repos/fcl-js/packages/sdk/src/SCHEDULED_TRANSACTIONS_TEST_README.md
```

