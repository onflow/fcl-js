---
"@onflow/fcl": major
---

# Removed default contract address for verifyAccountProof, verifyUserSignatures

AppUtils.verifyAccountProof and AppUtils.verifyUserSignatures now requires
setting `fcl.config.flow.network` (testnet or mainnet) or override contract address via
`opts.fclCryptoContract`
