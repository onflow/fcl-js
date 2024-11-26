import {
  Action,
  MessageResponse,
  SubscriptionDataMessage,
  UnsubscribeMessageResponse,
} from "./models"
import {
  SubscribeMessageRequest,
  SubscribeMessageResponse,
  UnsubscribeMessageRequest,
} from "./models"
import type {SdkTransport} from "@onflow/typedefs"
import {WebSocket} from "./websocket"
import * as logger from "@onflow/util-logger"

const WS_OPEN = 1

interface SubscriptionInfo<T extends SdkTransport.SubscriptionTopic> {
  // Internal ID for the subscription
  id: number
  // Remote ID assigned by the server used for message routing and unsubscribing
  remoteId?: string
  // The topic of the subscription
  topic: T
  // The checkpoint to resume the subscription from
  checkpoint: SdkTransport.SubscriptionArguments<T>
  // The callback to call when a data is received
  onData: (data: any) => void
  // The callback to call when an error occurs
  onError: (error: Error) => void
}

interface WsTransportConfig {
  /**
   * The URL of the node to connect to
   */
  node: string
  /**
   * Starting interval for reconnection attempts in milliseconds, exponential backoff is applied
   * @default 500
   */
  reconnectInterval?: number
  /**
   * The number of reconnection attempts before giving up
   * @default 5
   */
  reconnectAttempts?: number
}

export class SubscriptionManager {
  private counter = 0
  private subscriptions: SubscriptionInfo<SdkTransport.SubscriptionTopic>[] = []
  private socket: WebSocket | null = null
  private config: Required<WsTransportConfig>
  private reconnectAttempts = 0

  constructor(config: WsTransportConfig) {
    this.config = {
      reconnectInterval: 500,
      reconnectAttempts: 5,
      ...config,
    }
  }

  // Lazy connect to the socket when the first subscription is made
  private async connect() {
    return new Promise<void>((resolve, reject) => {
      // If the socket is already open, do nothing
      if (this.socket?.readyState === WS_OPEN) {
        return
      }

      this.socket = new WebSocket(this.config.node)
      this.socket.onmessage = event => {
        const data = JSON.parse(event.data) as
          | MessageResponse
          | SubscriptionDataMessage

        if ("action" in data) {
          // TODO, waiting for AN team to decide what to do here
        } else {
          const sub = this.subscriptions.find(sub => sub.remoteId === data.id)
          if (!sub) return

          // Update the block height to checkpoint for disconnects
          this.updateSubscriptionCheckpoint(sub, data)

          // Call the subscription callback
          sub.onData(data.data)
        }
      }
      this.socket.onclose = () => {
        void this.reconnect()
      }
      this.socket.onerror = e => {
        this.reconnect(e)
      }

      this.socket.onopen = () => {
        // Restore subscriptions
        Promise.all(
          this.subscriptions.map(async sub => {
            const response = await this.sendSubscribe(sub)
            sub.remoteId = response.id
          })
        )
          .then(() => {
            resolve()
          })
          .catch(e => {
            reject(new Error(`Failed to restore subscriptions: ${e}`))
          })
      }
    })
  }

  private async reconnect(error?: any) {
    // Clear the socket
    this.socket = null

    // If there are no subscriptions, do nothing
    if (this.subscriptions.length === 0) {
      return
    }

    // Clear all remote ids
    this.subscriptions.forEach(sub => {
      delete sub.remoteId
    })

    // Validate the number of reconnection attempts
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      logger.log({
        level: logger.LEVELS.error,
        title: "WebSocket Error",
        message: `Failed to reconnect to the server after ${this.reconnectAttempts + 1} attempts: ${error}`,
      })

      this.subscriptions.forEach(sub => {
        sub.onError(
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

  async subscribe<T extends SdkTransport.SubscriptionTopic>(opts: {
    topic: T
    args: SdkTransport.SubscriptionArguments<T>
    onData: (data: SdkTransport.SubscriptionData<T>) => void
    onError: (error: Error) => void
  }): Promise<SdkTransport.Subscription> {
    // Connect the socket if it's not already open
    await this.connect()

    // Track the subscription locally
    const sub: SubscriptionInfo<T> = {
      id: this.counter++,
      topic: opts.topic,
      checkpoint: opts.args,
      onData: opts.onData,
      onError: opts.onError,
    }
    this.subscriptions.push(sub)

    // Send the subscribe message
    const response = await this.sendSubscribe(sub)

    if (!response.success) {
      throw new Error(
        `Failed to subscribe to topic ${sub.topic}, error message: ${response.error_message}`
      )
    }

    // Update the subscription with the remote id
    sub.remoteId = response.id

    return {
      unsubscribe: () => this.unsubscribe(sub.id),
    }
  }

  private unsubscribe(id: number): void {
    // Get the subscription
    const sub = this.subscriptions.find(sub => sub.id === id)
    if (!sub) return

    // Send the unsubscribe message
    this.sendUnsubscribe(sub).catch(e => {
      console.error(
        `Failed to unsubscribe from topic ${sub.topic}, error: ${e}`
      )
    })

    // Remove the subscription
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id)

    // Close the socket if there are no more subscriptions
    if (this.subscriptions.length === 0) {
      this.socket?.close()
    }
  }

  private async sendSubscribe(
    sub: SubscriptionInfo<SdkTransport.SubscriptionTopic>
  ) {
    // Send the subscription message
    const request: SubscribeMessageRequest = {
      action: Action.SUBSCRIBE,
      topic: sub.topic,
      arguments: sub.checkpoint,
    }
    this.socket?.send(JSON.stringify(request))

    const response: SubscribeMessageResponse = await this.waitForResponse()

    if (!response.success) {
      throw new Error(
        `Failed to subscribe to topic ${sub.topic}, error message: ${response.error_message}`
      )
    }

    return response
  }

  private async sendUnsubscribe(
    sub: SubscriptionInfo<SdkTransport.SubscriptionTopic>
  ) {
    // Send the unsubscribe message if the subscription has a remote id
    const {remoteId} = sub
    if (remoteId) {
      const request: UnsubscribeMessageRequest = {
        action: Action.UNSUBSCRIBE,
        id: remoteId,
      }
      this.socket?.send(JSON.stringify(request))

      const response: UnsubscribeMessageResponse = await this.waitForResponse()

      if (!response.success) {
        throw new Error(
          `Failed to unsubscribe from topic ${sub.topic}, error message: ${response.error_message}`
        )
      }
    }
  }

  private async waitForResponse<T extends MessageResponse>(): Promise<T> {
    // TODO: NOOP, waiting for AN team to decide what to do here, this is a placeholder
    return new Promise(resolve => {
      this.socket?.addEventListener("message", event => {
        const data = JSON.parse(event.data) as T
        if (data.action) {
          resolve(data)
        }
      })
    })
  }

  // Update the subscription checkpoint when a message is received
  // These checkpoints are used to resume subscriptions after disconnects
  private updateSubscriptionCheckpoint<
    T extends SdkTransport.SubscriptionTopic = SdkTransport.SubscriptionTopic,
  >(sub: SubscriptionInfo<T>, message: SubscriptionDataMessage) {
    // TODO: Will be implemented with each subscription topic
  }

  /**
   * Calculate the backoff interval for reconnection attempts
   * @returns The backoff interval in milliseconds
   */
  private get backoffInterval() {
    return this.config.reconnectInterval * (this.reconnectAttempts ^ 2)
  }
}
