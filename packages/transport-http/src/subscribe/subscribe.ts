import {SdkTransport} from "@onflow/typedefs"
import {SubscriptionManager} from "./subscription-manager"

// Map of SubscriptionManager instances by access node URL
let subscriptionManagerMap: Map<string, SubscriptionManager> = new Map()

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
  opts: {node: string}
): Promise<SdkTransport.Subscription> {
  const manager =
    subscriptionManagerMap.get(opts.node) ||
    new SubscriptionManager({
      node: opts.node,
    })
  subscriptionManagerMap.set(opts.node, manager)

  return manager.subscribe({
    topic,
    args,
    onData,
    onError,
  })
}
