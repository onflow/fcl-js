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
  GET_REQUESTS = "rpc_getRequests",
  GET_NOTIFICATIONS = "rpc_getNotifications",
}

type RequestHandler<RPC> = (rpc: RPC, params: any) => any

export class RpcClient<
  PeerRequests extends Record<string, RpcRequest<any, any>>,
  PeerNotifications extends Record<string, RpcNotification<any>>,
> {
  private id = 0
  private peerRequests!: Promise<string[]>
  private peerNotifications!: Promise<string[]>
  private send!: (msg: RpcMessage) => void

  private requestHandlers: Record<string, (rpc: this, params: any) => any> =
    {} as any
  private subscriptions: Record<string, Set<(rpc: this, params: any) => void>> =
    {} as any
  private messageListeners: ((msg: any) => void)[] = []

  constructor({notifications}: {notifications?: string[]}) {
    this.on(ReservedRpcMethods.GET_REQUESTS, () => {
      return Object.keys(this.requestHandlers)
    })

    this.on(ReservedRpcMethods.GET_NOTIFICATIONS, () => {
      return notifications || []
    })
  }

  connect({send}: {send: (msg: RpcMessage) => void}) {
    this.send = send
    this.peerRequests = this.request(ReservedRpcMethods.GET_REQUESTS, {})
    this.peerNotifications = this.request(
      ReservedRpcMethods.GET_NOTIFICATIONS,
      {}
    )
    return {receive: this.receive.bind(this)}
  }

  private receive(msg: RpcMessage) {
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
        const result = await handler(this, msg.params)
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
    }
  }

  private handleNotification(msg: RpcNotificationMessage) {
    if (this.subscriptions[msg.method]) {
      this.subscriptions[msg.method].forEach(handler =>
        handler(this, msg.params)
      )
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
    const id = this.id++
    this.send({
      jsonrpc: "2.0",
      method,
      params,
      id,
    })

    let unsub = () => {}
    return new Promise<PeerRequests[R]["result"]>((resolve, reject) => {
      unsub = this.onMessage(msg => {
        if (msg.id === id) {
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
  }

  on(method: string, handler: RequestHandler<this>) {
    this.requestHandlers[method] = handler
  }

  subscribe<R extends keyof PeerNotifications & string>(
    method: R,
    handler: (rpc: this, params: PeerNotifications[R]["params"]) => void
  ) {
    this.subscriptions[method] = this.subscriptions[method] || new Set()
    this.subscriptions[method].add(handler)
  }

  unsubscribe<R extends keyof PeerNotifications & string>(
    method: R,
    handler: (rpc: this, params: PeerNotifications[R]["params"]) => void
  ) {
    this.subscriptions[method]?.delete(handler)
  }

  async getAvailableRequests() {
    return this.peerRequests
  }

  async getAvailableNotifications() {
    return this.peerNotifications
  }
}
