import {TransactionStatus} from "@onflow/typedefs"

/**
 * @description Checks if a transaction has expired based on its status code.
 * A transaction is considered expired when its status equals 5.
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction has expired, false otherwise
 *
 * @example
 * // Check if a transaction has expired
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isExpired(txStatus)) {
 *   console.log("Transaction has expired")
 * }
 */
export const isExpired = (tx: TransactionStatus) => tx.status === 5

/**
 * @description Checks if a transaction has been sealed. A transaction is sealed when it has been
 * included in a block and finalized on the blockchain (status >= 4).
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction is sealed, false otherwise
 *
 * @example
 * // Wait for transaction to be sealed
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isSealed(txStatus)) {
 *   console.log("Transaction is sealed and finalized")
 * }
 */
export const isSealed = (tx: TransactionStatus) => tx.status >= 4

/**
 * @description Checks if a transaction has been executed. A transaction is executed when it has
 * been processed by the blockchain network (status >= 3).
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction has been executed, false otherwise
 *
 * @example
 * // Check if transaction has been executed
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isExecuted(txStatus)) {
 *   console.log("Transaction has been executed")
 * }
 */
export const isExecuted = (tx: TransactionStatus) => tx.status >= 3

/**
 * @description Checks if a transaction has been finalized. A transaction is finalized when it has
 * been included in a block (status >= 2).
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction has been finalized, false otherwise
 *
 * @example
 * // Check if transaction has been finalized
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isFinalized(txStatus)) {
 *   console.log("Transaction has been finalized")
 * }
 */
export const isFinalized = (tx: TransactionStatus) => tx.status >= 2

/**
 * @description Checks if a transaction is pending. A transaction is pending when it has been
 * submitted to the network but not yet processed (status >= 1).
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction is pending, false otherwise
 *
 * @example
 * // Check if transaction is still pending
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isPending(txStatus)) {
 *   console.log("Transaction is still pending")
 * }
 */
export const isPending = (tx: TransactionStatus) => tx.status >= 1

/**
 * @description Checks if a transaction status is unknown. A transaction has unknown status when
 * it hasn't been processed yet or there's no information available (status >= 0).
 *
 * @param tx The transaction status object to check
 * @returns True if the transaction status is unknown, false otherwise
 *
 * @example
 * // Check if transaction status is unknown
 * const txStatus = await fcl.tx(transactionId).snapshot()
 * if (isUnknown(txStatus)) {
 *   console.log("Transaction status is unknown")
 * }
 */
export const isUnknown = (tx: TransactionStatus) => tx.status >= 0

/**
 * @description Performs a deep equality comparison between two values. This function recursively
 * compares all properties of objects and arrays to determine if they are equal.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @returns True if the values are deeply equal, false otherwise
 *
 * @example
 * // Compare two objects
 * const obj1 = { name: "Flow", version: "1.0" }
 * const obj2 = { name: "Flow", version: "1.0" }
 * console.log(deepEqual(obj1, obj2)) // true
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object") return false
  if (Object.keys(a).length !== Object.keys(b).length) return false
  for (const key in a) if (!deepEqual(a[key], b[key])) return false
  return true
}

/**
 * @description Checks if two values are different by performing a deep equality comparison.
 * This is the inverse of the deepEqual function.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @returns True if the values are different, false if they are equal
 *
 * @example
 * // Check if objects are different
 * const obj1 = { name: "Flow", version: "1.0" }
 * const obj2 = { name: "Flow", version: "2.0" }
 * console.log(isDiff(obj1, obj2)) // true
 */
export const isDiff = (a: any, b: any): boolean => {
  return !deepEqual(a, b)
}

/**
 * @description Extracts a transaction ID from either a string or an object containing a transactionId property.
 * This utility function handles both formats and ensures a valid transaction ID is returned.
 *
 * @param transactionId Either a transaction ID string or an object with a transactionId property
 * @returns The transaction ID as a string
 * @throws If transactionId is null, undefined, or invalid
 *
 * @example
 * // Extract from string
 * const txId = scoped("abc123def456")
 * console.log(txId) // "abc123def456"
 */
export const scoped = (
  transactionId:
    | string
    | {
        transactionId: string
      }
) => {
  if (typeof transactionId === "object")
    transactionId = transactionId.transactionId
  if (transactionId == null) throw new Error("transactionId required")
  return transactionId
}
