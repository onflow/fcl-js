import {config} from "@onflow/config"
import {SdkTransport} from "@onflow/typedefs"
import {getTransport} from "./transport"
import {invariant} from "@onflow/util-invariant"

// TODO: OPTS FUNCTION
export async function subscribe<T extends SdkTransport.SubscriptionTopic>(
  {
    topic,
    args,
    onData,
    onError,
  }: {
    topic: T
    args: SdkTransport.SubscriptionArguments<T>
    onData: (data: SdkTransport.SubscriptionData<T>) => void
    onError: (error: Error) => void
  },
  opts: {
    node?: string
    send?: SdkTransport.SendFn
    transport?: SdkTransport.Transport
  } = {}
) {
  const transport = await getTransport(opts)
  const node = opts?.node || (await config().get("accessNode.api"))

  invariant(
    !!node,
    `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
  )

  // TODO: handle onError
  // Subscribe using the resolved transport
  return transport.subscribe(
    {
      topic,
      args,
      onData: data => {
        // TODO: decode function
        onData(decode(topic, data))
      },
      onError,
    },
    {
      node,
      ...opts,
    }
  )
}

export function decode<T extends SdkTransport.SubscriptionTopic>(
  topic: T,
  data: SdkTransport.SubscriptionData<T>
): any {
  return data
}
