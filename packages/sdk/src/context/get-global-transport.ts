import {httpTransport as defaultTransport} from "@onflow/transport-http"
import {SdkTransport} from "@onflow/typedefs"
import {SubscriptionsNotSupportedError} from "../transport/subscribe/errors"

/**
 * Get the SDK transport object, either from the provided override or from the global config.
 * @param overrides - Override default configuration with custom transport or send function.
 * @returns The SDK transport object.
 */
export function getGlobalTransport(cfg: Record<string, any>): SdkTransport {
  const transportOrSend = (cfg["sdk.transport"] ||
    cfg["sdk.send"] ||
    defaultTransport) as SdkTransport | SdkTransport["send"]

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
