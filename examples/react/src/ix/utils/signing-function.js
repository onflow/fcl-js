import { DefaultSigner } from "./signing"
import flowJson from "../../../flow.json"

const signer = new DefaultSigner()

const pk = flowJson.accounts.root.privateKey

export const signingFunction = async payload => {
  const sig = signer.signTransactionPayload(pk, payload)
  return sig
}
