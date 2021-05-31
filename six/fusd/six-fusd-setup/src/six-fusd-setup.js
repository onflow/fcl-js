import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "FUSD Setup"
export const DESCRIPTION = "Set up a FUSD Vault and Receiver for an account."
export const VERSION = "0.0.1"
export const HASH = "187055772ca2912d1eaa13845485891fc854a5094e2fbd613a0c6e8c914b293f"
export const CODE = 
`import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FUSD from 0xFUSDADDRESS

transaction {
  prepare(signer: AuthAccount) {

    let existingVault = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)

    // If the account is already set up that's not a problem, but we don't want to replace it
    if (existingVault != nil) {
        return
    }
    
    // Create a new FUSD Vault and put it in storage
    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

    // Create a public capability to the Vault that only exposes
    // the deposit function through the Receiver interface
    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
      /public/fusdReceiver,
      target: /storage/fusdVault
    )

    // Create a public capability to the Vault that only exposes
    // the balance field through the Balance interface
    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
      /public/fusdBalance,
      target: /storage/fusdVault
    )
  }
}
`

export const template = ({ proposer, authorization, payer }) => fcl.pipe([
    fcl.transaction(CODE),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer),
    fcl.validator(ix => {
        if (ix.authorizations.length > 1) throw new Error("template only requires one authorization.")
        return ix
    })
])
