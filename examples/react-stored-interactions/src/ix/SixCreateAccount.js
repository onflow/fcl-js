import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import { template as createAccount } from "@onflow/six-create-account"
import AccountKeyInput, {defaultAccountKey, encodeAccountKey} from "../account-keys"
const rlp = require("rlp")

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
