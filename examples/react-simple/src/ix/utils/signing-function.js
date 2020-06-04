import {bufferToHexString, hashToBuffer} from "@onflow/bytes"
import {signTransactionPayload} from "./ECDSA256Signer"
import flowJson from "../../../flow.json"

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
    signature: bufferToHexString(signTransactionPayload(flowJson.accounts.service.privateKey, hashToBuffer(message)))
  }
}
