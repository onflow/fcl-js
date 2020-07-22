import * as sdk from "@onflow/sdk"
import {signingFunction} from "./signing-function.js"

export const authorizationFunction = async (account) => {
    
    const response = await sdk.send(await sdk.build([
        sdk.getAccount("f8d6e0586b0a20c7")
      ]), { node: "http://localhost:8080" })
  
    const decoded = await sdk.decodeResponse(response)

    return {
      ...account,
      addr: "f8d6e0586b0a20c7",
      keyId: 0,
      sequenceNum: decoded.keys[0].sequenceNumber,
      signature: account.signature || null,
      signingFunction,
      resolve: null,
      role: account.role,
    }
  }