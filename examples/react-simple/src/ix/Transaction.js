import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as fcl from "@onflow/fcl"
import {formatResponse} from "./utils/format-response"
import {signingFunction} from "./utils/signing-function.js"

export const Transaction = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    const acctResponse = await fcl.send([
      sdk.getAccount("01")
    ])

    const seqNum = acctResponse.account.keys[0].sequenceNumber

    const response = await fcl.send([
      sdk.params([sdk.param("foo", "rawr")]),
      sdk.payer(sdk.authorization("01", signingFunction, 0)),
      sdk.proposer("01", 0, seqNum),
      sdk.transaction`transaction { prepare(acct: AuthAccount) {} execute { log("Hello") } }`,
      sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
    ])
    setResult(response)
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Transaction</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
