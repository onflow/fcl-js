import {config} from "@onflow/config"
import {fetchChainId} from "./fetch-chain-id"
import {log} from "@onflow/util-logger"

// Cache of chainId promises for each access node value
// key: access node, value: chainId promise
let chainIdCache = {}

let hasWarnedFlowNetwork = false
let hasWarnedEnv = false

/**
 * @description
 * Gets the chain ID if its set, otherwise gets the chain ID from the access node
 *
 * @param {object} opts - Optional parameters
 * @returns {Promise<string>} The chain ID of the access node
 * @throws {Error} If the chain ID is not found
 *
 * @example
 * // returns "testnet"
 * getChainId()
 */
export async function getChainId(opts = {}) {
  let flowNetworkCfg = await config.get("flow.network")
  let envCfg = await config.get("env")

  /* 
    TODO: Add deprecation warning for flow.network config key
    Remove this if statement when deprecation is complete

    config.load() depends on flow.network config key even though this deprecation
    warning has been available since https://github.com/onflow/fcl-js/pull/1420
    it has effectively never been shown because of an issue in the implementation
    of getChainId()

    Showing this warning is the correct and intended behavior, but it would lead to
    mixed messaging for users since config.load() depends on flow.network config key

    We need to remove the dependency on flow.network config key from config.load()
    before we can show this warning.
  */
  if (false && flowNetworkCfg && !hasWarnedFlowNetwork) {
    log.deprecate({
      pkg: "FCL",
      subject:
        'Using the "flow.network" configuration key for specifying the flow network',
      message: "Configuring flow.network is no longer required",
      transition:
        "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0002-deprecate-flow.network-config-key",
    })
    hasWarnedFlowNetwork = true
  }

  if (envCfg && !hasWarnedEnv) {
    log.deprecate({
      pkg: "FCL",
      subject:
        'Using the "env" configuration key for specifying the flow network',
      message: "Configuring to specify flow network is no longer required",
      transition:
        "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0001-deprecate-env-config-key",
    })
    hasWarnedEnv = true
  }

  const accessNode = opts.node || (await config.get("accessNode.api"))
  if (!accessNode) {
    // Fall back to deprecated flow.network and env config keys
    // This probably should have been done before trying to fetch the chainId from the access node
    // However, this was the behaviour with the initial implementation of getChainId()
    if (flowNetworkCfg) {
      return flowNetworkCfg
    } else if (envCfg) {
      return envCfg
    }

    throw new Error(
      `Either the "accessNode.api" config key or opts.node must be set`
    )
  }

  // Try using cached chainId first if it exists and access node is the same
  if (chainIdCache[accessNode]) {
    try {
      return await chainIdCache[accessNode]
    } catch {}
  }

  // If no cached chainId, value is stale, or last attempt failed, try getting chainId from access node
  // Check if another getChainId() call has already started a new promise, if not, start a new one
  // There may have been concurrent calls to getChainId() while the first call was waiting for the response
  if (!chainIdCache[accessNode]) {
    chainIdCache[accessNode] = fetchChainId(opts).catch(error => {
      // If there was an error, reset the promise so that the next call will try again
      chainIdCache[accessNode] = null
      throw error
    })
  }

  // Use newly created promise
  try {
    return await chainIdCache[accessNode]
  } catch (e) {
    // Fall back to deprecated flow.network and env config keys
    // This probably should have been done before trying to fetch the chainId from the access node
    // However, this was the behaviour with the initial implementation of getChainId()
    if (flowNetworkCfg) {
      return flowNetworkCfg
    } else if (envCfg) {
      return envCfg
    }

    throw new Error(
      `Error getting chainId from access node - are you using the correct access node endpoint.  If running locally, is your emulator up-to-date? ${e.message}`
    )
  }
}

/**
 * @description
 * Clears the chainId cache, useful for testing
 */
export function clearChainIdCache() {
  chainIdCache = {}
}
