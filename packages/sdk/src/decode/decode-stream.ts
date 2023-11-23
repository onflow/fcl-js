import EventEmitter from "events"
import {StreamConnection} from "@onflow/typedefs"
import type {makeDecodeResponse} from "./decode"

type DecodeResponseFn = ReturnType<typeof makeDecodeResponse>

// This function pipes a generic stream of data into a granular stream of decoded data
export const makeDecodeStream =
  (decodeResponse: DecodeResponseFn) =>
  (stream: StreamConnection<{data: any}>) => {
    const newStream = new EventEmitter()
    let queue: Promise<any>[] = []

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
          const message = await decodeResponse(partialResponse)
          return {
            channel,
            message,
          }
        })
      )
      queue.push(newDataPromise)

      // Wait for the previous data to be emitted before emitting the new data
      await queue[0]
      queue.shift()

      // Emit the new data
      const newData = await newDataPromise
      newData.forEach(({channel, message}) => {
        newStream.emit(channel, message)
      })
    })

    // Relay events from the original stream
    // These events are delivered in order as well so that the stream will
    // not emit more data after it has announced a contradictory state
    function relayEvent(event: any) {
      stream.on(event, async (message: any) => {
        await queue.at(-1)
        newStream.emit(event, message)
      })
    }
    relayEvent("open")
    relayEvent("close")
    relayEvent("error")

    return {
      on: (channel: string, callback: any) => {
        newStream.on(channel, callback)
      },
      off: (channel: string, callback: any) => {
        newStream.off(channel, callback)
      },
      close: () => {
        stream.close()
      },
    }
  }
