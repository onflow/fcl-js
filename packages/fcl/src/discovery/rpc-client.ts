export type RpcRequest<P, R> = {
  params: P
  result: R
}

export type RpcNotification<P> = {
  params: P
}

export type RpcMethodMap = Record<
  string,
  RpcRequest<any, any> | RpcNotification<any>
>

type OnlyRequests<T> = {
  [K in keyof T]: T[K] extends RpcRequest<any, any> ? T[K] : never
}

type OnlyNotifications<T> = {
  [K in keyof T]: T[K] extends RpcNotification<any> ? T[K] : never
}

export type IsRpcRequest<T> = T extends RpcRequest<any, any> ? true : false

export class RpcClient<
  PeerRpcMethods extends RpcMethodMap,
  LocalRpcMethods extends RpcMethodMap,
> {
  private id = 0
  private handlers: Record<keyof LocalRpcMethods, (params: any) => any> =
    {} as any
  private messageListeners: ((msg: any) => void)[] = []

  private constructor(private send: (msg: any) => void) {}

  static create<
    PeerRpcMethods extends RpcMethodMap,
    LocalRpcMethods extends RpcMethodMap,
  >(send: (msg: any) => void) {
    const rpc = new RpcClient<PeerRpcMethods, LocalRpcMethods>(send)
    return {rpc, receive: rpc.receive.bind(rpc)}
  }

  private receive(msg: any) {
    if (msg.method) {
      const handler = this.handlers[msg.method]
      if (handler) {
        ;(async () => {
          try {
            const result = await handler(msg.params)
            this.send({
              jsonrpc: "2.0",
              id: msg.id,
              result,
            })
          } catch (error: any) {
            this.send({
              jsonrpc: "2.0",
              id: msg.id,
              error: {
                code: -32000,
                message: error?.message,
              },
            })
          }
        })()
      }
    }

    this.messageListeners.forEach(listener => listener(msg))
  }

  private onMessage(listener: (msg: any) => void) {
    this.messageListeners.push(listener)
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener)
    }
  }

  async notify<R extends keyof OnlyNotifications<PeerRpcMethods>>(
    method: R,
    params: OnlyNotifications<PeerRpcMethods>[R]["params"]
  ) {
    this.send({
      jsonrpc: "2.0",
      method,
      params,
    })
  }

  async request<R extends keyof OnlyRequests<PeerRpcMethods>>(
    method: R,
    params: OnlyRequests<PeerRpcMethods>[R]["params"]
  ): Promise<OnlyRequests<PeerRpcMethods>[R]["result"]> {
    const id = this.id++
    this.send({
      jsonrpc: "2.0",
      method,
      params,
      id,
    })

    return new Promise<OnlyRequests<PeerRpcMethods>[R]["result"]>(
      (resolve, reject) => {
        this.onMessage(msg => {
          if (msg.id === id) {
            if (msg.error) {
              reject(msg.error)
            }
            resolve(msg.result)
          }
        })
      }
    )
  }

  on<R extends keyof LocalRpcMethods>(
    method: R,
    handler: (params: LocalRpcMethods[R]["params"]) => void
  ) {
    this.handlers[method] = handler
  }

  off<R extends keyof LocalRpcMethods>(method: R) {
    delete this.handlers[method]
  }
}
