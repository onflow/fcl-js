import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import { template as createAccount } from "@onflow/six-create-account"

export const SixCreateAccount = () => {
  const [result, setResult] = useState(null)
  const [publicKeys, setPublicKeys] = useState("")

  const run = async () => {

    fcl.config()
        .put("accessNode.api", "http://localhost:8080")
        .put("challenge.handshake", "http://localhost:3000/local/authn")

    const response = await fcl.send([
        createAccount({
            proposer: fcl.currentUser().authorization,
            authorization: fcl.currentUser().authorization,     
            payer: fcl.currentUser().authorization,             
            publicKeys: publicKeys.split(',')                // Public Keys as hex encoded strings.
        })
    ])

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <input
        placeholder="public keys (comma seperated)"
        onChange={e => setPublicKeys(e.target.value)}
      />
      <button onClick={run}>
        Run <strong>Stored Interaction - Create Account</strong> with public keys -> {publicKeys || "___"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
