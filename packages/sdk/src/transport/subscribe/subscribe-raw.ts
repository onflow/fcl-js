import {config} from "@onflow/config"
import {SdkTransport, SubscriptionTopic} from "@onflow/typedefs"
import {getTransport} from "../get-transport"
import {invariant} from "@onflow/util-invariant"
import {SubscribeRawParams} from "./types"

/**
 * Subscribe to a topic without decoding the data.
 * @param params - The parameters for the subscription.
 * @param opts - Additional options for the subscription.
 * @returns A promise that resolves once the subscription is active.
 */
export function subscribeRaw<T extends SubscriptionTopic>(
  {topic, args, onData, onError}: SubscribeRawParams<T>,
  opts: {
    node?: string
    transport?: SdkTransport
  } = {}
) {
  async function subscribe() {
    let transport: SdkTransport
    let node: string

    try {
      transport = await getTransport(opts)
      node = opts?.node || (await config().get("accessNode.api"))

      invariant(
        !!node,
        `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
      )
    } catch (e) {
      onError(e instanceof Error ? e : new Error(String(e)))
      return
    }

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
  }

  let subscriptionPromise = subscribe()
  return {
    unsubscribe: () => {
      subscriptionPromise.then(sub => sub?.unsubscribe?.())
    },
  }
}
