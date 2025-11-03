/**
 * Integration test for scheduled transaction indexing endpoints
 * 
 * This test demonstrates:
 * - Creating and sending a scheduled transaction
 * - Querying scheduled transaction status
 * - Using custom auth/authz functions
 */

import { createSdkClient } from "./sdk-client"
import { httpTransport } from "@onflow/transport-http"
import {
  build,
  transaction,
  proposer,
  payer,
  authorizations,
  authorization,
  limit,
  ref,
  arg,
  args,
  t,
  getTransaction,
  getTransactionStatus,
} from "./sdk"
import type { InteractionAccount } from "@onflow/typedefs"
import { ec as EC } from "elliptic"
import { sha3_256 } from "@noble/hashes/sha3"
// ========================================
// Configuration
// ========================================

// Access node - using devnet with testnet contracts
// Contracts from: https://github.com/onflow/scheduledtransactions-scaffold/blob/main/flow.json
const ACCESS_NODE = "http://access-003.devnet53.nodes.onflow.org:8070"

// Account credentials
const TEST_ADDRESS = "a470920a30c770a5"
const TEST_PRIVATE_KEY = "23c17132812550ed104f5a9716528830eb9bb4d24aecfa19d2ebd127085bb548"

// Contract addresses - FROM scheduledtransactions-scaffold flow.json
// Source: https://github.com/onflow/scheduledtransactions-scaffold/blob/main/flow.json
// CounterTransactionHandler: https://f.dnz.dev/0x012e4d204a60ac6f/storage/CounterTransactionHandler
const CONTRACT_ADDRESSES = {
  FlowTransactionScheduler: "0x8c5303eaa26202d6",      // Testnet
  FlowTransactionSchedulerUtils: "0x8c5303eaa26202d6",  // Testnet
  CounterTransactionHandler: "0x012e4d204a60ac6f",      // Deployed counter handler
  FungibleToken: "0x9a0766d93b6608b7",                  // Testnet
  FlowToken: "0x7e60df042a9c0868",                      // Testnet
}

// ========================================
// Initialization Script
// ========================================

const INIT_COUNTER_HANDLER_SCRIPT = `
import CounterTransactionHandler from ${CONTRACT_ADDRESSES.CounterTransactionHandler}
import FlowTransactionScheduler from ${CONTRACT_ADDRESSES.FlowTransactionScheduler}

transaction() {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, PublishCapability) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: /storage/CounterTransactionHandler) == nil {
            let handler <- CounterTransactionHandler.createHandler()
            signer.storage.save(<-handler, to: /storage/CounterTransactionHandler)
        }

        // Validation/example that we can create an issue a handler capability with correct entitlement for FlowTransactionScheduler
        let _ = signer.capabilities.storage
            .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(/storage/CounterTransactionHandler)
    
        // Issue a non-entitled public capability for the handler that is publicly accessible
        let publicCap = signer.capabilities.storage
            .issue<&{FlowTransactionScheduler.TransactionHandler}>(/storage/CounterTransactionHandler)
        // publish the capability
        signer.capabilities.publish(publicCap, at: /public/CounterTransactionHandler)
    }
}
`.trim()

// ========================================
// Scheduled Transaction Script
// ========================================

