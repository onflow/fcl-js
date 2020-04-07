import {signTransactionPayload} from "./ECDSA256Signer"
import flowJson from "../../../flow.json"

// NOTE: flow.json will be updated with this once it becomes
// valid in an upcoming version of the emulator
const flowJson = {
  accounts: {
    root: {
      address: "0000000000000000000000000000000000000001",
      privateKey:
        "3077020101042061c657112ff803b7cb4b36a2e51a1c3b21c364a7fcc5f04c4fc2e1d8ceb8a90ca00a06082a8648ce3d030107a14403420004a7bb4680c6995a1db5de602534e95102ffbff9c32fde086bd72c1bfdcfa84fbe6d39d69e2c62802ab0bd5f32e1a89da59c1145e70c2222ff73b74d3587bb1699",
    },
  },
}

export const signingFunction = (payload) => {
  return signTransactionPayload(flowJson.accounts.root.privateKey, payload)
}
