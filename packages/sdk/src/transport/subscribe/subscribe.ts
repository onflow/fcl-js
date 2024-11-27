import {SdkTransport} from "@onflow/typedefs"
import {rawSubscribe} from "./raw-subscribe"
import {decodeResponse} from "../../decode/decode"

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
    transport?: SdkTransport.Transport
  } = {}
): Promise<SdkTransport.Subscription> {
  const sub = await rawSubscribe(
    {
      topic,
      args,
      onData: data => {
        decodeResponse(data)
          .then(onData)
          .catch(e => {
            onError(new Error(`Failed to subscription data: ${e}`))
            sub.unsubscribe()
          })
      },
      onError,
    },
    opts
  )

  return sub
}
