import * as fcl from "@onflow/fcl"

fcl.config()
  .put("accessNode.api", "http://localhost:8080") // local Flow emulator
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
  // .put("accessNode.api", "https://access-testnet.onflow.org") // Flow testnet
  // .put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn") // Blocto testnet wallet
