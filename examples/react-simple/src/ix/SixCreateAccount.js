import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import { template as SixCreateAccountTemplate} from "@onflow/six-create-account"
import {signingFunction} from "./utils/signing-function.js"
import {ec as EC} from "elliptic"
import * as rlp from "rlp"

const ec = new EC("p256")

// current cadded AuthAccount constructor (what you use to create an account on flow)
// requires a public key to be in a certain format. That format is an rlp encoded value
// that encodes the key itself, what curve it uses, how the signed values are hashed
// and the keys weight.
const encodePublicKeyForFlow = publicKey =>
  rlp
    .encode([
      Buffer.from(publicKey, "hex"), // publicKey hex to binary
      2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      1000, // give key full weight
    ])
    .toString("hex")

const genKeys = () => {
  const keys = ec.genKeyPair()
  const privateKey = keys.getPrivate("hex")
  const publicKey = keys.getPublic("hex").replace(/^04/, "")

  return {
    publicKey,
    privateKey,
    flowKey: encodePublicKeyForFlow(publicKey),
  }
}

export const SixCreateAccount = () => {
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

    const keys = genKeys()

    const response = await sdk.send(await sdk.pipe(sdk.build([
        SixCreateAccountTemplate({
            payer: sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0),
            proposer: sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, seqNum),
            authorization: sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0),
            code: "",
            publicKeys: [keys.flowKey],
        })
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveArguments,
        sdk.resolveAccounts,
        sdk.resolveSignatures,
        sdk.resolveValidators,
      ]),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Create Account</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
