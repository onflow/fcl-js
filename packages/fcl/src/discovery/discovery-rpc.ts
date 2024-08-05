import {createIpcController, IpcConnection} from "@onflow/fcl-core"
import {Service} from "@onflow/typedefs"

enum PeerRpcMethod {
  NOTIFY_WC_URI_UPDATE = "notify_wc_uri_update",
  GET_METHODS = "get_methods",
}

enum LocalRpcMethod {
  EXEC_SERVICE = "exec_service",
  GET_METHODS = "get_methods",
}

type PeerRpcMethodMap = {
  [PeerRpcMethod.NOTIFY_WC_URI_UPDATE]: {
    uri: string
  }
  [PeerRpcMethod.GET_METHODS]: {}
}

type LocalRpcMethodMap = {
  [LocalRpcMethod.EXEC_SERVICE]: {
    service: Service
  }
  [LocalRpcMethod.GET_METHODS]: {}
}

export class DiscoveryRpc {
  private ctrl: ReturnType<typeof createIpcController>
  private conn: Promise<IpcConnection>
  private id = 0
  private _supportedMethods: Promise<string[]>
  private messageListeners: ((msg: any) => void)[] = []

  constructor() {
    let resolveConn: (conn: IpcConnection) => void
    this.conn = new Promise<IpcConnection>(resolve => {
      resolveConn = resolve
    })
    this.ctrl = createIpcController({
      onConnect: conn => {
        resolveConn(conn)
      },
      onClose: () => {
        // TODO: handle close
      },
      onMessage: msg => {
        this.messageListeners.forEach(listener => listener(msg))
      },
    })
    this._supportedMethods = this.request(PeerRpcMethod.GET_METHODS, {})
  }

  private onMessage(listener: (msg: any) => void) {
    this.messageListeners.push(listener)
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener)
    }
  }

  get ipcController() {
    return this.ctrl
  }

  private async notify<R extends keyof PeerRpcMethodMap>(
    method: R,
    params: PeerRpcMethodMap[R]
  ) {
    const conn = await this.conn
    conn.send({
      jsonrpc: "2.0",
      method,
      params,
    })
  }

  private async request<R extends keyof PeerRpcMethodMap, T = any>(
    method: R,
    params: PeerRpcMethodMap[R]
  ): Promise<T> {
    const conn = await this.conn
    const id = this.id++
    conn.send({
      jsonrpc: "2.0",
      method,
      params,
      id,
    })

    return new Promise<T>((resolve, reject) => {
      this.onMessage(msg => {
        if (msg.id === id) {
          if (msg.error) {
            reject(msg.error)
          }
          resolve(msg.result)
        }
      })
    })
  }

  private listen<R extends keyof LocalRpcMethodMap>(
    method: R,
    handler: (params: LocalRpcMethodMap[R]) => void
  ) {
    return this.onMessage(msg => {
      if (msg.method === method) {
        handler(msg.params)
      }
    })
  }

  updateWalletConnectUri(uri: string) {
    this.notify(PeerRpcMethod.NOTIFY_WC_URI_UPDATE, {uri})
  }

  onExecService(handler: (service: Service) => void) {
    return this.listen(LocalRpcMethod.EXEC_SERVICE, params => {
      handler(params.service)
    })
  }

  async getSupportedMethods() {
    return this._supportedMethods
  }
}
