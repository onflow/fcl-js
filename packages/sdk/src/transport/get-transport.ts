import {config} from "@onflow/config"
import {httpTransport as defaultTransport} from "@onflow/transport-http"
import {SdkTransport} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {SubscriptionsNotSupportedError} from "./subscribe/errors"

/**
 * Get the SDK transport object, either from the provided override or from the global config.
 * @param overrides - Override default configuration with custom transport or send function.
 * @returns The SDK transport object.
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
