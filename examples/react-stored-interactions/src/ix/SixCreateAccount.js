import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import { template as createAccount } from "@onflow/six-create-account"
const rlp = require("rlp")

const encodePublicKeyForFlow = (publicKey) =>
    rlp.encode([
      Buffer.from(publicKey, "hex"), // publicKey hex to binary
      2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      1000, // give key full weight
    ])
    .toString("hex")

import AccountKeyInput, {defaultAccountKey, encodeAccountKey} from "../account-keys"

export const SixCreateAccount = () => {
  const [result, setResult] = useState(null)
  const [accountKeys, setAccountKeys] = useState([])

  const run = async () => {
    try {
      const response = await fcl.send([
        sdk.pipe([
          createAccount({
            proposer: fcl.currentUser().authorization,
            authorization: fcl.currentUser().authorization,     
            payer: fcl.currentUser().authorization,             
            publicKeys: accountKeys.map(encodeAccountKey),
          }),
          fcl.limit(100),
        ])
      ])

      setResult(await fcl.decode(response))
    } catch (e) {
        console.log('error', e)
    }
  }

  return (
    <div> 
      {
        accountKeys.map((accountKey, i) => {
          return (
            <AccountKeyInput 
              key={i}
              accountKey={accountKey}
              onChange={(accountKey) => setAccountKeys([
                ...accountKeys.slice(0, i), 
                accountKey, 
                ...accountKeys.slice(i+1),
              ])} 
            />
          )
        })
      }
      <button onClick={() => setAccountKeys([...accountKeys, defaultAccountKey])}>
        add public key
      </button>
      <button onClick={run}>
        Run <strong>Stored Interaction - Create Account</strong> with {accountKeys.length} public keys
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
