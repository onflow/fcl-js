import {config} from "@onflow/config"
import {httpTransport as defaultTransport} from "@onflow/transport-http"
import {SdkTransport} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {SubscriptionsNotSupportedError} from "./subscribe/errors"

/**
 * Get the SDK transport object, either from the provided override or from the global config.
 *
 * The transport object handles communication with Flow Access Nodes, including sending transactions,
 * executing scripts, and managing subscriptions. This function resolves the transport configuration
 * from various sources with the following priority order:
 * 1. Provided override parameters
 * 2. Global SDK configuration
 * 3. Default HTTP transport
 *
 * @param override Override default configuration with custom transport or send function
 * @param override.send Custom send function for backwards compatibility with legacy configurations
 * @param override.transport Complete transport object with both send and subscribe capabilities
 * @returns The resolved SDK transport object with send and subscribe methods
 *
 * @throws {Error} When both transport and send options are provided simultaneously
 * @throws {SubscriptionsNotSupportedError} When attempting to subscribe using a legacy send-only transport
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { httpTransport } from "@onflow/transport-http";
 *
 * // Get default transport (usually HTTP transport)
 * const defaultTransport = await fcl.getTransport();
 *
 * // Override with custom transport
 * const customTransport = await fcl.getTransport({
 *   transport: httpTransport({
 *     accessNode: "https://rest-mainnet.onflow.org",
 *     timeout: 10000
 *   })
 * });
 */
export async function getTransport(
  override: {
    send?: SdkTransport["send"]
    transport?: SdkTransport
  } = {}
): Promise<SdkTransport> {
  invariant(
    override.send == null || override.transport == null,
    `SDK Transport Error: Cannot provide both "transport" and legacy "send" options.`
  )

  const transportOrSend =
    override.transport ||
    override.send ||
    (await config().first<SdkTransport | SdkTransport["send"]>(
      ["sdk.transport", "sdk.send"],
      defaultTransport
    ))

  // Backwards compatibility with legacy send function
  if (!isTransportObject(transportOrSend)) {
    return {
      send: transportOrSend,
      subscribe: () => {
        throw new SubscriptionsNotSupportedError()
      },
    }
  }

  return transportOrSend
}

function isTransportObject(transport: any): transport is SdkTransport {
  return (
    transport.send !== undefined &&
    transport.subscribe !== undefined &&
    typeof transport.send === "function" &&
    typeof transport.subscribe === "function"
  )
}
