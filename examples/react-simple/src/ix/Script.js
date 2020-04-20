import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const Script = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await fcl.send([
      sdk.params([sdk.param("foo", "bar")]),
      sdk.script`
        pub fun main(): Int {
          log("${p => p.foo}")
          return 7
        }
      `,
    ])
    setResult(await sdk.decodeResponse(response))
  }

  console.log('result', result)

  return (
    <div>
      <button onClick={run}>
        Run <strong>Script</strong>
      </button>
      <pre>{JSON.stringify(result)}</pre>
    </div>
  )
}
