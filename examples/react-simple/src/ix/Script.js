import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const Script = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.params([sdk.param("foo", "bar")]),
      sdk.script`
        pub fun main(): Int {
          log("${p => p.foo}")
          return 7
        }
      `,
    ]), [
      sdk.resolve([
        sdk.resolveParams,
      ]),
    ]), { node: "http://localhost:8080" })
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
