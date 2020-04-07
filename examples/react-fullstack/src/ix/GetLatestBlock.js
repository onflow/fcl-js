import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const GetLatestBlock = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await fcl.send([sdk.getLatestBlock()])
    setResult(response)
  }

  return (
    <div>
      <button onClick={run}>
        run <strong>GetLatestBlock</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
