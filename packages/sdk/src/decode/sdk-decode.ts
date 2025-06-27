import {decodeResponse} from "./decode"
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"

export function createDecode(context: SdkContext) {
  /**
   * @description Decodes a response using the configured decoders.
   * @param response The response to decode.
   * @returns A promise that resolves to the decoded response.
   */
  async function decode(response: any): Promise<any> {
    return decodeResponse(response, context.customDecoders)
  }

  return decode
}

export const decode = /* @__PURE__ */ withGlobalContext(createDecode)
