import {bufferToHexString, hashToBuffer} from "@onflow/bytes"
import {signTransactionPayload} from "./ECDSA256Signer"

// NOTE: flow.json will be updated with this once it becomes
// valid in an upcoming version of the emulator
const flowJson = {
  accounts: {
    root: {
      address: "0000000000000000000000000000000000000001",
      privateKey:
        "30770201010420c0510a83ba6eafe9caa4a56df63ca30d732d7023267411e277bd18198ef95004a00a06082a8648ce3d030107a14403420004fb005476ddf459006240d82573f3fdf39ce74fb344a701e67119f23749bc6657c82286999ce814a334287288f82d20e41a24b52a1909995aa6d880bb1aa307f6",
      hashAlg: "my-hash-alg",
      signAlg: "my-sign-alg"
    },
  },
}

export const signingFunction = ({
  message,
  addr,
  keyId,
  roles: {
    proposer,
    authorizer,
    payer,
  },
  interaction,
}) => {
  return {
    addr,
    keyId,
    signature: bufferToHexString(signTransactionPayload(flowJson.accounts.root.privateKey, hashToBuffer(message)))
  }
}
