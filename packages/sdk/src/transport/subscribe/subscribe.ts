import {SdkTransport, Subscription, SubscriptionTopic} from "@onflow/typedefs"
import {subscribeRaw} from "./subscribe-raw"
import {decodeResponse} from "../../decode/decode"
import {SubscribeParams} from "./types"

/**
 * Subscribe to real-time data from the Flow blockchain and automatically decode the responses.
 *
 * This is a utility function used for subscribing to real-time data from the WebSocket Streaming API. Data returned will be automatically decoded via the 'decode' function.
 *
 * Available topics include: `events`, `blocks`, `block_headers`, `block_digests`, `transaction_statuses`, `account_statuses`.
 *
 * @param params The parameters for the subscription including topic, arguments, and callbacks
 * @param params.topic The subscription topic (e.g., 'events', 'blocks', 'transaction_statuses')
 * @param params.args Parameters specific to the topic (e.g., event types, block height, transaction ID)
 * @param params.onData Callback function called with decoded data when new messages are received
 * @param params.onError Callback function called if an error occurs during the subscription
 * @param opts Additional options for the subscription
 * @param opts.node Custom node endpoint to be used for the subscription
 * @param opts.transport Custom transport implementation for handling the connection
 * @returns A subscription object that allows you to manage the subscription (e.g., to unsubscribe later)
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 * import { SubscriptionTopic } from "@onflow/sdk";
 *
 * // Subscribe to events
 * const subscription = fcl.subscribe({
 *   topic: SubscriptionTopic.EVENTS,
 *   args: {
 *     eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"]
 *   },
 *   onData: (events) => {
 *     console.log("Received events:", events);
 *   },
 *   onError: (error) => {
 *     console.error("Subscription error:", error);
 *   }
 * });
 *
 * // Subscribe to blocks
 * const blockSubscription = fcl.subscribe({
 *   topic: SubscriptionTopic.BLOCKS,
 *   args: {
 *     blockStatus: "finalized"
 *   },
 *   onData: (block) => {
 *     console.log("New block:", block);
 *   },
 *   onError: (error) => {
 *     console.error("Block subscription error:", error);
 *   }
 * });
 *
 * // Later, to unsubscribe:
 * subscription.unsubscribe();
 * blockSubscription.unsubscribe();
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
