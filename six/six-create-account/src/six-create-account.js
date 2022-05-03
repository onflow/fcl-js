import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "Create Account"
export const DESCRIPTION = "Create an Account on Flow with a Public Key."
export const VERSION = "0.0.9"
export const HASH = "a0a78aa7821144efd5ebb974bb52ba04609ce76c3863af9d45348db93937cf98"
export const CODE = 
`import Crypto
transaction(publicKey: String, signatureAlgorithm: UInt8, hashAlgorithm: UInt8, weight: UFix64) {
    prepare(signer: AuthAccount) {
        let key = PublicKey(
            publicKey: publicKey.decodeHex(),
            signatureAlgorithm: SignatureAlgorithm(rawValue: signatureAlgorithm)!
        )

        let account = AuthAccount(payer: signer)

        account.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm(rawValue: hashAlgorithm)!,
            weight: weight
        )
    }   
}
`

export const template = ({
    proposer,
    authorization,
    payer,
    publicKey,
    signatureAlgorithm,
    hashAlgorithm,
    weight
}) => fcl.pipe([
    fcl.invariant(publicKey !== "", "template({publicKey}) -- publicKey must not be an empty string."),
    fcl.invariant(signatureAlgorithm !== null, "template({signatureAlgorithm}) -- signatureAlgorithm must not be null."),
    fcl.invariant(hashAlgorithm !== null, "template({hashAlgorithm}) -- hashAlgorithm must not be null."),
    fcl.invariant(weight !== "", "template({weight}) -- weight must not be an empty string."),
    fcl.transaction(CODE),
    fcl.args([
        fcl.arg(publicKey, t.String),
        fcl.arg(signatureAlgorithm, t.UInt8),
        fcl.arg(hashAlgorithm, t.UInt8),
        fcl.arg(weight, t.UFix64)
    ]),
    fcl.proposer(proposer),
    fcl.authorizations([authorization]),
    fcl.payer(payer)
])
