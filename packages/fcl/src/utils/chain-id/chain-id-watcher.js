import {config} from "@onflow/config"
import {getChainId} from "./get-chain-id"

/**
 * @description
 * Watches the config for changes to access node and updates the chain id accordingly
 *
 * @returns {Function} A function that unsubscribes the listener
 *
 */
export function watchForChainIdChanges() {
  return config.subscribe(() => {
    // Call getChainId to update the chainId cache if access node has changed
    getChainId({
      enableRequestLogging: false,
    }).catch(() => {})
  })
}
