import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const Script = () => {
  const [result, setResult] = useState(null)

  const run = async () => {
    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.script`
        pub fun main(num: Int): Int {
          return num
        }
      `,
      sdk.args([sdk.arg(10, t.Int)])
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveArguments,
        sdk.resolveAccounts,
        sdk.resolveSignatures,
        sdk.resolveValidators,
        ix => {
          console.log('ix', ix)
          return ix
        }
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
