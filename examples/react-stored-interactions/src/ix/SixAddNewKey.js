import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import { template as addNewKey } from "@onflow/six-add-new-key"

export const SixAddNewKey = () => {
  const [result, setResult] = useState(null)
  const [newPublicKey, setNewPublicKey] = useState("")

  const run = async () => {
    
    fcl.config()
        .put("accessNode.api", "http://localhost:8080")
        .put("challenge.handshake", "http://localhost:3000/local/authn")
    
    const response = await fcl.send([
        addNewKey({
            proposer: fcl.currentUser().authorization,
            authorization: fcl.currentUser().authorization,     
            payer: fcl.currentUser().authorization,             
            publicKey: [newPublicKey]                          // New Public Key as a hex encoded string.
        })
    ])

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <input
        placeholder="new public key"
        onChange={e => setNewPublicKey(e.target.value)}
      />
      <button onClick={run}>
        Run <strong>Stored Interaction - Add New Public Key</strong> with new public key -> {newPublicKey || "___"}
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
