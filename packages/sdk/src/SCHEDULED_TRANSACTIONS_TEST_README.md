# Scheduled Transactions Integration Test

This test suite validates the scheduled transaction indexing endpoints on Flow devnet.

## Overview

The test demonstrates:
1. Creating and scheduling a transaction to execute at a future time
2. Querying scheduled transaction status
3. Using custom authorization functions similar to fcl-dev-wallet

## Setup

### 1. Configure Test Credentials

Edit `scheduled-transactions.integration.test.ts` and add your test account credentials:

```typescript
const TEST_ADDRESS = "0x1234567890abcdef"  // Your Flow devnet address
const TEST_PRIVATE_KEY = "abc123..."        // Your private key (hex string)
```

### 2. Install Required Dependencies (for Real Signing)

The test currently uses a mock signing function. To implement real transaction signing:

```bash
npm install elliptic @types/elliptic
```

Then uncomment the real signing implementation in `createSigningFunction()`:

```typescript
function createSigningFunction(privateKey: string) {
  return async (signable: any) => {
    const ec = new EC("p256")
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
    const msgHash = sha256(Buffer.from(signable.message, "hex"))
    const sig = key.sign(msgHash)
    const n = 32
    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)
    return {
      addr: signable.addr,
      keyId: signable.keyId,
      signature: Buffer.concat([r, s]).toString("hex"),
    }
  }
}
```

And add the imports at the top:

```typescript
import { sha256 } from "@noble/hashes/sha256"
import { ec as EC } from "elliptic"
```

### 3. Enable the Tests

Remove `.skip` from the test cases you want to run.

## Running the Tests

```bash
# Run all SDK tests
npm test

# Run only scheduled transaction tests
npm test -- scheduled-transactions.integration.test.ts

# Run with verbose output
npm test -- scheduled-transactions.integration.test.ts --verbose
```

## Test Configuration

### Access Node

The test connects to:
```
http://access-003.devnet53.nodes.onflow.org:8070
```

### Contract Addresses (devnet53)

From [scheduledtransactions-scaffold flow.json](https://github.com/onflow/scheduledtransactions-scaffold/blob/main/flow.json):

- `ScheduledTransactions`: `0x51a2e145cf3e75d3`
- `Counter`: `0x51a2e145cf3e75d3`
- `FungibleToken`: `0x9a0766d93b6608b7`
- `FlowToken`: `0x4445e7ad11568276`

### Transaction Script

The test uses `ScheduleIncrementIn.cdc` from the [scheduledtransactions-scaffold](https://github.com/onflow/scheduledtransactions-scaffold/blob/main/cadence/transactions/ScheduleIncrementIn.cdc) which:

1. Creates a scheduled transaction that calls `Counter.increment()`
2. Sets an execution time (seconds parameter from now)
3. Deposits a small fee (0.001 FLOW) for execution

## Test Structure

### Test Cases

1. **Schedule Transaction** - Creates and submits a scheduled transaction
2. **Query Scheduled Transaction Status** - Queries status by ID (placeholder for future endpoint)
3. **List Scheduled Transactions** - Lists all scheduled txs for an account (placeholder for future endpoint)
4. **Query Scheduled Transaction Events** - Queries events emitted by scheduled transactions

### Authorization Pattern

The test follows the authorization pattern from [fcl-dev-wallet](https://github.com/onflow/fcl-dev-wallet/blob/69de8fd4c33535e48f8b5e45a8d4adc43aeb31ee/src/authz.ts#L7):

```typescript
const authz = createAuthzFunction(address, keyId, privateKey)

await client.send([
  transaction(cadence),
  args([...]),
  proposer(authz),
  payer([authz]),
  authorizations([authz]),
  limit(9999),
])
```

## Extending the Tests

### Adding New Query Endpoints

When new scheduled transaction query endpoints are added to the SDK, you can enable and implement the placeholder tests:

```typescript
// Example: Get scheduled transaction by ID
import { getScheduledTransaction } from "@onflow/sdk"

const status = await client.send([
  getScheduledTransaction(scheduledTxId)
])
const decoded = await client.decode(status)
```

### Testing Events

Scheduled transaction events can be queried using existing event endpoints:

```typescript
import { getEventsAtBlockHeightRange } from "@onflow/sdk"

const events = await client.send([
  getEventsAtBlockHeightRange(
    "A.51a2e145cf3e75d3.ScheduledTransactions.TransactionScheduled",
    startHeight,
    endHeight
  )
])
```

## Troubleshooting

### Tests are skipped

- Make sure `TEST_ADDRESS` and `TEST_PRIVATE_KEY` are configured
- Remove `.skip` from the test cases

### Transaction fails with "insufficient balance"

- Ensure your test account has enough FLOW tokens (~0.001 FLOW minimum)
- You can get testnet FLOW from the [Flow Faucet](https://testnet-faucet.onflow.org/)

### Signature validation fails

- Ensure you're using the real signing implementation (not the mock)
- Verify your private key is correct and matches the account
- Check that the key ID matches your account's key ID

### Connection errors

- Verify the access node URL is correct and accessible
- Check network connectivity
- Try using a different access node if available

## References

- [Scheduled Transactions Scaffold](https://github.com/onflow/scheduledtransactions-scaffold)
- [FCL Dev Wallet Auth](https://github.com/onflow/fcl-dev-wallet/blob/main/src/authz.ts)
- [Flow Transaction Signing](https://docs.onflow.org/concepts/transaction-signing/)
- [Flow SDK Documentation](https://github.com/onflow/fcl-js)

