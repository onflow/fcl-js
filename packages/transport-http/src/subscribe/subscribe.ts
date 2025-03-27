import {
  SubscriptionTopic,
  SubscriptionArgs,
  Subscription,
  RawSubscriptionData,
} from "@onflow/typedefs"
import {SubscriptionManager} from "./subscription-manager"
import {blocksHandler} from "./handlers/blocks"
import {blockHeadersHandler} from "./handlers/block-headers"
import {blockDigestsHandler} from "./handlers/block-digests"
import {accountStatusesHandler} from "./handlers/account-statuses"
import {transactionStatusesHandler} from "./handlers/transaction-statuses"
import {eventsHandler} from "./handlers/events"

const SUBSCRIPTION_HANDLERS = [
  blocksHandler,
  blockHeadersHandler,
  blockDigestsHandler,
  accountStatusesHandler,
  transactionStatusesHandler,
  eventsHandler,
]

// Map of SubscriptionManager instances by access node URL
let subscriptionManagerMap: Map<
  string,
  SubscriptionManager<typeof SUBSCRIPTION_HANDLERS>
> = new Map()

export function subscribe<T extends SubscriptionTopic>(
  {
    topic,
    args,
    onData,
    onError,
  }: {
    topic: T
    args: SubscriptionArgs<T>
    onData: (data: RawSubscriptionData<T>) => void
    onError: (error: Error) => void
  },
  opts: {node: string}
): Subscription {
  // Get the SubscriptionManager instance for the access node, or create a new one
  const node = opts.node
  const manager =
    subscriptionManagerMap.get(node) ||
    new SubscriptionManager(SUBSCRIPTION_HANDLERS, {node})
  subscriptionManagerMap.set(node, manager)

  return manager.subscribe({
    topic,
    args,
    onData: onData as any,
    onError,
  })
}
