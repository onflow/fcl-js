import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const TITLE = "Add New Key"
export const DESCRIPTION = "Add a new key to an Account on Flow."
export const VERSION = "0.0.9"
export const HASH = "eab124e9b9c40f5e4cf66a1e80ff92a0d7f2dfd385814ce2e4c43276fb68c4bf"
export const CODE = 
`transaction(publicKey: String, signatureAlgorithm: UInt8, hashAlgorithm: UInt8, weight: UFix64) {
    prepare(signer: AuthAccount) {
        let key = PublicKey(
            publicKey: publicKey.decodeHex(),
            signatureAlgorithm: signatureAlgorithm
        )

        signer.keys.add(
            publicKey: key,
            hashAlgorithm: hashAlgorithm,
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
