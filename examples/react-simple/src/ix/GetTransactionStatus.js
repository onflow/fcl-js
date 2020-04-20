import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"

export const GetTransaction = () => {
  const [result, setResult] = useState(null)
  const [txHash, setTxHash] = useState("")

  const run = async () => {
    const response = await fcl.send([sdk.getTransactionStatus(txHash)])
    setResult(response)
  }

  return (
    <div>
      <input
        placeholder="transaction hash"
        onChange={e => setTxHash(e.target.value)}
      />
      <button onClick={run}>
        Run <strong>GetTransaction</strong> for: {txHash || "_____"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
