import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetLatestBlock = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    /*

      Get Latest Block
      ----------------------

      Declaring an interaction which gets the latest block is delcared by calling the
      sdk.getLatestBlock builder.

    */

    const response = await sdk.send(await sdk.build([
      sdk.getLatestBlock()
    ]), { node: "http://localhost:8080" })

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
