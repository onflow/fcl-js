import {arg, t} from "@onflow/fcl"
import {useCallback} from "react"
import {useFlowClient} from "./useFlowClient"
import {useFlowMutate} from "./useFlowMutate"
import {useFlowChainId} from "./useFlowChainId"
import {CONTRACT_ADDRESSES, CADENCE_UFIX64_PRECISION} from "../constants"
import {parseUnits} from "viem/utils"

export enum TransactionPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TransactionStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
}

export interface TransactionInfo {
  id: bigint
  priority: TransactionPriority
  executionEffort: bigint
  status: TransactionStatus
  fees: {
    value: bigint
    formatted: string
  }
  scheduledTimestamp: number
  handlerTypeIdentifier: string
  handlerAddress: string
}

export interface TransactionInfoWithHandler extends TransactionInfo {
  handlerUUID: bigint
  handlerResolvedViews: {[viewType: string]: any}
}

export interface UseFlowScheduleArgs {
  flowClient?: ReturnType<typeof useFlowClient>
}

export interface UseFlowScheduleResult {
  // Lists all transactions for an account
  // Equivalent to: flow schedule list <account> [--include-handler-data]
  list: (
    account: string,
    options?: {includeHandlerData?: boolean}
  ) => Promise<TransactionInfo[] | TransactionInfoWithHandler[]>

  // Gets a transaction by ID
  // Equivalent to: flow schedule get <transaction-id> [--include-handler-data]
  get: (
    transactionId: bigint,
    options?: {includeHandlerData?: boolean}
  ) => Promise<TransactionInfo | TransactionInfoWithHandler | null>

  // Sets up a Manager resource in the signer's account if not already done
  // Equivalent to: flow schedule setup [--signer account]
  setup: () => Promise<string>

  // Cancels a scheduled transaction by ID
  // Equivalent to: flow schedule cancel <transaction-id> [--signer account]
  cancel: (transactionId: bigint) => Promise<string>
}

const listTransactionsQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

access(all) struct TransactionInfo {
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address
    
    init(data: FlowTransactionScheduler.TransactionData) {
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress
    }
}

/// Lists all transactions for an account
/// This script is used by: flow schedule list <account>
access(all) fun main(account: Address): [TransactionInfo] {
    // Borrow the Manager
    let manager = FlowTransactionSchedulerUtils.borrowManager(at: account)
        ?? panic("Could not borrow Manager from account")
    
    let transactionIds = manager.getTransactionIDs()
    var transactions: [TransactionInfo] = []
    
    // Get transaction data through the Manager
    for id in transactionIds {
        if let txData = manager.getTransactionData(id) {
            transactions.append(TransactionInfo(data: txData))
        }
    }
    
    return transactions
}
`
}

const listTransactionsWithHandlerQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

/// Combined transaction info with handler data
access(all) struct TransactionInfoWithHandler {
    // Transaction fields
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address
    
    // Handler fields
    access(all) let handlerUUID: UInt64
    access(all) let handlerResolvedViews: {Type: AnyStruct}
    
    init(data: FlowTransactionScheduler.TransactionData, handlerUUID: UInt64, resolvedViews: {Type: AnyStruct}) {
        // Initialize transaction fields
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress
        
        // Initialize handler fields
        self.handlerUUID = handlerUUID
        self.handlerResolvedViews = resolvedViews
    }
}

/// Lists all transactions for an account with handler data
/// This script is used by: flow schedule list <account> --include-handler-data
access(all) fun main(account: Address): [TransactionInfoWithHandler] {
    // Borrow the Manager
    let manager = FlowTransactionSchedulerUtils.borrowManager(at: account)
        ?? panic("Could not borrow Manager from account")
    
    let transactionIds = manager.getTransactionIDs()
    var transactions: [TransactionInfoWithHandler] = []
    
    // Get transaction data with handler views
    for id in transactionIds {
        if let txData = manager.getTransactionData(id) {
            // Borrow handler to get its UUID
            let handler = txData.borrowHandler()
            
            // Get handler views through the manager
            let availableViews = manager.getHandlerViewsFromTransactionID(id)
            var resolvedViews: {Type: AnyStruct} = {}
            
            for viewType in availableViews {
                if let resolvedView = manager.resolveHandlerViewFromTransactionID(id, viewType: viewType) {
                    resolvedViews[viewType] = resolvedView
                }
            }
            
            transactions.append(TransactionInfoWithHandler(
                data: txData,
                handlerUUID: handler.uuid,
                resolvedViews: resolvedViews
            ))
        }
    }
    
    return transactions
}
`
}

const getTransactionQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}

access(all) struct TransactionInfo {
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address
    
    init(data: FlowTransactionScheduler.TransactionData) {
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress
    }
}

