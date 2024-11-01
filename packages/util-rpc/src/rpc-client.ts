import {RpcMessage, RpcNotificationMessage, RpcRequestMessage} from "./messages"
import {RpcError, RpcErrorCode} from "./rpc-error"

export type RpcRequest<P, R> = {
  type: "request"
  params: P
  result: R
}

export type RpcNotification<P> = {
  type: "notification"
  params: P
}

enum ReservedRpcMethods {
  HELLO = "rpc_hello",
}

type RequestHandler<T = any> = (params: T) => any
type NotificationHandler<T = any> = (params: T) => void

type PeerInfo = {
  requests: string[]
  notifications: string[]
}

export class RpcClient<
  PeerRequests extends Record<string, RpcRequest<any, any>>,
  PeerNotifications extends Record<string, RpcNotification<any>>,
> {
  private id = 0

  private setSend: (send: (msg: RpcMessage) => void) => void = () => {}
  private _send: Promise<(msg: RpcMessage) => void> = new Promise(resolve => {
    this.setSend = resolve
  })

  private resolvePeerInfo!: (info: PeerInfo) => void
  private rejectPeerInfo!: (error: Error) => void
  private peerInfo: Promise<PeerInfo> = new Promise((resolve, reject) => {
    this.resolvePeerInfo = resolve
    this.rejectPeerInfo = reject
  })

  private enabledNotifications: string[] = []
  private requestHandlers: Record<string, RequestHandler> = {} as any
  private subscriptions: Record<string, Set<NotificationHandler>> = {} as any
  private messageListeners: ((msg: any) => void)[] = []

  constructor({notifications}: {notifications?: string[]}) {
    this.enabledNotifications = notifications || []
    this.on(ReservedRpcMethods.HELLO, (info: PeerInfo) => {
      this.resolvePeerInfo(info)
      return this.ownInfo()
    })
  }

  connect({send}: {send: (msg: RpcMessage) => void}) {
    this.setSend(send)
    this.requestWithoutConnection(ReservedRpcMethods.HELLO, this.ownInfo())
      .then(info => {
        this.resolvePeerInfo(info)
      })
      .catch(this.rejectPeerInfo)
  }

  private ownInfo(): PeerInfo {
    return {
      requests: Object.keys(this.requestHandlers),
      notifications: this.enabledNotifications,
    }
  }

  private async send(msg: RpcMessage) {
    return (await this._send)(msg)
  }

  receive(msg: RpcMessage) {
    if (msg?.jsonrpc !== "2.0") {
      return
    }

    if ("method" in msg) {
      if ("id" in msg) {
        this.handleRequest(msg)
      } else {
        this.handleNotification(msg)
      }
    }

    this.messageListeners.forEach(listener => listener(msg))
  }

  private async handleRequest(msg: RpcRequestMessage) {
    const handler = this.requestHandlers[msg.method]
    if (handler) {
      try {
        const result = await handler(msg.params)
        this.send({
          jsonrpc: "2.0",
          id: msg.id,
          result,
        })
      } catch (error: any) {
        if (error instanceof RpcError) {
          this.send({
            jsonrpc: "2.0",
            id: msg.id,
            error: {
              code: error.code,
              message: error.message,
              data: error.data,
            },
          })
        } else {
          this.send({
            jsonrpc: "2.0",
            id: msg.id,
            error: {
              code: RpcErrorCode.INTERNAL_ERROR,
              message: error?.message,
            },
          })
        }
      }
    } else {
      this.send({
        jsonrpc: "2.0",
        id: msg.id,
        error: {
          code: RpcErrorCode.METHOD_NOT_FOUND,
          message: `Method not found: ${msg.method}`,
        },
      })
    }
  }

  private handleNotification(msg: RpcNotificationMessage) {
    if (this.subscriptions[msg.method]) {
      this.subscriptions[msg.method].forEach(handler => handler(msg.params))
    }
  }

  private onMessage(listener: (msg: any) => void) {
    this.messageListeners.push(listener)
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener)
    }
  }

  async notify<R extends keyof PeerNotifications & string>(
    method: R,
    params: PeerNotifications[R]["params"]
  ) {
    await this.onceConnected()

    this.send({
      jsonrpc: "2.0",
      method,
      params,
    })
  }

  async request<R extends keyof PeerRequests & string>(
    method: R,
    params: PeerRequests[R]["params"]
  ): Promise<PeerRequests[R]["result"]> {
    await this.onceConnected()
    return this.requestWithoutConnection(method, params)
  }

  private async requestWithoutConnection<R extends keyof PeerRequests & string>(
    method: R,
    params: PeerRequests[R]["params"]
  ): Promise<PeerRequests[R]["result"]> {
    const id = this.id++

    let unsub = () => {}
    const result = new Promise<PeerRequests[R]["result"]>((resolve, reject) => {
      unsub = this.onMessage(msg => {
        if (msg.id === id && ("result" in msg || "error" in msg)) {
          if (msg.error) {
            const rpcError = new RpcError(
              msg.error.code,
              msg.error.message,
              msg.error.data
            )
            reject(rpcError)
          }
          resolve(msg.result)
        }
      })
    }).finally(unsub)

    this.send({
      jsonrpc: "2.0",
      method,
      params,
      id,
    })

    return result
  }

  on(method: string, handler: RequestHandler) {
    this.requestHandlers[method] = handler
  }

  subscribe<R extends string>(method: R, handler: RequestHandler<any>) {
    this.subscriptions[method] = this.subscriptions[method] || new Set()
    this.subscriptions[method].add(handler)
  }

  unsubscribe<R extends string>(method: R, handler: RequestHandler<any>) {
    this.subscriptions[method]?.delete(handler)
  }

  async onceConnected() {
    return this.peerInfo.then(() => {})
  }

  async getAvailableRequests() {
    return this.peerInfo.then(info => info.requests)
  }

  async getAvailableNotifications() {
    return this.peerInfo.then(info => info.notifications)
  }
}
