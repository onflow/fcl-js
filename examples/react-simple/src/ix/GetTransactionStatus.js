import React, {useState} from "react"
import * as sdk from "@onflow/sdk"

export const GetTransactionStatus = () => {
  const [result, setResult] = useState(null)
  const [txId, setTxId] = useState("")

  const run = async () => {
    
    /*

      Get Transaction Status
      ----------------------

      Declaring an interaction which gets the status of a transaction is delcared by calling the
      sdk.getTransactionStatus builder.

      sdk.getTransactionStatus consumes the id of a transaction to fetch it's status.

      Refer to https://github.com/onflow/flow-js-sdk/blob/master/packages/response/README.md to see the shape of response
      for a Get Transaction Status interaction.

    */
    
    const response = await sdk.send(await sdk.build([
      sdk.getTransactionStatus(txId)
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <input
        placeholder="transaction id"
        onChange={e => setTxId(e.target.value)}
      />
      <button onClick={run}>
        Run <strong>GetTransaction</strong> for: {txId || "_____"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
