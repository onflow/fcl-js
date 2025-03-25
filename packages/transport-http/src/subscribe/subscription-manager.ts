import {
  Action,
  MessageRequest,
  MessageResponse,
  SocketError,
  SubscriptionDataMessage,
  UnsubscribeMessageResponse,
} from "./models"
import {SdkTransport} from "@onflow/typedefs"
import {WebSocket} from "./websocket"
import {DataSubscriber, SubscriptionHandler} from "./handlers/types"
import * as logger from "@onflow/util-logger"

const WS_OPEN = 1

type DeepRequired<T> = Required<{
  [K in keyof T]: DeepRequired<T[K]>
}>

type InferHandler<T> = T extends SubscriptionHandler<infer H> ? H : never

interface SubscriptionInfo<ArgsDto = any, DataDto = any> {
  // ID for the subscription
  id: string
  // The topic of the subscription
  topic: string
  // Data provider for the subscription
  subscriber: DataSubscriber<ArgsDto, DataDto>
}

export interface SubscriptionManagerConfig {
  /**
   * The URL of the node to connect to
   */
  node: string
  /**
   * Options for reconnecting to the server
   */
  reconnectOptions?: {
    /**
     * The initial delay in milliseconds before reconnecting
     * @default 500
     */
    initialReconnectDelay?: number
    /**
     * The maximum number of reconnection attempts
     * @default 5
     */
    reconnectAttempts?: number
    /**
     * The maximum delay in milliseconds between reconnection attempts
     * @default 5000
     */
    maxReconnectDelay?: number
  }
}

export class SubscriptionManager<Handlers extends SubscriptionHandler<any>[]> {
  private counter = 0
  private socket: WebSocket | null = null
  private subscriptions: SubscriptionInfo[] = []
  private config: DeepRequired<SubscriptionManagerConfig>
  private reconnectAttempts = 0
  private handlers: SubscriptionHandler<any>[]

  constructor(handlers: Handlers, config: SubscriptionManagerConfig) {
    this.config = {
      ...config,
      reconnectOptions: {
        initialReconnectDelay: 500,
        reconnectAttempts: 5,
        maxReconnectDelay: 5000,
        ...config.reconnectOptions,
      },
    }
    this.handlers = handlers
  }

  subscribe<T extends Handlers[number]>(opts: {
    topic: InferHandler<T>["Topic"]
    args: InferHandler<T>["Args"]
    onData: (data: InferHandler<T>["Data"]) => void
    onError: (error: Error) => void
  }): SdkTransport.Subscription {
    const idPromise = this._subscribe(opts)

    return {
      unsubscribe: () => {
        // Unsubscribe when the ID is available
        idPromise.then(id => id && this.unsubscribe(id))
      },
    }
  }

  private async _subscribe<T extends Handlers[number]>(opts: {
    topic: InferHandler<T>["Topic"]
    args: InferHandler<T>["Args"]
    onData: (data: InferHandler<T>["Data"]) => void
    onError: (error: Error) => void
  }): Promise<string | null> {
    // Get the data provider for the topic
    const topicHandler = this.getHandler(opts.topic)
    const subscriber = topicHandler.createSubscriber(
      opts.args,
      opts.onData,
      opts.onError
    )

    let sub: SubscriptionInfo | null = null
    try {
      // Connect the socket if it's not already open
      await this.connect()

      // Track the subscription locally
      sub = {
        id: String(this.counter++),
        topic: opts.topic,
        subscriber: subscriber,
      }
      this.subscriptions.push(sub)

      // Send the subscribe message
      const response = await this.sendSubscribe(sub)
      if (response.error) {
        throw new Error(`Failed to subscribe to topic ${sub.topic}`, {
          cause: SocketError.fromMessage(response.error),
        })
      }
    } catch (e) {
      // Unsubscribe if there was an error
      subscriber.onError(e instanceof Error ? e : new Error(String(e)))
      if (sub) {
        this.unsubscribe(sub.id)
      }
      return null
    }

    return sub.id
  }

  private unsubscribe(id: string): void {
    // Get the subscription
    const sub = this.subscriptions.find(sub => sub.id === id)
    if (!sub) return

    // Remove the subscription
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id)

    // Close the socket if there are no more subscriptions
    if (this.subscriptions.length === 0) {
      this.socket?.close()
      return
    }

