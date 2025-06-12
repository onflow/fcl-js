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
 */
export const response = () => ({...DEFAULT_RESPONSE})
