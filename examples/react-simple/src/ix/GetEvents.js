import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const GetEvents = () => {
  const [result, setResult] = useState(null)
  const [eventType, setEventType] = useState("")
  const [startBlock, setStartBlock] = useState("")
  const [endBlock, setEndBlock] = useState("")

  const run = async () => {
    const response = await fcl.send([
      sdk.getEvents(eventType, startBlock, endBlock),
    ])
    setResult(response)
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
