import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetAccount = () => {
  const [result, setResult] = useState(null)
  const [addr, setAddr] = useState("")

  const run = async () => {

    /*

      Get Account
      -----------

      Declaring an interaction which gets an account is done by calling the sdk.getAccount builder.
      sdk.getAccount consumes an address of an account to get.

    */

    const response = await sdk.send(await sdk.build([
      sdk.getAccount(addr)
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <input placeholder="acct#" onChange={e => setAddr(e.target.value)} />
      <button onClick={run}>
        Run <strong>GetAccount</strong> for: {addr || "_____"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
