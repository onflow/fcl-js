import * as sdk from "@onflow/sdk"
import {config} from "@onflow/config"
import {log} from "@onflow/util-logger"
import { invariant } from "@onflow/util-invariant"

async function getChainIdFromAccessNode() {
  const response = await sdk.send([sdk.getNetworkParameters()]).then(sdk.decode)
  return response.chainId
}

/**
 * Sets the default chain id to the chain id of the access node
 * 
 * @returns {string} The chain id of the access node
 * 
 * @example
 * // returns "testnet"
 * setChainIdDefault()
 */
export async function setChainIdDefault() {
  const network = await getChainIdFromAccessNode()
  config.put("flow.network.default", network)
  return network
}

/**
 * Gets the chain ID if its set, otherwise gets the chain ID from the access node
 * 
 * @returns {string} The chain ID of the access node
 * 
 * @throws {Error} If the chain ID is not found
 * 
 * @example
 * // returns "testnet"
 * getChainId()
 */
export async function getChainId() {
  let network = await config.get("flow.network.default")

  if (!network) {
    network = await setChainIdDefault()

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
            message:
              "Configuring to specify flow network is no longer required",
            transition:
              "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0001-deprecate-env-config-key",
          })
      }
    }
  }

  invariant(
    network,
    "Error getting chainId from access node. Please configure flow.network instead"
  )

  return network
}
