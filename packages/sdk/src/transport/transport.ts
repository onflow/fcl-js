import {config} from "@onflow/config"
import {httpTransport as defaultTransport} from "@onflow/transport-http"
import {SdkTransport} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"

export async function getTransport(
  opts: {
    send?: SdkTransport.SendFn
    transport?: SdkTransport.Transport
  } = {}
): Promise<SdkTransport.Transport> {
  invariant(
    opts.send == null || opts.transport == null,
    `SDK Transport Error: Cannot provide both "transport" and legacy "send" options.`
  )

  const transportOrSend = await config().first<
    SdkTransport.Transport | SdkTransport.SendFn
  >(
    ["sdk.transport", "sdk.send"],
    opts.transport || opts.send || defaultTransport
  )

  if (isTransportObject(transportOrSend)) {
    // This is a transport object, return it directly
    return transportOrSend
  } else {
    // This is a legacy send function, wrap it in a transport object
    return {
      send: transportOrSend,
      subscribe: () => {
        throw new Error(
          "Subscribe not supported with legacy send function transport, please provide a transport object."
        )
      },
    }
  }
}

function isTransportObject(
  transport: any
): transport is SdkTransport.Transport {
  return transport.send !== undefined && transport.subscribe !== undefined
}
