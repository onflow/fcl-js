export type IpcClientHandlers = {
  onMessage?: (msg: any) => void
  onClose?: () => void
}

export type IpcHostHandlers = {
  onConnect?: (connection: IpcConnection) => void
} & IpcClientHandlers

export type IpcConnection = {
  send: (msg: any) => void
  close: () => void
}

export function createIpcController(hostHandlers: IpcHostHandlers) {
  function connect(clientHandlers: IpcClientHandlers): IpcConnection {
    const host = createClient(hostHandlers, clientHandlers)
    const client = createClient(clientHandlers, hostHandlers)
    hostHandlers.onConnect?.(host)
    return client
  }

  return {
    connect,
  }
}

function createClient(
  self: IpcClientHandlers,
  peer: IpcClientHandlers
): IpcConnection {
  function send(msg: any) {
    peer.onMessage?.(msg)
  }

  function close() {
    peer.onClose?.()
    self.onClose?.()
  }

  return {send, close}
}
