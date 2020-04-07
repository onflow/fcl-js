import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const GetAccount = () => {
  const [result, setResult] = useState(null)
  const [acct, setAcct] = useState("")

  const run = async () => {
    const response = await fcl.send([sdk.getAccount(acct)])
    setResult(response)
  }

  return (
    <div>
      <input placeholder="acct#" onChange={e => setAcct(e.target.value)} />
      <button onClick={run}>
        Run <strong>GetAccount</strong> for: {acct || "_____"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
