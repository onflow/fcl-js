//subscriptionmanager

enum SubscriptionTopic {
    EVENTS = "events",
    BLOCKS = "blocks",
  }
  
  type SubscriptionTypes = {
    [SubscriptionTopic.EVENTS]: {
      args: {
        startBlock: number
        endBlock: number
      }
      response: {
        type: string
        data: any
      }
    }
    [SubscriptionTopic.BLOCKS]: {
      args: {
        startBlock: number
        endBlock: number
      }
      response: {
        type: string
        data: any
      }
    }
  }
  
  type Subscription = {
    unsubscribe: () => void
  }
  
  type SubscriptionTransport = {
    subscribe: (topic: string, args: any, callback: (data: any) => void) => string
    unsubscribe: (subscriptionId: string) => void
  }
  
  export class SubscriptionManager {
    private subscriptions: Subscription[] = []
  
    constructor(private readonly transport: SubscriptionTransport) {}
  
    subscribe<T extends SubscriptionTopic>(
      topic: T,
      args: SubscriptionTypes[T]["args"],
      callback: (data: any) => void
    ): () => void {
      const subscription = this.transport.subscribe(topic, args, data => {
        const decodedData = this.decode(topic, data)
        callback(decodedData)
      })
  
      return () => {
        const index = this.subscriptions.indexOf(subscription)
        if (index !== -1) {
          this.subscriptions.splice(index, 1)
          subscription.unsubscribe()
        }
      }
    }
  
    decode<T extends SubscriptionTopic>(
      topic: T,
      data: any
    ): SubscriptionTypes[T]["response"] {
      return data
    }
  }
  