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
    signature: bufferToHexString(signTransactionPayload("68ee617d9bf67a4677af80aaca5a090fcda80ff2f4dbc340e0e36201fa1f1d8c", hashToBuffer(message)))
  }
}
