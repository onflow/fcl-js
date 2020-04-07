import {signTransactionPayload} from "./ECDSA256Signer"
import flowJson from "../../../flow.json"

const pk = flowJson.accounts.root.privateKey

export const signingFunction = payload => {
  return signTransactionPayload(pk, payload)
}
