import {SdkTransport, Subscription, SubscriptionTopic} from "@onflow/typedefs"
import {createSubscribeRawAsync} from "./subscribe-raw"
import {decodeResponse} from "../../decode/decode"
import {SubscribeParams} from "./types"
import {SdkContext} from "../../context/context"
import {getGlobalContext} from "../../context/global"

export function createSubscribeAsync(
  contextPromise: Promise<SdkContext> | SdkContext
) {
  /**
   * Subscribe to a topic and decode the data.
   * @param params - The parameters for the subscription.
   * @param opts - Additional options for the subscription.
   * @returns A promise that resolves when the subscription is active.
   */
  function subscribe<T extends SubscriptionTopic>(
    {topic, args, onData, onError}: SubscribeParams<T>,
    opts: {
      node?: string
      transport?: SdkTransport
    } = {}
  ): Subscription {
    const sub = createSubscribeRawAsync(contextPromise)(
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

  return subscribe
}

export function createSubscribe(context: SdkContext) {
  return createSubscribeAsync(context)
}

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
  const contextPromise = getGlobalContext()
  const sub = createSubscribeRawAsync(contextPromise)(
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
