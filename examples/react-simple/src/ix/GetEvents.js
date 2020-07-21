import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetEvents = () => {
  const [result, setResult] = useState(null)
  const [eventType, setEventType] = useState("")
  const [startBlock, setStartBlock] = useState("")
  const [endBlock, setEndBlock] = useState("")

  const run = async () => {

    /*

      Get Events
      -----------

      Declaring an interaction which gets events is done by calling the sdk.getEvents builder.
      
      sdk.getEvents consumes an eventType, a startBlock and an endBlock.

        - eventType: This is the type of event you wish to get.
        - startBlock: Denotes the starting block to get events from.
        - endBlock: Denotes the ending block to get events from.

    */

    const response = await sdk.send(await sdk.build([
      sdk.getEvents(eventType, startBlock, endBlock),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <input
        placeholder="event type"
        onChange={e => setEventType(e.target.value)}
      />
      <input
        placeholder="start block"
        onChange={e => setStartBlock(e.target.value)}
      />
      <input
        placeholder="end block"
        onChange={e => setEndBlock(e.target.value)}
      />
      <button onClick={run}>
        Run <strong>Get Event</strong> of type {eventType || "___"} from{" "}
        {startBlock || "___"} -> {endBlock || "___"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
