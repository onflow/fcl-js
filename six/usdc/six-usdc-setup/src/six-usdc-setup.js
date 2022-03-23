import * as fcl from "@onflow/fcl"
import {config} from "@onflow/config"

const DEPS = new Set([
    "0xFUNGIBLETOKENADDRESS",
    "0xUSDCADDRESS"
])

export const TITLE = "USDC Setup"
export const DESCRIPTION = "Set up a USDC Vault and Receiver for an account."
export const VERSION = "0.0.2"
export const HASH = "887673892a2e2c12337394570dfa30c5669e93f537ae426690f402799514a9a1"
export const CODE = 
`import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0x1ab3c177460e1e4a

transaction {

    prepare(signer: AuthAccount) {

        // Return early if the account already stores a FiatToken Vault
        if signer.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) != nil {
            return
        }

        // Create a new ExampleToken Vault and put it in storage
        signer.save(
            <-FiatToken.createEmptyVault(),
            to: FiatToken.VaultStoragePath
        )

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(
            FiatToken.VaultReceiverPubPath,
            target: FiatToken.VaultStoragePath
        )

        // Create a public capability to the Vault that only exposes
        // the UUID() function through the VaultUUID interface
        signer.link<&FiatToken.Vault{FiatToken.ResourceId}>(
            FiatToken.VaultUUIDPubPath,
            target: FiatToken.VaultStoragePath
        )

        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        signer.link<&FiatToken.Vault{FungibleToken.Balance}>(
            FiatToken.VaultBalancePubPath,
            target: FiatToken.VaultStoragePath
        )

    }
}`

class UndefinedConfigurationError extends Error {
    constructor(address) {
      const msg = `Stored Interaction Error: Missing configuration for ${address}. Please see the following to learn more: https://github.com/onflow/flow-js-sdk/blob/master/six/six-delegate-new-locked-flow/README.md`.trim()
      super(msg)
      this.name = "Stored Interaction Undefined Address Configuration Error"
    }
}

const addressCheck = async address => {
    if (!await config().get(address)) throw new UndefinedConfigurationError(address)
}

export const template = async ({ proposer, authorization, payer }) => {
    for (let addr of DEPS) await addressCheck(addr)

    return fcl.pipe([
        fcl.transaction(CODE),
        fcl.proposer(proposer),
        fcl.authorizations([authorization]),
        fcl.payer(payer)
    ])
}
