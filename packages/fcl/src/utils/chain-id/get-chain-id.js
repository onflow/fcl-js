import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {fetchChainId} from "./fetch-chain-id"

// Cache chainId promise and access node it was resolved from
let chainIdAccessNode = null
let chainIdPromise = null

/**
 * @description
 * Gets the chain ID if its set, otherwise gets the chain ID from the access node
 *
 * @returns {Promise<string>} The chain ID of the access node
 * @throws {Error} If the chain ID is not found
 *
 * @example
 * // returns "testnet"
 * getChainId()
 */
export async function getChainId() {
  let network
  const accessNode = await config.get("accessNode.api")

  // Try using cached chainId first if it exists and access node is the same
  if (chainIdPromise && chainIdAccessNode === accessNode) {
    try {
      network = await chainIdPromise
    } catch {}
  }

  // If no cached chainId, value is stale, or last attempt failed, try getting chainId from access node
  if (!network) {
    // Check if another getChainId() call has already started a new promise, if not, start a new one
    // There may have been concurrent calls to getChainId() while the first call was waiting for the response
    if (!chainIdPromise || chainIdAccessNode !== accessNode) {
      chainIdAccessNode = accessNode
      chainIdPromise = fetchChainId().catch(error => {
        // If there was an error, reset the promise so that the next call will try again
        chainIdPromise = null
        throw error
      })
    }

    try {
      network = await chainIdPromise
    } catch {}
  }

  // If chain id still not found, try using flow.network
  if (!network) {
    network = await config.get("flow.network")
    if (network) {
      log.deprecate({
        pkg: "FCL",
        subject:
          'Using the "flow.network" configuration key for specifying the flow network',
        message: "Configuring flow.network is no longer required",
        transition:
          "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0002-deprecate-flow.network-config-key",
      })
    } else {
      network = await config.get("env")

      if (network)
        log.deprecate({
          pkg: "FCL",
          subject:
            'Using the "env" configuration key for specifying the flow network',
          message: "Configuring to specify flow network is no longer required",
          transition:
            "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0001-deprecate-env-config-key",
        })
    }
  }

  invariant(
    network,
    "Error getting chainId from access node. Please configure flow.network instead" +
      (accessNode ? ` for access node ${accessNode}` : "") +
      "." +
      (await config.get("flow.network"))
  )

  return network
}

/**
 * @description
 * Clears the chainId cache, useful for testing
 */
export function clearChainIdCache() {
  chainIdAccessNode = null
  chainIdPromise = null
}
