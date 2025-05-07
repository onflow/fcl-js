import {SdkTransport} from "@onflow/typedefs"
import {send} from "./send/send-http"
import {subscribe} from "./subscribe/subscribe"

export const httpTransport: SdkTransport = {
  send,
  subscribe,
}
