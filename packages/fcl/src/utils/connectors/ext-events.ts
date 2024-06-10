import {StreamConnection} from "@onflow/typedefs"
import {EventEmitter} from "events"

export async function connectExtEvents(
  stream: StreamInfo
): Promise<StreamConnection<any>> {
  const emitter = new EventEmitter()

  const handler = (event: MessageEvent) => {
    const {data} = event
    if (data.f_type === "WalletEvent") {
      emitter.emit("data", data)
    }
  }
  window.addEventListener("message", handler)

  const connection = {
    close: () => {
      window.removeEventListener("message", handler)
      emitter.emit("close")
      emitter.removeAllListeners()
    },
    on(event: string, cb: (data: any) => void): StreamConnection<any> {
      emitter.on(event, cb)
      return this
    },
    off(event: string, cb: (data: any) => void): StreamConnection<any> {
      emitter.off(event, cb)
      return this
    },
  }

  return connection
}
