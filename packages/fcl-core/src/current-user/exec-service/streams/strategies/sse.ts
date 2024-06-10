import EventSource from "eventsource"
import {StreamConnection} from "@onflow/typedefs"
import EventEmitter from "events"
import type {StreamInfo} from "../stream-connector-manager"
import {invariant} from "@onflow/util-invariant"

class SSEConnection<T = any>
  implements
    StreamConnection<{
      message: T
    }>
{
  private es: EventSource | null = null
  private emitter = new EventEmitter()

  constructor(private url: string | URL) {
    this.connect()
  }

  private connect() {
    this.es = new EventSource(this.url.toString(), {
      withCredentials: true,
    })

    this.es.onmessage = async (event: MessageEvent<any>) => {
      let data: any
      try {
        data = JSON.parse(event.data)
      } catch (error) {
        this.emitter.emit(
          "error",
          new Error(
            `SSEResponseError: data must be a JSON message, received:\n${event.data}`
          )
        )
        this.close()
        return
      }

      if (data.error) {
        this.emitter.emit("error", new Error(data.error))
        this.close()
        return
      }

      this.emitter.emit("message", {message: data})
    }

    this.es.onerror = (error: MessageEvent<any>) => {
      this.emitter.emit("error", new Error(error.data))
      this.close()
    }
  }

  on<C extends "message">(
    channel: C,
    listener: (data: {message: any}[C]) => void
  ): this
  on(event: "close", listener: () => void): this
  on(event: "error", listener: (err: any) => void): this
  on(event: string, listener: (...args: any[]) => any): this {
    this.emitter.on(event, listener)
    return this
  }

  off<C extends "message">(
    event: C,
    listener: (data: {message: any}[C]) => void
  ): this
  off(event: "close", listener: () => void): this
  off(event: "error", listener: (err: any) => void): this
  off(event: string, listener: (...args: any[]) => any): this {
    this.emitter.off(event, listener)
    return this
  }

  close() {
    this.es?.close()
  }
}

export async function connectSse(
  streamInfo: StreamInfo
): Promise<StreamConnection<{message: any}>> {
  invariant(!!streamInfo.endpoint, "ConnectSse: endpoint is required")
  return new SSEConnection(streamInfo.endpoint)
}
