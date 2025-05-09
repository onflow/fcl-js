import {
  Action,
  MessageRequest,
  MessageResponse,
  SocketError,
  SubscriptionDataMessage,
  UnsubscribeMessageResponse,
} from "./models"
import {WebSocket} from "./websocket"
import * as logger from "@onflow/util-logger"

const WS_OPEN = 1

type DeepRequired<T> = Required<{
  [K in keyof T]: DeepRequired<T[K]>
}>

interface SubscriptionInfo<ArgsDto = any, DataDto = any> {
  // ID for the subscription
  id: string
  // The topic of the subscription
  topic: string
  args: ArgsDto
  onData: (data: DataDto) => void
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

export class ConnectionManager {
  private counter = 0
  private socket: WebSocket | null = null
  private subscriptions: SubscriptionInfo[] = []
  private config: DeepRequired<SubscriptionManagerConfig>
  private reconnectAttempts = 0
  private connectPromise: Promise<void> | null = null

  constructor(config: SubscriptionManagerConfig) {
    this.config = {
      ...config,
      reconnectOptions: {
        initialReconnectDelay: 500,
        reconnectAttempts: 5,
        maxReconnectDelay: 5000,
        ...config.reconnectOptions,
      },
    }
  }

  // Lazy connect to the socket when the first subscription is made
  async connect() {
    if (!this.connectPromise) {
      this.connectPromise = new Promise<void>((resolve, reject) => {
        // If the socket is already open, do nothing
        if (this.socket?.readyState === WS_OPEN) {
          resolve()
          return
        }

        this.socket = new WebSocket(this.config.node)
        this.socket.addEventListener("message", event => {
          const message = JSON.parse(event.data) as
            | MessageResponse
            | SubscriptionDataMessage

          // Ignore errors related to a request (handled by the request method)
          if ("action" in message && message.error) {
            return
          }

          const sub = this.subscriptions.find(
            sub => sub.id === message.subscription_id
          )
          if (sub) {
            if (!("action" in message) && message.subscription_id === sub.id) {
              sub.onData(message.payload)
            }
          }
        })
        this.socket.addEventListener("close", () => {
          this.recoverSocketError(new Error("WebSocket closed"))
            .then(() => {
              resolve()
            })
            .catch(e => {
              reject(e)
            })
        })
        this.socket.addEventListener("open", () => {
          resolve()
        })
      })
    }

    return this.connectPromise
  }

  private async recoverSocketError(error: any) {
    // Clear the socket
    this.socket = null

    // If the number of reconnection attempts is less than the maximum, try to reconnect
    if (
      this.reconnectAttempts < this.config.reconnectOptions.reconnectAttempts
    ) {
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
    } else {
      logger.log({
        level: logger.LEVELS.error,
        title: "WebSocket Error",
        message: `Failed to reconnect to the server after ${this.reconnectAttempts + 1} attempts: ${error}`,
      })

      this.subscriptions = []
      this.reconnectAttempts = 0

      throw error
    }
  }

  async subscribe(sub: SubscriptionInfo) {
    // Send the subscription message
    const request: MessageRequest = {
      action: Action.SUBSCRIBE,
      topic: sub.topic,
      arguments: sub.args,
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

  async unsubscribe(sub: SubscriptionInfo) {
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
