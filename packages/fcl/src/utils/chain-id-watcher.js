import {config} from "@onflow/config"
import {setChainIdDefault} from "./get-chain-id"

/**
 * @description
 * Watches the config for changes to access node and updates the chain id accordingly
 *
 * @returns {Function} A function that unsubscribes the listener
 *
 */
export function watchForChainIdChanges() {
  return config.subscribe(
    function configSubscriber(config) {
      const nextAccessNode = config?.["accessNode.api"]
      if (this.prevAccessNode !== nextAccessNode) {
        setChainIdDefault()
      }
      this.prevAccessNode = nextAccessNode
    }.bind({})
  )
}
