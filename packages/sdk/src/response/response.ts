const DEFAULT_RESPONSE = {
  tag: null,
  transaction: null,
  transactionStatus: null,
  transactionId: null,
  encodedData: null,
  events: null,
  event: null,
  accountStatusEvent: null,
  account: null,
  block: null,
  blockHeader: null,
  blockDigest: null,
  latestBlock: null,
  collection: null,
  networkParameters: null,
  streamConnection: null,
  heartbeat: null,
  nodeVersionInfo: null,
}

/**
 * Creates a default response object
 *
 * @returns A default response object
 *
 * @example
 * import { response } from "@onflow/sdk"
 *
 * // Create a default response object
 * const defaultResponse = response();
 * console.log(defaultResponse.transaction); // null
 * console.log(defaultResponse.account); // null
 * console.log(defaultResponse.block); // null
 *
 * // Typically used internally by the SDK to initialize responses
 * // You'll rarely need to use this directly in application code
 */
export const response = () => ({...DEFAULT_RESPONSE})
