import {createGetChainId} from "./get-chain-id"
import {FCLContext} from "../../context"

/**
 * @description Watches the FCL configuration for changes to the access node and automatically updates
 * the chain ID cache accordingly. This ensures that chain ID information stays current when the
 * access node configuration changes, preventing stale chain ID data from being used.
 *
 * @returns A function that can be called to unsubscribe the configuration listener
 *
 * @example
 * // Start watching for chain ID changes
 * import * as fcl from "@onflow/fcl"
 *
 * const unsubscribe = fcl.watchForChainIdChanges()
 *
 * // Later, when you want to stop watching
 * unsubscribe()
 */
export function watchForChainIdChanges(
  context: Pick<FCLContext, "config" | "sdk">
): () => void {
  return context.config.subscribe(() => {
    // Call getChainId to update the chainId cache if access node has changed
    createGetChainId(context)({
      enableRequestLogging: false,
    }).catch(() => {})
  })
}
