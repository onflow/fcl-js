import _WebSocket from "isomorphic-ws"

export const WebSocket = _WebSocket as new (
  url: string | URL,
  protocols?: string | string[] | undefined
) => WebSocket
