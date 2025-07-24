import {FCLContext} from "./index"
import {config as _config} from "@onflow/config"
import {
  send,
  decode,
  subscribe,
  subscribeRaw,
  account,
  block,
  resolve,
} from "@onflow/sdk"
import {getServiceRegistry} from "../current-user/exec-service/plugins"

/**
 * Note to self:
 * Create the partial context
 * Then you need to make functions take only the necessary parts of the context
 * This way you can avoid the issue where the subtype does not satisfy the args
 */

/**
 * Create a global FCL Context based on the current global config.
 *
 * Some configuration values are still curried to the context as a backward compatibility measure.
 */
export function createPartialGlobalFCLContext(): Pick<
  FCLContext,
  "config" | "sdk" | "serviceRegistry"
> {
  return {
    config: _config(),
    sdk: {
      send,
      decode,
      subscribe,
      subscribeRaw,
      account,
      block,
      resolve,
    },
    serviceRegistry: getServiceRegistry(),
  }
}
