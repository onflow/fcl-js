import {StreamConnection} from "@onflow/typedefs"
import {connectSse} from "./strategies/sse"

const DEFAULT_CONNECTORS = {
  SSE: connectSse,
}

export interface StreamInfo {
  f_vsn: string
  f_type: string
  type: string
  endpoint?: string
}

export type StreamConnector = (
  stream: StreamInfo
) => Promise<StreamConnection<any>>

class StreamConnectorManager {
  connectors: Map<string, StreamConnector>

  constructor(defaultConnectors = DEFAULT_CONNECTORS) {
    this.connectors = new Map()

    // Register the default stream connectors
    for (const [type, connect] of Object.entries(defaultConnectors)) {
      this.add(type, connect)
    }
  }

  add(
    type: string,
    connect: (stream: StreamInfo) => Promise<StreamConnection<any>>
  ) {
    if (this.connectors.has(type)) {
      throw new Error(`StreamConnector for type ${type} already exists`)
    }
    this.connectors.set(type, connect)
  }

  remove(type: string) {
    this.connectors.delete(type)
  }

  connect(stream: StreamInfo) {
    const connector = this.connectors.get(stream.type)
    if (!connector) {
      throw new Error(
        `Could not find StreamConnector for type "${stream.type}"`
      )
    }
    return connector(stream)
  }
}

export const streamConnectorManager = new StreamConnectorManager()
