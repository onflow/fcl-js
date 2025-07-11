import {SdkTransport, SubscriptionTopic} from "@onflow/typedefs"
import {invariant} from "@onflow/util-invariant"
import {SubscribeRawParams} from "./types"
import {SdkContext} from "../../context/context"
import {getGlobalContext} from "../../context/global"

export function createSubscribeRawAsync(
  contextPromise: Promise<SdkContext> | SdkContext
) {
  /**
   * Subscribe to a topic without decoding the data.
   * @param params - The parameters for the subscription.
   * @param opts - Additional options for the subscription.
   * @returns A promise that resolves once the subscription is active.
   */
  function subscribeRaw<T extends SubscriptionTopic>(
    {topic, args, onData, onError}: SubscribeRawParams<T>,
    opts: {
      node?: string
      transport?: SdkTransport
    } = {}
  ) {
    async function subscribe() {
      try {
        const transport = await getTransport(opts)
        const node =
          opts?.node || (await context.config().get("accessNode.api"))

        invariant(
          !!node,
          `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
        )

        // Subscribe using the resolved transport
        return transport.subscribe(
          {
            topic,
            args,
            onData,
            onError,
          },
          {
            node,
            ...opts,
          }
        )
      } catch (e) {
        onError(e instanceof Error ? e : new Error(String(e)))
        return
      }
    }

    let subscriptionPromise = subscribe()
    return {
      unsubscribe: () => {
        subscriptionPromise.then(sub => sub?.unsubscribe?.())
      },
    }
  }

  return subscribeRaw
}

export function createSubscribeRaw(context: SdkContext) {
  return createSubscribeRawAsync(context)
}

export function subscribeRaw<T extends SubscriptionTopic>(
  {topic, args, onData, onError}: SubscribeRawParams<T>,
  opts: {
    node?: string
    transport?: SdkTransport
  } = {}
) {
  const contextPromise = getGlobalContext()
  return createSubscribeRawAsync(contextPromise)(
    {
      topic,
      args,
      onData,
      onError,
    },
    opts
  )
}
