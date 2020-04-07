import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const Ping = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await fcl.send([sdk.ping()])
    setResult(response)
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Ping</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
