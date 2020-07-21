import {signTransactionPayload} from "./ECDSA256Signer"
import flowJson from "../../../flow.json"

const bufferToHexString = buffer =>
  buffer.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    ""
  )
const hashToBuffer = hash => Buffer.from(hash, "hex")

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
