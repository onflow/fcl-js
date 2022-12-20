import {config} from "@onflow/config"

export function makeAuthzFn() {
  const {TransactionAuthorizer} = require("@freshmint/core")
  const {
    HashAlgorithm,
    InMemoryECSigner,
    SignatureAlgorithm,
    InMemoryECPrivateKey,
  } = require("@freshmint/core/crypto")
  
  config()
    .put("flow.network", "local")
    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  
  const PRIVATE_KEY_HEX =
    "4e07536c4a26956a03802625ca5bf3b26e0e1fe70463260a66e4d158e353516e"
  const privateKey = InMemoryECPrivateKey.fromHex(
    PRIVATE_KEY_HEX,
    SignatureAlgorithm.ECDSA_P256
  )
  const signer = new InMemoryECSigner(privateKey, HashAlgorithm.SHA3_256)
  const ownerAuthorizer = new TransactionAuthorizer({
    address: "f8d6e0586b0a20c7",
    keyIndex: 0,
    signer,
  })
  
  // authz function during testing
  global.__authz__ = ownerAuthorizer.toFCLAuthorizationFunction()
}