import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetLatestBlock = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.getLatestBlock()
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveAuthorizations,
      ]),
    ]), { node: "http://localhost:8080" })
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