    // Otherwise, the unsubscribe message
    this.sendUnsubscribe(sub).catch(e => {
      console.error(`Error while unsubscribing from topic: ${e}`)
    })
  }

  // Lazy connect to the socket when the first subscription is made
  private async connect() {
    return new Promise<void>((resolve, reject) => {
      // If the socket is already open, do nothing
      if (this.socket?.readyState === WS_OPEN || this.socket) {
        resolve()
        return
      }

      this.socket = new WebSocket(this.config.node)
      this.socket.addEventListener("message", event => {
        const message = JSON.parse(event.data) as
          | MessageResponse
          | SubscriptionDataMessage

        // Error message
        if ("action" in message && message.error) {
          this.handleSocketError(SocketError.fromMessage(message.error))
          return
        }

        const sub = this.subscriptions.find(
          sub => sub.id === message.subscription_id
        )
        if (sub) {
          if (!("action" in message) && message.subscription_id === sub.id) {
            sub.subscriber.onData(message.payload)
          }
        }
      })
      this.socket.addEventListener("close", () => {
        void this.handleSocketError(new Error("WebSocket closed"))
      })
      this.socket.addEventListener("open", () => {
        // Restore subscriptions
        Promise.all(
          this.subscriptions.map(async sub => {
            await this.sendSubscribe(sub)
          })
        )
          .then(() => {
            resolve()
          })
          .catch(e => {
            reject(new Error(`Failed to restore subscriptions: ${e}`))
          })
      })
    })
  }

  private async handleSocketError(error: any) {
    // Clear the socket
    this.socket = null

    // If there are no subscriptions, do nothing
    if (this.subscriptions.length === 0) {
      return
    }

    // Validate the number of reconnection attempts
    if (
      this.reconnectAttempts >= this.config.reconnectOptions.reconnectAttempts
    ) {
      logger.log({
        level: logger.LEVELS.error,
        title: "WebSocket Error",
        message: `Failed to reconnect to the server after ${this.reconnectAttempts + 1} attempts: ${error}`,
      })

      this.subscriptions.forEach(sub => {
        sub.subscriber.onError(
          new Error(
            `Failed to reconnect to the server after ${this.reconnectAttempts + 1} attempts: ${error}`
          )
        )
      })
      this.subscriptions = []
      this.reconnectAttempts = 0
    } else {
      logger.log({
        level: logger.LEVELS.warn,
        title: "WebSocket Error",
        message: `WebSocket error, reconnecting in ${this.backoffInterval}ms: ${error}`,
      })

      // Delay the reconnection
      await new Promise(resolve => setTimeout(resolve, this.backoffInterval))

      // Try to reconnect
      this.reconnectAttempts++
      await this.connect()
      this.reconnectAttempts = 0
    }
  }

  private async sendSubscribe(sub: SubscriptionInfo) {
    // Send the subscription message
    const request: MessageRequest = {
      action: Action.SUBSCRIBE,
      topic: sub.topic,
      arguments: sub.subscriber.getConnectionArgs(),
      subscription_id: String(sub.id),
    }

    const response = await this.request(request)
    if (response.error) {
      throw new Error(`Failed to subscribe to topic ${sub.topic}`, {
        cause: SocketError.fromMessage(response.error),
      })
    }
    return response
  }

  private async sendUnsubscribe(sub: SubscriptionInfo) {
    // Send the unsubscribe message if the subscription has a remote id
    const request: MessageRequest = {
      action: Action.UNSUBSCRIBE,
      subscription_id: sub.id,
    }
    this.socket?.send(JSON.stringify(request))

    const response: UnsubscribeMessageResponse = (await this.request(
      request
    )) as UnsubscribeMessageResponse
    if (response.error) {
      throw new Error(`Failed to unsubscribe from topic ${sub.topic}`, {
        cause: SocketError.fromMessage(response.error),
      })
    }

    return response
  }

  private async request(request: MessageRequest): Promise<MessageResponse> {
    return new Promise<MessageResponse>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket is not connected"))
        return
      }

      // Bind event listeners
      this.socket.addEventListener("error", onError)
      this.socket.addEventListener("message", onMessage)
      this.socket.addEventListener("close", onClose)

      // Send the request
      this.socket.send(JSON.stringify(request))

      function onError(e: WebSocketEventMap["error"]) {
        reject(new Error(`WebSocket error: ${e}`))
      }

      function onClose() {
        reject(new Error("WebSocket closed"))
      }

      function onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data) as MessageResponse
        if (data.subscription_id === request.subscription_id) {
          resolve(data)
        }
      }
    })
  }

  private getHandler(topic: string) {
    const handler = this.handlers.find(handler => handler.topic === topic)
    if (!handler) {
      throw new Error(`No handler found for topic ${topic}`)
    }
    return handler
  }

  /**
   * Calculate the backoff interval for reconnection attempts
   * @returns The backoff interval in milliseconds
   */
  private get backoffInterval() {
    return Math.min(
      this.config.reconnectOptions.maxReconnectDelay,
      this.config.reconnectOptions.initialReconnectDelay *
        2 ** this.reconnectAttempts
    )
  }
}
