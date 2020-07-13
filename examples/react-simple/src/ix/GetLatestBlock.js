import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetLatestBlock = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.getLatestBlock()
    ])), { node: "http://access-001.candidate4.nodes.onflow.org:9000" })
    setResult(await sdk.decodeResponse(response))
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
