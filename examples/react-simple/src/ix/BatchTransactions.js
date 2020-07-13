import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {signingFunction} from "./utils/signing-function.js"

export const BatchTransactions = () => {
  const [result, setResult] = useState(null)

  const getSeqNum = async () => {
    const acctResponse = await sdk.send(await sdk.pipe(await sdk.build([
        sdk.getAccount("f8d6e0586b0a20c7")
      ]), [
        sdk.resolve([
          sdk.resolveParams,
        ]),
      ]), { node: "http://localhost:8080" })
  
    return acctResponse.account.keys[0].sequenceNumber
  }

  const run = async () => {
    let response;

    // response = await sdk.send(await sdk.pipe(await sdk.build([
    //   sdk.params([sdk.param("foo", t.String)]),
    //   sdk.args([sdk.arg(1123123.3, t.UFix64)]),
    //   sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    //   sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, await getSeqNum())),
    //   sdk.transaction`transaction(msg: UFix64) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
    //   sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    // ]), [
    //   sdk.resolve([
    //     sdk.resolveParams,
    //     sdk.resolveArguments,
    //     sdk.resolveAccounts,
    //     sdk.resolveSignatures,
    //   ]),
    // ]), { node: "http://localhost:8080" })

    // response = await sdk.send(await sdk.pipe(await sdk.build([
    //   sdk.params([sdk.param("foo", t.String)]),
    //   sdk.args([sdk.arg(-1123123.3, t.Fix64)]),
    //   sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    //   sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, await getSeqNum())),
    //   sdk.transaction`transaction(msg: Fix64) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
    //   sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    // ]), [
    //   sdk.resolve([
    //     sdk.resolveParams,
    //     sdk.resolveArguments,
    //     sdk.resolveAccounts,
    //     sdk.resolveSignatures,
    //   ]),
    // ]), { node: "http://localhost:8080" })

    // response = await sdk.send(await sdk.pipe(await sdk.build([
    //     sdk.params([sdk.param("foo", t.String)]),
    //     sdk.args([sdk.arg(-1123123, t.Int128)]),
    //     sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    //     sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, await getSeqNum())),
    //     sdk.transaction`transaction(msg: Int128) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
    //     sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    //   ]), [
    //     sdk.resolve([
    //       sdk.resolveParams,
    //       sdk.resolveArguments,
    //       sdk.resolveAccounts,
    //       sdk.resolveSignatures,
    //     ]),
    //   ]), { node: "http://localhost:8080" })

    // response = await sdk.send(await sdk.pipe(await sdk.build([
    //     sdk.params([sdk.param("foo", t.String)]),
    //     sdk.args([sdk.arg({key: 1, value: "one"}, t.Dictionary({key: t.Int, value: t.String}))]),
    //     sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
    //     sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, await getSeqNum())),
    //     sdk.transaction`transaction(msg: {Int: String}) { prepare(acct: AuthAccount) { log(msg) } execute { log("Hello") } }`,
    //     sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
    //     ]), [
    //     sdk.resolve([
    //         sdk.resolveParams,
    //         sdk.resolveArguments,
    //         sdk.resolveAccounts,
    //         sdk.resolveSignatures,
    //     ]),
    // ]), { node: "http://localhost:8080" })

    // setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Batch Transactions</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
