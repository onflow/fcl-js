import {config} from "@onflow/config"
import {SdkTransport, SubscriptionTopic} from "@onflow/typedefs"
import {getTransport} from "../get-transport"
import {invariant} from "@onflow/util-invariant"
import {SubscribeRawParams} from "./types"

/**
 * Subscribe to a topic without decoding the data.
 *
 * This function creates a raw subscription to Flow blockchain data streams without automatic decoding.
 * It's useful when you need more control over data processing or want to handle raw responses directly.
 * For most use cases, consider using the `subscribe()` function instead which provides automatic decoding.
 *
 * Available topics include: `events`, `blocks`, `block_headers`, `block_digests`, `transaction_statuses`, `account_statuses`.
 *
 * @param params The parameters for the subscription including topic, arguments, and callbacks
 * @param params.topic The subscription topic (e.g., 'events', 'blocks', 'transaction_statuses')
 * @param params.args Parameters specific to the topic (e.g., event types, block height, transaction ID)
 * @param params.onData Callback function called with raw data when new messages are received
 * @param params.onError Callback function called if an error occurs during the subscription
 * @param opts Additional options for the subscription
 * @param opts.node Custom node endpoint to be used for the subscription
 * @param opts.transport Custom transport implementation for handling the connection
 * @returns A subscription object with an unsubscribe method
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { SubscriptionTopic } from "@onflow/sdk";
 *
 * // Subscribe to raw event data without automatic decoding
 * const rawSubscription = fcl.subscribeRaw({
 *   topic: SubscriptionTopic.EVENTS,
 *   args: {
 *     eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"]
 *   },
 *   onData: (rawData) => {
 *     console.log("Raw event data:", rawData);
 *     // Handle raw data manually - no automatic decoding
 *   },
 *   onError: (error) => {
 *     console.error("Raw subscription error:", error);
 *   }
 * });
 *
 * // Subscribe to raw block data
 * const blockSubscription = fcl.subscribeRaw({
 *   topic: SubscriptionTopic.BLOCKS,
 *   args: {
 *     blockStatus: "finalized"
 *   },
 *   onData: (rawBlock) => {
 *     console.log("Raw block data:", rawBlock);
 *   },
 *   onError: (error) => {
 *     console.error("Error:", error);
 *   }
 * });
 *
 * // Unsubscribe when done
 * rawSubscription.unsubscribe();
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
