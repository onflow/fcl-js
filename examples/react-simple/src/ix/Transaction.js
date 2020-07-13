import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {signingFunction} from "./utils/signing-function.js"

export const Transaction = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    const acctResponse = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.getAccount("f8d6e0586b0a20c7")
    ]), [
      sdk.resolve([
        sdk.resolveParams,
      ]),
    ]), { node: "http://localhost:8080" })

    const seqNum = acctResponse.account.keys[0].sequenceNumber

    // console.log(JSON.stringify(
    //   await sdk.pipe(await sdk.build([
    //     sdk.params([sdk.param("foo", t.String)]),
    //     sdk.args([sdk.arg(123, t.Int)]),
    //     sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    //     sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, seqNum)),
    //     sdk.transaction`transaction(msg: Int) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
    //     sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    //   ]), [
    //     sdk.resolve([
    //       sdk.resolveParams,
    //       sdk.resolveArguments,
    //       sdk.resolveAccounts,
    //       sdk.resolveSignatures,
    //     ]),
    //   ])
    // , null, 2))

    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.params([sdk.param("foo", t.String)]),
      sdk.args([sdk.arg(1, t.Int16)]),
      sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
      sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, seqNum)),
      sdk.transaction`transaction(msg: Int16) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
      sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveArguments,
        sdk.resolveAccounts,
        sdk.resolveSignatures,
        ix =>  {
          console.log(ix)
          return ix
        },
      ]),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
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
