import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const Ping = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    /*

      Ping
      ----
      
      To declare a ping interaction, call the sdk.ping builder.
      Ping is a simple way to check if the Flow JS-SDK is able to connect to your desired access node, emulator or otherwise.

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