/// Gets a transaction by ID (checks globally, not manager-specific)
/// This script is used by: flow schedule get <transaction-id>
access(all) fun main(transactionId: UInt64): TransactionInfo? {
    // Get transaction data directly from FlowTransactionScheduler
    if let txData = FlowTransactionScheduler.getTransactionData(id: transactionId) {
        return TransactionInfo(data: txData)
    }
    return nil
}
`
}

const getTransactionWithHandlerQuery = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionScheduler from ${contractAddresses.FlowTransactionScheduler}

access(all) struct TransactionInfoWithHandler {
    access(all) let id: UInt64
    access(all) let priority: UInt8
    access(all) let executionEffort: UInt64
    access(all) let status: UInt8
    access(all) let fees: UFix64
    access(all) let scheduledTimestamp: UFix64
    access(all) let handlerTypeIdentifier: String
    access(all) let handlerAddress: Address
    
    access(all) let handlerUUID: UInt64
    access(all) let handlerResolvedViews: {Type: AnyStruct}
    
    init(data: FlowTransactionScheduler.TransactionData, handlerUUID: UInt64, resolvedViews: {Type: AnyStruct}) {
        // Initialize transaction fields
        self.id = data.id
        self.priority = data.priority.rawValue
        self.executionEffort = data.executionEffort
        self.status = data.status.rawValue
        self.fees = data.fees
        self.scheduledTimestamp = data.scheduledTimestamp
        self.handlerTypeIdentifier = data.handlerTypeIdentifier
        self.handlerAddress = data.handlerAddress
        
        self.handlerUUID = handlerUUID
        self.handlerResolvedViews = resolvedViews
    }
}

/// Gets a transaction by ID with handler data (checks globally, not manager-specific)
/// This script is used by: flow schedule get <transaction-id> --include-handler-data
access(all) fun main(transactionId: UInt64): TransactionInfoWithHandler? {
    // Get transaction data directly from FlowTransactionScheduler
    if let txData = FlowTransactionScheduler.getTransactionData(id: transactionId) {
        // Borrow handler and resolve views
        let handler = txData.borrowHandler()
        let availableViews = handler.getViews()
        var resolvedViews: {Type: AnyStruct} = {}
        
        for viewType in availableViews {
            if let resolvedView = handler.resolveView(viewType) {
                resolvedViews[viewType] = resolvedView
            }
        }
        
        return TransactionInfoWithHandler(
            data: txData,
            handlerUUID: handler.uuid,
            resolvedViews: resolvedViews
        )
    }
    
    return nil
}
`
}

const setupManagerMutation = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}

/// Sets up a Manager resource in the signer's account if not already done
/// This transaction is used by: flow schedule setup [--signer account]
transaction() {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, PublishCapability) &Account) {
        // Save a manager resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: FlowTransactionSchedulerUtils.managerStoragePath) == nil {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)
        }

        // Create a capability for the Manager
        let managerCap = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
        signer.capabilities.publish(managerCap, at: FlowTransactionSchedulerUtils.managerPublicPath)
    }
}
`
}

const cancelTransactionMutation = (chainId: string) => {
  const contractAddresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!contractAddresses) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  return `
import FlowTransactionSchedulerUtils from ${contractAddresses.FlowTransactionSchedulerUtils}
import FlowToken from ${contractAddresses.FlowToken}
import FungibleToken from ${contractAddresses.FungibleToken}