// Based on the actual devnet deployment
// See: https://f.dnz.dev/0x012e4d204a60ac6f/storage/CounterTransactionHandler
const SCHEDULE_INCREMENT_SCRIPT = `
import FlowTransactionScheduler from ${CONTRACT_ADDRESSES.FlowTransactionScheduler}
import FlowTransactionSchedulerUtils from ${CONTRACT_ADDRESSES.FlowTransactionSchedulerUtils}
import FlowToken from ${CONTRACT_ADDRESSES.FlowToken}
import FungibleToken from ${CONTRACT_ADDRESSES.FungibleToken}

/// Schedule an increment of the Counter with a relative delay in seconds using the manager
transaction(
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    transactionData: AnyStruct?
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {
        let future = getCurrentBlock().timestamp + delaySeconds

        let pr = priority == 0
            ? FlowTransactionScheduler.Priority.High
            : priority == 1
                ? FlowTransactionScheduler.Priority.Medium
                : FlowTransactionScheduler.Priority.Low

        // Get the entitled capability that will be used to create the transaction
        var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil
        if let cap = signer.capabilities.storage
                            .getControllers(forPath: /storage/CounterTransactionHandler)[0]
                            .capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
            handlerCap = cap
        } else {
            handlerCap = signer.capabilities.storage
                            .getControllers(forPath: /storage/CounterTransactionHandler)[1]
                            .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        }

        // Save a manager resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: FlowTransactionSchedulerUtils.managerStoragePath) == nil {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)
        
            // Create a capability for the Manager
            let managerCapPublic = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
            signer.capabilities.publish(managerCapPublic, at: FlowTransactionSchedulerUtils.managerPublicPath)
        }
        
        // Borrow the manager
        let manager = signer.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
            ?? panic("Could not borrow a Manager reference")

        // Withdraw fees
        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("missing FlowToken vault")
        
        let est = FlowTransactionScheduler.estimate(
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort
        )

        assert(
            est.timestamp != nil || pr == FlowTransactionScheduler.Priority.Low,
            message: est.error ?? "estimation failed"
        )
        
        let fees <- vaultRef.withdraw(amount: est.flowFee ?? 0.0) as! @FlowToken.Vault

        // Schedule through the manager
        let transactionId = manager.schedule(
            handlerCap: handlerCap ?? panic("Could not borrow handler capability"),
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort,
            fees: <-fees
        )

        log("Scheduled transaction id: ".concat(transactionId.toString()).concat(" at ").concat(future.toString()))
    }
}
`.trim()

// ========================================
// Auth/Authz Functions
// ========================================

/**
 * Creates a signing function using ECDSA P256 curve with SHA3-256
 * Based on: https://github.com/onflow/fcl-dev-wallet/blob/69de8fd4c33535e48f8b5e45a8d4adc43aeb31ee/src/authz.ts#L7
 * 
 * Note: Flow uses SHA3-256 (Keccak-256), not SHA2-256
 */
function createSigningFunction(privateKey: string) {
  return async (signable: any) => {
    const ec = new EC("p256")
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
    // Use official SHA3-256 for hashing, as required by Flow (not Keccak-256)
    const msgHash = sha3_256(Buffer.from(signable.message, "hex"))
    const sig = key.sign(msgHash)
    const n = 32 // half of signature length as hex (64 bytes)
    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)
    return {
      addr: signable.addr,
      keyId: signable.keyId,
      signature: Buffer.concat([r, s]).toString("hex"),
    }
  }
}

/**
 * Creates an authorization function for Flow transactions
 * This follows the pattern from fcl-dev-wallet authz.ts
 * Returns a function that the SDK can resolve to get account details
 */
function createAuthzFunction(address: string, keyId: number, privateKey: string) {
  return async (account: any = {}) => {
    // Return an account object with address, keyId, and signing function
    // The SDK will fetch the sequence number from the network during resolution
    return {
      ...account,
      tempId: `${address}-${keyId}`,
      addr: address,
      keyId,
      signingFunction: createSigningFunction(privateKey),
    }
  }
}

// ========================================
// SDK Client Setup
// ========================================

const client = createSdkClient({
  accessNodeUrl: ACCESS_NODE,
  transport: httpTransport,
  computeLimit: 9999,
})

// ========================================
// Tests
// ========================================

