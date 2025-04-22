import EventEmitter from "events"
import {StreamConnection} from "@onflow/typedefs"

type DecodeResponseFn = (
  response: Record<string, any>,
  customDecoders?: Record<string, any>
) => Promise<any>

/**
 * Pipes a generic stream of data into a granular stream of decoded data
 * The data is decoded per channel and emitted in order
 */
export const decodeStream = (
  stream: StreamConnection<{data: any}>,
  decodeResponse: DecodeResponseFn,
  customDecoders?: Record<string, any>
): StreamConnection<any> => {
  const newStream = new EventEmitter()
  let queue = taskQueue()

  // Data is separated by topic & the decoded data is emitted in order
  // All topics for a given message will be emitted synchronously before moving on to the next message
  // The streamReady promise ensures that the data is emitted in order and avoids race conditions when decoding
  stream.on("data", async data => {
    const topics = Object.keys(data).filter(
      key => data[key] != null && key !== "tag"
    )

    let newDataPromise = Promise.all(
      topics.map(async channel => {
        const partialResponse = {
          [channel]: data[channel],
        }
        const message = await decodeResponse(partialResponse, customDecoders)
        return {
          channel,
          message,
        }
      })
    )

    queue.push(async () => {
      // Emit the new data
      const newData = await newDataPromise
      newData.forEach(({channel, message}) => {
        newStream.emit(channel, message)
      })
    })
  })

  // Relay events from the original stream
  // These events are delivered in order as well so that the stream will
  // not emit more data after it has announced a contradictory state
  function relayEvent(event: any) {
    stream.on(event, (message: any) => {
      queue.push(async () => {
        newStream.emit(event, message)
      })
    })
  }
  relayEvent("close")
  relayEvent("error")

  return {
    on(channel: string, callback: any) {
      newStream.on(channel, callback)
      return this
    },
    off(channel: string, callback: any) {
      newStream.off(channel, callback)
      return this
    },
    close: () => {
      stream.close()
    },
  }
}

function taskQueue() {
  let queue: (() => Promise<any>)[] = [] as any as (() => Promise<any>)[]
  let running = false

  async function run() {
    if (running) return
    running = true
    while (queue.length > 0) {
      const task = queue.shift()
      await task?.()
    }
    running = false
  }

  return {
    push: (task: () => Promise<any>) => {
      queue.push(task)
      run()
    },
  }
}