/// Cancels a scheduled transaction by ID
/// This transaction is used by: flow schedule cancel <transaction-id> [--signer account]
transaction(transactionId: UInt64) {
    let manager: auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}
    let receiverRef: &{FungibleToken.Receiver}
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow the Manager with Owner entitlement
        self.manager = signer.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(
            from: FlowTransactionSchedulerUtils.managerStoragePath
        ) ?? panic("Could not borrow Manager with Owner entitlement from account")
        
        // Get receiver reference from signer's account
        self.receiverRef = signer.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference")
    }
    
    execute {
        // Cancel the transaction and receive refunded fees
        let refundedFees <- self.manager.cancel(id: transactionId)
        
        // Deposit refunded fees back to the signer's vault
        self.receiverRef.deposit(from: <-refundedFees)
    }
}
`
}

const convertTransactionInfo = (data: any): TransactionInfo => {
  return {
    id: BigInt(data.id || 0),
    priority: Number(data.priority || 0) as TransactionPriority,
    executionEffort: BigInt(data.executionEffort || 0),
    status: Number(data.status || 0) as TransactionStatus,
    fees: {
      value: parseUnits(data.fees || "0.0", CADENCE_UFIX64_PRECISION),
      formatted: data.fees || "0.0",
    },
    scheduledTimestamp: Number(data.scheduledTimestamp || 0),
    handlerTypeIdentifier: data.handlerTypeIdentifier || "",
    handlerAddress: data.handlerAddress || "",
  }
}

const convertTransactionInfoWithHandler = (
  data: any
): TransactionInfoWithHandler => {
  return {
    id: BigInt(data.id || 0),
    priority: Number(data.priority || 0) as TransactionPriority,
    executionEffort: BigInt(data.executionEffort || 0),
    status: Number(data.status || 0) as TransactionStatus,
    fees: {
      value: parseUnits(data.fees || "0.0", CADENCE_UFIX64_PRECISION),
      formatted: data.fees || "0.0",
    },
    scheduledTimestamp: Number(data.scheduledTimestamp || 0),
    handlerTypeIdentifier: data.handlerTypeIdentifier || "",
    handlerAddress: data.handlerAddress || "",
    handlerUUID: BigInt(data.handlerUUID || 0),
    handlerResolvedViews: data.handlerResolvedViews || {},
  }
}

/**
 * Hook for interacting with the Flow Transaction Scheduler, allowing users to schedule,
 * manage, and cancel scheduled transactions.
 * @param {UseFlowScheduleArgs} args - Optional arguments including a custom Flow client
 * @returns {UseFlowScheduleResult} An object containing functions to setup, list, get, and cancel scheduled transactions
 */
export function useFlowSchedule({
  flowClient,
}: UseFlowScheduleArgs = {}): UseFlowScheduleResult {
  const fcl = useFlowClient({flowClient})
  const chainIdResult = useFlowChainId()
  const chainId = chainIdResult.data
  const setupMutation = useFlowMutate({flowClient})
  const cancelMutation = useFlowMutate({flowClient})

  // List function -> Lists all transactions for an account
  const list = useCallback(
    async (
      account: string,
      options?: {includeHandlerData?: boolean}
    ): Promise<TransactionInfo[] | TransactionInfoWithHandler[]> => {
      if (!account) {
        throw new Error("Account address is required")
      }

      if (!account.startsWith("0x")) {
        throw new Error("Account address must start with 0x")
      }

      if (!chainId) {
        throw new Error("Chain ID not detected")
      }

      try {
        const cadence = options?.includeHandlerData
          ? listTransactionsWithHandlerQuery(chainId)
          : listTransactionsQuery(chainId)

        const result = await fcl.query({
          cadence,
          args: () => [arg(account, t.Address)],
        })

        if (!Array.isArray(result)) {
          return []
        }

        return options?.includeHandlerData
          ? result.map(convertTransactionInfoWithHandler)
          : result.map(convertTransactionInfo)
      } catch (error: any) {
        const message = error?.message || "Unknown error"
        throw new Error(`Failed to list transactions: ${message}`)
      }
    },
    [fcl, chainId]
  )

  // Get function -> Gets a specific transaction by ID
  const get = useCallback(
    async (
      transactionId: bigint,
      options?: {includeHandlerData?: boolean}
    ): Promise<TransactionInfo | TransactionInfoWithHandler | null> => {
      if (!chainId) {
        throw new Error("Chain ID not detected")
      }

      try {
        const cadence = options?.includeHandlerData
          ? getTransactionWithHandlerQuery(chainId)
          : getTransactionQuery(chainId)

        const result = await fcl.query({
          cadence,
          args: () => [arg(transactionId.toString(), t.UInt64)],
        })

        if (!result) {
          return null
        }

        return options?.includeHandlerData
          ? convertTransactionInfoWithHandler(result)
          : convertTransactionInfo(result)
      } catch (error: any) {
        const message = error?.message || "Unknown error"
        throw new Error(`Failed to get transaction: ${message}`)
      }
    },
    [fcl, chainId]
  )

  // Setup function -> Creates manager resource if not exists
  const setup = useCallback(async (): Promise<string> => {
    if (!chainId) {
      throw new Error("Chain ID not detected")
    }
    try {
      const result = await setupMutation.mutateAsync({
        cadence: setupManagerMutation(chainId),
        args: () => [],
      })
      return result
    } catch (error: any) {
      const message = error?.message || "Unknown error"
      throw new Error(`Failed to setup manager: ${message}`)
    }
  }, [setupMutation, chainId])

  // Cancel function -> Cancels a scheduled transaction
  const cancel = useCallback(
    async (transactionId: bigint): Promise<string> => {
      if (!chainId) {
        throw new Error("Chain ID not detected")
      }

      try {
        const result = await cancelMutation.mutateAsync({
          cadence: cancelTransactionMutation(chainId),
          args: () => [arg(transactionId.toString(), t.UInt64)],
        })
        return result
      } catch (error: any) {
        const message = error?.message || "Unknown error"
        throw new Error(`Failed to cancel transaction: ${message}`)
      }
    },
    [cancelMutation, chainId]
  )

  return {
    list,
    get,
    setup,
    cancel,
  }
}