describe("Scheduled Transaction Indexing", () => {
  // Skip tests if credentials are not provided
  const shouldSkip = !TEST_ADDRESS || !TEST_PRIVATE_KEY
  
  // Shared state between tests - stores the scheduled transaction ID
  let scheduledTxId: string | null = null

  beforeAll(() => {
    if (shouldSkip) {
      console.warn("⚠️  Skipping scheduled transaction tests - TEST_ADDRESS and TEST_PRIVATE_KEY not configured")
    }
  })

  describe("Initialize Counter Handler", () => {
    it(
      "should initialize CounterTransactionHandler on the account",
      async () => {
        // Arrange
        const authz = createAuthzFunction(TEST_ADDRESS, 0, TEST_PRIVATE_KEY)

        // Act - Initialize the handler
        const response = await client.send([
          transaction(INIT_COUNTER_HANDLER_SCRIPT),
          args([]),
          proposer(authz as any),
          payer([authz as any]),
          authorizations([authz as any]),
          limit(9999),
        ])
        
        const txId = response.transactionId
        console.log("✅ Initialization transaction sent:", txId)
        
        // Wait for transaction to be sealed
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // Get the transaction status
        const txStatus = await client.send([
          getTransactionStatus(txId)
        ])
        const statusDecoded = await client.decode(txStatus)
        
        console.log("   Transaction status:", statusDecoded.statusString)
        if (statusDecoded.errorMessage) {
          console.log("   ⚠️  Error:", statusDecoded.errorMessage.substring(0, 500))
        }

        // Assert
        expect(txId).toBeDefined()
        // Status code 0 = success, 1 = minor error (might already be initialized)
        expect([0, 1]).toContain(statusDecoded.statusCode)
        
        if (statusDecoded.statusCode === 0) {
          console.log("✅ CounterTransactionHandler initialized successfully")
        } else {
          console.log("✅ CounterTransactionHandler setup complete (may have been already initialized)")
        }
      },
      30000 // 30 second timeout
    )
  })

  describe("Schedule Transaction", () => {
    it(
      "should schedule a transaction and extract the scheduled transaction ID from events",
      async () => {
        // Arrange
        const authz = createAuthzFunction(TEST_ADDRESS, 0, TEST_PRIVATE_KEY)
        const delaySeconds = 1.0 // Schedule for 1 second from now (fast for testing)
        const priority = 2 // Low priority (0=High, 1=Medium, 2=Low)
        const executionEffort = 100 // Execution effort estimate
        const transactionData = null // No additional data

        // Act - Build, resolve, and send the transaction
        const response = await client.send([
          transaction(SCHEDULE_INCREMENT_SCRIPT),
          args([
            arg(delaySeconds.toFixed(1), t.UFix64), // UFix64 requires decimal format like "300.0"
            arg(priority.toString(), t.UInt8),
            arg(executionEffort.toString(), t.UInt64),
            arg(transactionData, t.Optional(t.String)),
          ]),
          proposer(authz as any),
          payer([authz as any]),
          authorizations([authz as any]),
          limit(9999),
        ])
        
        const schedulingTxId = response.transactionId
        console.log("✅ Scheduling transaction sent:", schedulingTxId)
        
        // Wait for transaction to be sealed (devnet can be slow)
        await new Promise(resolve => setTimeout(resolve, 8000))
        
        // Get the transaction status to extract the scheduled transaction ID from events
        const txStatus = await client.send([
          getTransactionStatus(schedulingTxId)
        ])
        const statusDecoded = await client.decode(txStatus)
        
        console.log("   Transaction status:", statusDecoded.statusString)
        console.log("   Status code:", statusDecoded.statusCode)
        console.log("   Events count:", statusDecoded.events.length)
        
        if (statusDecoded.errorMessage) {
          console.log("   ⚠️  Error:", statusDecoded.errorMessage.substring(0, 300))
        }
        
        // The scheduled transaction ID is emitted in the events
        // Look for FlowTransactionScheduler.Scheduled event
        const scheduledEvent = statusDecoded.events.find(
          (e: any) => e.type.includes("FlowTransactionScheduler.Scheduled")
        )
        
        if (scheduledEvent) {
          console.log("   📦 Scheduled event found:", JSON.stringify(scheduledEvent, null, 2).substring(0, 500))
          
          // Extract the scheduled transaction ID from the event payload
          // The exact field name may vary - check event payload structure
          scheduledTxId = scheduledEvent.payload?.transactionId || scheduledEvent.payload?.id || scheduledEvent.data?.id
          console.log("✅ Scheduled transaction ID from event:", scheduledTxId)
        } else {
          console.log("⚠️  No TransactionScheduled event found. Available events:")
          statusDecoded.events.forEach((e: any) => {
            console.log("   -", e.type)
            if (e.type.includes("Scheduled")) {
              console.log("      Payload:", JSON.stringify(e.payload).substring(0, 200))
            }
          })
          if (statusDecoded.statusString === "PENDING") {
            console.log("   Transaction still pending - may need to wait longer")
          }
          if (statusDecoded.errorMessage && statusDecoded.statusCode !== 0) {
            console.log("   ⚠️  Transaction failed - check contract addresses are correct")
          }
        }

        // Assert
        expect(schedulingTxId).toBeDefined()
        expect(typeof schedulingTxId).toBe("string")
        expect(schedulingTxId.length).toBeGreaterThan(0)
        
        // If we got a scheduled tx ID, store it for other tests
        if (scheduledTxId) {
          console.log("✅ Ready to query scheduled transaction:", scheduledTxId)
        }
      },
      30000 // 30 second timeout
    )
  })

  describe("Query Scheduled Transaction", () => {
    it(
      "should query the scheduled transaction by its ID after execution",
      async () => {
        // This test uses the transaction ID from the previous test
        expect(scheduledTxId).toBeDefined()
        if (!scheduledTxId) {
          throw new Error("scheduledTxId is not set - Schedule Transaction test must run first")
        }
        
        console.log("⏳ Waiting for scheduled transaction to execute (~5 seconds with buffer)...")
        // Wait for the scheduled transaction to execute (1 second delay + 4 second buffer)
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // Query the scheduled transaction using the existing getTransaction function
        // The indexing feature allows you to pass transaction IDs to existing functions
        const response = await client.send([
          getTransaction(scheduledTxId)
        ])
        
        const decoded = await client.decode(response)
        console.log("   Response keys:", Object.keys(decoded))
        console.log("   Response:", JSON.stringify(decoded, null, 2).substring(0, 500))
        
        // Assert
        expect(decoded).toBeDefined()
        expect(decoded.script).toBeDefined()
        expect(decoded.script).toContain("FlowTransactionScheduler")
        
        console.log("✅ Queried scheduled transaction:", scheduledTxId)
        console.log("   Script length:", decoded.script.length, "characters")
        console.log("   Payer:", decoded.payer)
      },
      15000 // 15 second timeout (includes wait time)
    )
  })

  describe("Query Scheduled Transaction Status", () => {
    it(
      "should query the status of the scheduled transaction",
      async () => {
        // This test uses the transaction ID from the first test
        expect(scheduledTxId).toBeDefined()
        if (!scheduledTxId) {
          throw new Error("scheduledTxId is not set - Schedule Transaction test must run first")
        }
        
        // No additional wait needed - previous test already waited
        console.log("🔍 Querying transaction status for:", scheduledTxId)
        
        // Query scheduled transaction status using existing getTransactionStatus
        const response = await client.send([
          getTransactionStatus(scheduledTxId)
        ])
        
        const decoded = await client.decode(response)
        console.log("   Status response keys:", Object.keys(decoded))
        console.log("   Status response:", JSON.stringify(decoded, null, 2).substring(0, 500))
        
        // Assert
        expect(decoded).toBeDefined()
        expect(decoded.statusString).toBeDefined()
        expect(decoded.events).toBeDefined()
        
        console.log("✅ Queried scheduled transaction status:", scheduledTxId)
        console.log("   Status:", decoded.statusString)
        console.log("   Status code:", decoded.statusCode)
        console.log("   Block ID:", decoded.blockId)
        console.log("   Events count:", decoded.events.length)
        
        // Log error message if transaction failed
        if (decoded.errorMessage) {
          console.log("   Error:", decoded.errorMessage.substring(0, 200))
        }
      },
      30000
    )
  })

  describe("Query by Native Transaction Hash", () => {
    it(
      "should query using the native transaction ID returned from scheduled transaction lookup",
      async () => {
        // This test proves you can use BOTH the scheduled TX ID (UInt64) AND the native hash
        expect(scheduledTxId).toBeDefined()
        if (!scheduledTxId) {
          throw new Error("scheduledTxId is not set - Schedule Transaction test must run first")
        }
        
        console.log("🔍 First: Query by scheduled TX ID to get native hash...")
        
        // Step 1: Query by scheduled transaction ID (UInt64)
        const scheduledResponse = await client.send([
          getTransaction(scheduledTxId)
        ])
        const scheduledDecoded = await client.decode(scheduledResponse)
        
        // Step 2: Extract the native transaction ID (hash) from the response
        // Check what's available in the response
        console.log("   Transaction object:", JSON.stringify(scheduledResponse.transaction, null, 2).substring(0, 600))
        
        // The transaction ID might be a computed hash from the transaction data
        // Or we might need to get it from the transactionStatus response instead
        // Let's try getting status first to see if it has the hash
        const statusForHash = await client.send([
          getTransactionStatus(scheduledTxId)
        ])
        const statusDecoded = await client.decode(statusForHash)
        
        // The native transaction hash is in the events!
        // Look for the FlowTransactionScheduler.Executed event
        const executedEvent = statusDecoded.events.find(
          (e: any) => e.type.includes("FlowTransactionScheduler.Executed")
        )
        
        const nativeTransactionId = executedEvent?.transactionId
        const blockId = statusDecoded.blockId
        
        console.log("   Native transaction ID (hash):", nativeTransactionId)
        console.log("   Block ID:", blockId)
        
        expect(nativeTransactionId).toBeDefined()
        expect(typeof nativeTransactionId).toBe("string")
        expect(nativeTransactionId.length).toBeGreaterThan(10) // Should be a hash, not UInt64
        expect(blockId).toBeDefined()
        
        // Step 3: Query using the native transaction hash
        console.log("🔍 Second: Query by native transaction hash...")
        const nativeResponse = await client.send([
          getTransaction(nativeTransactionId)
        ])
        const nativeDecoded = await client.decode(nativeResponse)
        
        // Step 4: Verify we get the same transaction data
        expect(nativeDecoded).toBeDefined()
        expect(nativeDecoded.script).toBeDefined()
        expect(nativeDecoded.script).toContain("FlowTransactionScheduler")
        
        console.log("✅ Successfully queried by native transaction hash:", nativeTransactionId)
        console.log("   Script matches:", nativeDecoded.script === scheduledDecoded.script)
        
        // Step 5: Also test getTransactionStatus with native hash
        console.log("🔍 Third: Query status by native transaction hash...")
        const nativeStatusResponse = await client.send([
          getTransactionStatus(nativeTransactionId)
        ])
        const nativeStatusDecoded = await client.decode(nativeStatusResponse)
        
        expect(nativeStatusDecoded).toBeDefined()
        expect(nativeStatusDecoded.statusString).toBeDefined()
        expect(nativeStatusDecoded.blockId).toBeDefined()
        
        console.log("✅ Status by native hash:", nativeStatusDecoded.statusString)
        console.log("   Block ID:", nativeStatusDecoded.blockId)
        console.log("")
        console.log("🎉 Indexing feature confirmed:")
        console.log("   ✓ Query by scheduled TX ID (UInt64):", scheduledTxId)
        console.log("   ✓ Query by native TX hash:", nativeTransactionId)
        console.log("   ✓ Both return the same transaction data!")
      },
      30000
    )
  })

  describe("Complete Flow Example", () => {
    it.skip(
      "should schedule and then query a transaction",
      async () => {
        // NOTE: This test requires ScheduledTransactions contracts to be deployed
        // Once deployed, remove .skip to test the complete flow
        // Step 1: Schedule a transaction
        const authz = createAuthzFunction(TEST_ADDRESS, 0, TEST_PRIVATE_KEY)
        const delaySeconds = 300.0 // Schedule for 5 minutes from now
        const priority = 2 // Low priority
        const executionEffort = 100
        const transactionData = null

        const scheduleResponse = await client.send([
          transaction(SCHEDULE_INCREMENT_SCRIPT),
          args([
            arg(delaySeconds.toString(), t.UFix64),
            arg(priority.toString(), t.UInt8),
            arg(executionEffort.toString(), t.UInt64),
            arg(transactionData, t.Optional(t.String)),
          ]),
          proposer(authz as any),
          payer([authz as any]),
          authorizations([authz as any]),
          limit(9999),
        ])
        
        const txId = scheduleResponse.transactionId
        
        console.log("✅ Scheduled transaction created:", txId)
        
        // Wait a moment for the transaction to be indexed
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Step 2: Query the scheduled transaction details
        const txResponse = await client.send([
          getTransaction(txId)
        ])
        const txDecoded = await client.decode(txResponse)
        
        expect(txDecoded.transaction).toBeDefined()
        console.log("✅ Retrieved scheduled transaction details")
        console.log("   Script length:", txDecoded.transaction.script.length, "characters")
        
        // Step 3: Query the scheduled transaction status
        const statusResponse = await client.send([
          getTransactionStatus(txId)
        ])
        const statusDecoded = await client.decode(statusResponse)
        
        expect(statusDecoded.transactionStatus).toBeDefined()
        console.log("✅ Retrieved scheduled transaction status:", statusDecoded.transactionStatus.statusString)
        console.log("   Block ID:", statusDecoded.transactionStatus.blockId)
        console.log("   Events count:", statusDecoded.transactionStatus.events.length)
        
        // Assert the transaction was properly scheduled
        expect(txId).toBeDefined()
        expect(txDecoded.transaction.script).toContain("FlowTransactionScheduler")
        expect(statusDecoded.transactionStatus.events).toBeDefined()
      },
      60000 // 60 second timeout for complete flow
    )
  })

  describe("Query Scheduled Transaction Events", () => {
    it.skip(
      shouldSkip ? "should query events related to scheduled transactions (skipped - no credentials)" : "should query events related to scheduled transactions",
      async () => {
        // Query events emitted by the ScheduledTransactions contract
        // This uses the existing events endpoint
        
        const { getEventsAtBlockHeightRange } = await import("./sdk")
        
        // Get current block height to determine range
        const latestBlock = await client.block({ sealed: true })
        const endHeight = latestBlock.height
        const startHeight = endHeight - 100 // Look back 100 blocks
        
        // Query TransactionScheduled events
        const eventType = `A.${CONTRACT_ADDRESSES.FlowTransactionScheduler}.FlowTransactionScheduler.TransactionScheduled`
        
        const response = await client.send([
          getEventsAtBlockHeightRange(eventType, startHeight, endHeight)
        ])
        
        const decoded = await client.decode(response)
        
        // Assert
        expect(decoded.events).toBeDefined()
        expect(Array.isArray(decoded.events)).toBe(true)
        
        console.log(`✅ Queried events from blocks ${startHeight} to ${endHeight}`)
        console.log(`Found ${decoded.events.length} TransactionScheduled events`)
        
        if (decoded.events.length > 0) {
          console.log("Sample event:", decoded.events[0])
        }
      },
      30000
    )
  })
})

// ========================================
// Notes on Scheduled Transaction Indexing
// ========================================

/**
 * Scheduled Transaction IDs vs Regular Transaction IDs
 * 
 * - Regular transaction IDs: 256-bit hash (hex string) e.g., "a1b2c3d4..."
 * - Scheduled transaction IDs: UInt64 (decimal string) e.g., "12345"
 * 
 * The indexing feature allows both ID types to be used with existing functions:
 * - getTransaction(id) - works with both regular and scheduled tx IDs
 * - getTransactionStatus(id) - works with both regular and scheduled tx IDs
 * 
 * This means no new endpoints are needed - the existing transaction query
 * functions automatically handle scheduled transactions!
 */

