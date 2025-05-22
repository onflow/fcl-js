import {SdkTransport, Subscription, SubscriptionTopic} from "@onflow/typedefs"
import {subscribeRaw} from "./raw-subscribe"
import {decodeResponse} from "../../decode/decode"
import {SubscribeParams} from "./types"

/**
 * Subscribe to a topic and decode the data.
 * @param params - The parameters for the subscription.
 * @param opts - Additional options for the subscription.
 * @returns A promise that resolves when the subscription is active.
 */
export function subscribe<T extends SubscriptionTopic>(
  {topic, args, onData, onError}: SubscribeParams<T>,
  opts: {
    node?: string
    transport?: SdkTransport
  } = {}
): Subscription {
  const sub = subscribeRaw(
    {
      topic,
      args,
      onData: data => {
        decodeResponse(data)
          .then(onData)
          .catch(e => {
            onError(new Error(`Failed to decode response: ${e.message}`))
            sub?.unsubscribe?.()
          })
      },
      onError,
    },
    opts
  )

  return sub
}
