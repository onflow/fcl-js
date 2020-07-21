import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const Ping = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    /*



    */


    const response = await sdk.send(await sdk.build([
      sdk.ping()
    ]), { node: "http://localhost:8080" })
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
