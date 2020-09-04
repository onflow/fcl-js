import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import { template as addNewKey } from "@onflow/six-add-new-key"
const rlp = require("rlp")

const encodePublicKeyForFlow = (publicKey) =>
  rlp
    .encode([
      Buffer.from(publicKey), // publicKey hex to binary
      2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      1000, // give key full weight
    ])
    .toString("hex")

import AccountKeyInput, {defaultAccountKey, encodeAccountKey} from "../account-keys"

export const SixAddNewKey = () => {
  const [accountKey, setAccountKey] = useState(defaultAccountKey)
  const [result, setResult] = useState(null)

  const run = async () => {

    const response = await fcl.send([
      sdk.pipe([
        addNewKey({
          proposer: fcl.currentUser().authorization,
          authorization: fcl.currentUser().authorization,     
          payer: fcl.currentUser().authorization,             
          publicKey: encodeAccountKey(accountKey),
        }),
        fcl.limit(100),
      ])
    ])

    setResult(await sdk.decode(response))
  }

  return (
    <div>
      <AccountKeyInput 
        accountKey={accountKey} 
        onChange={(accountKey) => setAccountKey(accountKey)} />
      <button onClick={run}>
        Run <strong>Stored Interaction - Add New Public Key</strong> with new public key -> {accountKey.publicKey || "___"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
