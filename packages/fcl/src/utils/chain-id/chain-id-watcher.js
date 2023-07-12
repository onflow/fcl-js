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
  let prevAccessNode
  return config.subscribe(config => {
    // Call getChainId to update the chainId cache if access node has changed
    const newAccessNode = config?.["accessNode.api"]
    if (prevAccessNode !== newAccessNode) {
      getChainId().catch(() => {})
    }
    prevAccessNode = newAccessNode
  })
}
